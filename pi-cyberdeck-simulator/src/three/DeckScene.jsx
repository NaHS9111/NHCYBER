import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildDevice, KEY_INDEX } from './buildDevice.js'

const CAMERA_PRESETS = {
  'berry-deck': {
    build: { pos: [10, 6.5, 23], target: [0, 0.2, 0] },
    use: { pos: [0, 2.4, 17.5], target: [0, 0.9, 0] },
    front: { pos: [0, 0.4, 25], target: [0, 0.2, 0] },
  },
  'raspi-deck': {
    build: { pos: [20, 16, 36], target: [0, 2.5, 0] },
    use: { pos: [0, 9, 17], target: [0, 6.4, -4] },
    front: { pos: [0, 7, 38], target: [0, 4.5, -2] },
  },
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

const DeckScene = forwardRef(function DeckScene(
  { config, screenCanvas, explode = 0, screenOn = false, highlightCategory = null, cameraPreset = 'build', autoRotate = false, onReady },
  ref
) {
  const mountRef = useRef(null)
  const stateRef = useRef({})

  // ── Initialisation unique du moteur de rendu ────────────────────────────
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 400)
    camera.position.set(9, 6, 16)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.minDistance = 6
    controls.maxDistance = 70
    controls.maxPolarAngle = Math.PI * 0.86

    // Éclairage : clé chaude, appoint froid, contre-jour vert discret
    scene.add(new THREE.AmbientLight(0x415466, 2.0))
    const key = new THREE.DirectionalLight(0xfff4e6, 3.0)
    key.position.set(9, 14, 11)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 70
    key.shadow.camera.left = -22
    key.shadow.camera.right = 22
    key.shadow.camera.top = 22
    key.shadow.camera.bottom = -22
    key.shadow.bias = -0.0012
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9dc4ff, 1.15)
    fill.position.set(-12, 5, 9)
    scene.add(fill)
    // Contre-jour vert : signature de l'atelier, volontairement discret pour
    // ne pas teinter les surfaces claires.
    const rim = new THREE.DirectionalLight(0x00ff9d, 0.3)
    rim.position.set(-6, 4, -12)
    scene.add(rim)
    const front = new THREE.DirectionalLight(0xffffff, 0.5)
    front.position.set(0, 2, 16)
    scene.add(front)

    // Ombre de contact douce sous l'appareil
    const shadowTex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 256
      const g = c.getContext('2d').createRadialGradient(128, 128, 8, 128, 128, 126)
      g.addColorStop(0, 'rgba(0,0,0,0.55)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      const ctx = c.getContext('2d')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    })()
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 46),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    )
    contact.rotation.x = -Math.PI / 2
    contact.position.y = -0.4
    scene.add(contact)

    const clock = new THREE.Clock()
    const st = stateRef.current
    Object.assign(st, {
      renderer, scene, camera, controls, contact,
      device: null, explodeCurrent: 0, explodeTarget: 0,
      keyAnims: [], camAnim: null, disposed: false,
    })

    const onResize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(clock.getDelta(), 0.05)

      // Interpolation douce vers la valeur d'éclatement cible
      st.explodeCurrent += (st.explodeTarget - st.explodeCurrent) * Math.min(1, dt * 5.5)
      applyExplode(st.device, st.explodeCurrent)

      // Retour des touches enfoncées
      st.keyAnims = st.keyAnims.filter((a) => {
        a.t += dt
        const k = a.mesh
        const p = Math.min(1, a.t / 0.22)
        const depth = Math.sin(p * Math.PI) * 0.09
        const axis = k.userData.axis === 'y' ? 'y' : 'z'
        k.position[axis] = k.userData.baseZ - depth
        k.material.emissive.setHex(0x00ff9d)
        k.material.emissiveIntensity = (1 - p) * 0.9
        if (p >= 1) {
          k.position[axis] = k.userData.baseZ
          k.material.emissive.setHex(k.material.userData._emisOrig ?? 0x000000)
          k.material.emissiveIntensity = 1
          return false
        }
        return true
      })

      // Transition de caméra
      if (st.camAnim) {
        st.camAnim.t += dt
        const p = easeInOut(Math.min(1, st.camAnim.t / st.camAnim.dur))
        camera.position.lerpVectors(st.camAnim.from, st.camAnim.to, p)
        controls.target.lerpVectors(st.camAnim.fromT, st.camAnim.toT, p)
        if (p >= 1) st.camAnim = null
      }

      controls.autoRotate = st.autoRotate && !st.camAnim
      controls.autoRotateSpeed = 0.7
      controls.update()

      if (st.device?.screen) st.device.screen.texture.needsUpdate = true
      renderer.render(scene, camera)
    }
    loop()

    onReady?.()

    return () => {
      st.disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      disposeGroup(scene)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  // ── (Re)construction du modèle quand la configuration change ────────────
  useEffect(() => {
    const st = stateRef.current
    if (!st.scene || !config || !screenCanvas) return
    if (st.device) {
      st.scene.remove(st.device.root)
      disposeGroup(st.device.root)
    }
    const device = buildDevice(config, screenCanvas)
    st.device = device
    st.scene.add(device.root)
    st.contact.position.y = config.typeId === 'berry-deck' ? -6.6 : -0.45
    applyExplode(device, st.explodeCurrent)
    applyHighlight(device, highlightCategory)
    if (device.screen) device.screen.light.intensity = screenOn ? 1.5 : 0
    moveCamera(st, config.typeId, cameraPreset, 0)
  }, [
    screenCanvas,
    config?.typeId, config?.board, config?.keyboard, config?.display,
    config?.power, config?.storage, config?.case,
  ])

  useEffect(() => { stateRef.current.explodeTarget = explode }, [explode])
  useEffect(() => { stateRef.current.autoRotate = autoRotate }, [autoRotate])

  useEffect(() => {
    const st = stateRef.current
    if (st.device) applyHighlight(st.device, highlightCategory)
  }, [highlightCategory])

  useEffect(() => {
    const st = stateRef.current
    if (st.device?.screen) st.device.screen.light.intensity = screenOn ? 1.5 : 0
  }, [screenOn])

  useEffect(() => {
    const st = stateRef.current
    if (st.device && config) moveCamera(st, config.typeId, cameraPreset, 0.9)
  }, [cameraPreset])

  useImperativeHandle(ref, () => ({
    pressKey(char) {
      const st = stateRef.current
      if (!st.device) return
      const id = KEY_INDEX[String(char).toLowerCase()]
      const keys = st.device.keys
      let mesh = id ? keys[id] : null
      if (!mesh) {
        // Clavier générique : on illumine une touche pseudo-aléatoire stable
        const ids = Object.keys(keys)
        if (!ids.length) return
        const code = String(char).charCodeAt(0) || 0
        mesh = keys[ids[code % ids.length]]
      }
      if (mesh && !st.keyAnims.some((a) => a.mesh === mesh)) st.keyAnims.push({ mesh, t: 0 })
    },
    resetView() {
      const st = stateRef.current
      if (st.device && config) moveCamera(st, config.typeId, cameraPreset, 0.7)
    },
  }))

  return <div ref={mountRef} className="w-full h-full" />
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function applyExplode(device, e) {
  if (!device) return
  const maxOrder = Math.max(1, ...device.parts.map((p) => p.userData.order))
  const span = 0.6
  device.parts.forEach((p) => {
    const start = (p.userData.order / maxOrder) * (1 - span)
    const t = easeInOut(Math.max(0, Math.min(1, (e - start) / span)))
    p.position.lerpVectors(p.userData.assembled, p.userData.exploded, t)
  })
}

// La teinte de survol est mémorisée par matériau, pas par mesh : plusieurs
// meshes partagent la même instance, et un cache par mesh ferait réécrire la
// valeur « d'origine » déjà teintée par un voisin — la pièce resterait allumée.
function applyHighlight(device, category) {
  device._highlighted?.forEach((m) => m.emissive.setHex(m.userData._emisOrig ?? 0x000000))
  const touched = new Set()
  if (category) {
    device.parts.forEach((p) => {
      if (p.userData.category !== category) return
      p.traverse((o) => {
        if (!o.isMesh || !o.material?.emissive) return
        const mat = o.material
        if (mat.userData._emisOrig === undefined) mat.userData._emisOrig = mat.emissive.getHex()
        mat.emissive.setHex(0x00542f)
        mat.emissiveIntensity = 1
        touched.add(mat)
      })
    })
  }
  device._highlighted = touched
}

function moveCamera(st, typeId, preset, dur) {
  const p = (CAMERA_PRESETS[typeId] || CAMERA_PRESETS['raspi-deck'])[preset] || CAMERA_PRESETS[typeId].build
  const to = new THREE.Vector3(...p.pos)
  const toT = new THREE.Vector3(...p.target)
  if (dur <= 0) {
    st.camera.position.copy(to)
    st.controls.target.copy(toT)
    st.camAnim = null
    return
  }
  st.camAnim = { from: st.camera.position.clone(), to, fromT: st.controls.target.clone(), toT, t: 0, dur }
}

function disposeGroup(root) {
  root.traverse((o) => {
    if (o.isMesh) {
      o.geometry?.dispose()
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      mats.forEach((m) => m && m.dispose())
    }
  })
}

export default DeckScene
