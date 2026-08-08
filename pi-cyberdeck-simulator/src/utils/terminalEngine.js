// Moteur de terminal 100% simulé, côté client, hors ligne.
// Aucune commande ici n'exécute quoi que ce soit de réel : ni réseau, ni
// système de fichiers, ni exploitation. Tout est du texte scripté à but
// pédagogique, dans un labo fictif isolé (10.13.37.0/24).

const LAB_PASSWORD = 'Tr41n3r!2024'
const LAB_WIFI_SSID = 'lab-range'

const LOCAL_FS = {
  '/home/trainee': {
    dirs: ['notes'],
    files: {
      'readme.txt':
        "Bienvenue sur ton cyberdeck. Ce shell est un simulateur pédagogique.\nTape 'help' pour voir les commandes disponibles.",
      'lab-brief.txt':
        "LABO FICTIF — 10.13.37.0/24\nAutorisation: entraînement uniquement, réseau isolé simulé.\nCible d'entraînement: 10.13.37.42 (utilisateur: trainee)\nMot de passe fourni en séance: (voir énoncé de mission)",
    },
  },
  '/home/trainee/notes': {
    dirs: [],
    files: { 'todo.md': "- [ ] Configurer le Wi-Fi du labo\n- [ ] Scanner 10.13.37.0/24\n- [ ] Se connecter à la cible" },
  },
}

const REMOTE_FS = {
  '/home/trainee': {
    dirs: [],
    files: {
      'welcome.txt': 'Bienvenue sur target-lab-42 (hôte fictif du labo d\'entraînement).',
      'access.log': '10.13.37.55 - - "GET /status HTTP/1.1" 200\n10.13.37.55 - - "SSH LOGIN trainee" accepted',
      'flag.txt': "🏁 MISSION VALIDÉE — accès distant obtenu dans le labo fictif.\nCeci n'est qu'un exercice : jamais sans autorisation sur un vrai système.",
    },
  },
}

export function createInitialState(deviceInfo) {
  return {
    device: deviceInfo,
    mode: 'local', // 'local' | 'awaiting-password' | 'remote' | 'awaiting-newpassword'
    cwd: '/home/trainee',
    remoteCwd: '/home/trainee',
    pendingSSH: null,
    wifiConnected: false,
    passwordChanged: false,
    updated: false,
    firewallEnabled: false,
    gpgKeyGenerated: false,
    historyCmds: [],
  }
}

export function prompt(state) {
  if (state.mode === 'awaiting-password') return `Password for ${state.pendingSSH?.user}@${state.pendingSSH?.host}: `
  if (state.mode === 'awaiting-newpassword') return 'Nouveau mot de passe: '
  if (state.mode === 'remote') return `${state.pendingSSH?.user}@target-lab-42:${state.remoteCwd}$ `
  const board = state.device?.boardShort || 'pi'
  return `trainee@${board}:${state.cwd}$ `
}

function fsFor(state) {
  return state.mode === 'remote' ? REMOTE_FS : LOCAL_FS
}

function cwdFor(state) {
  return state.mode === 'remote' ? state.remoteCwd : state.cwd
}

function resolvePath(base, arg) {
  if (!arg || arg === '.') return base
  if (arg === '..') {
    const parts = base.split('/').filter(Boolean)
    parts.pop()
    return '/' + parts.join('/') || '/'
  }
  if (arg.startsWith('/')) return arg
  return (base.endsWith('/') ? base : base + '/') + arg
}

function listDir(fs, path) {
  const node = fs[path]
  if (!node) return null
  return [...node.dirs.map((d) => d + '/'), ...Object.keys(node.files)]
}

const HELP_LOCAL = [
  'Commandes disponibles :',
  '  help                     affiche cette aide',
  '  clear                    efface l\'écran',
  '  whoami / id               identité courante',
  '  pwd / ls / cd / cat        navigation dans le système de fichiers',
  '  uname -a / neofetch        infos système du cyberdeck',
  '  ifconfig / ip a            interfaces réseau',
  '  nmcli device wifi list     réseaux Wi-Fi visibles',
  '  nmcli device wifi connect <ssid>   rejoindre un réseau',
  '  ping <hôte>                tester la connectivité',
  '  nmap <cible|CIDR>          scanner le labo fictif',
  '  ssh <user>@<hôte>          se connecter à la cible du labo',
  '  passwd                    changer le mot de passe local',
  '  apt update / apt upgrade   mettre à jour les paquets (simulé)',
  '  ufw enable                 activer le pare-feu (simulé)',
  '  gpg --gen-key / --list-keys  générer/lister une paire de clés (simulé)',
  '  history                   historique des commandes',
  '  man <commande>              page de manuel (simulée)',
  '  reboot / shutdown          redémarrer / éteindre (simulé)',
]

const HELP_REMOTE = [
  'Commandes disponibles (session distante) :',
  '  help / whoami / id / pwd / ls / cd / cat',
  '  history',
  '  exit / logout             fermer la session SSH',
]

function neofetchArt(state) {
  const d = state.device || {}
  return [
    '     ▟█▙      ' + (d.name || 'Cyberdeck'),
    '    ▟███▙     ' + '-'.repeat((d.name || 'Cyberdeck').length),
    '   ▟█████▙    OS: ' + (d.osName || 'inconnu'),
    '   ▜█████▛    Carte: ' + (d.boardName || 'inconnue'),
    '    ▜███▛     Clavier: ' + (d.keyboardName || 'aucun'),
    '     ▜█▛      Écran: ' + (d.displayName || 'headless'),
    '              Batterie: ' + (d.powerName || 'secteur'),
  ]
}

export function runCommand(state, rawInput) {
  const input = rawInput
  const trimmed = input.trim()

  // ── Password capture for SSH ──────────────────────────────────────────
  if (state.mode === 'awaiting-password') {
    const next = { ...state, historyCmds: [...state.historyCmds, '•'.repeat(trimmed.length || 1)] }
    if (trimmed === LAB_PASSWORD) {
      next.mode = 'remote'
      return {
        state: next,
        lines: [
          '',
          'Authentication successful.',
          'Welcome to target-lab-42 (labo fictif d\'entraînement).',
          "Rappel : environnement isolé, à usage pédagogique uniquement.",
          '',
        ],
      }
    }
    next.mode = 'local'
    next.pendingSSH = null
    return { state: next, lines: ['Permission denied, please try again.'] }
  }

  // ── New password capture ──────────────────────────────────────────────
  if (state.mode === 'awaiting-newpassword') {
    const next = {
      ...state,
      mode: 'local',
      passwordChanged: true,
      historyCmds: [...state.historyCmds, '•'.repeat(trimmed.length || 1)],
    }
    return { state: next, lines: ['Mot de passe mis à jour avec succès.', 'passwd: password updated successfully'] }
  }

  if (trimmed === '') return { state, lines: [] }

  const histState = { ...state, historyCmds: [...state.historyCmds, trimmed] }
  const [cmd, ...args] = trimmed.split(/\s+/)
  const argStr = args.join(' ')

  const fs = fsFor(histState)
  const cwd = cwdFor(histState)
  const isRemote = histState.mode === 'remote'

  switch (cmd) {
    case 'help':
      return { state: histState, lines: isRemote ? HELP_REMOTE : HELP_LOCAL }

    case 'whoami':
    case 'id':
      return { state: histState, lines: [isRemote ? 'svc-report (uid=1002)' : 'trainee (uid=1000)'] }

    case 'pwd':
      return { state: histState, lines: [cwd] }

    case 'ls': {
      const path = resolvePath(cwd, args.find((a) => !a.startsWith('-')))
      const items = listDir(fs, path)
      if (!items) return { state: histState, lines: [`ls: impossible d'accéder à '${path}': dossier introuvable`] }
      return { state: histState, lines: [items.join('  ') || '(vide)'] }
    }

    case 'cd': {
      const target = resolvePath(cwd, args[0] || '/home/trainee')
      if (!fs[target]) return { state: histState, lines: [`cd: dossier introuvable : ${args[0] || ''}`] }
      const key = isRemote ? 'remoteCwd' : 'cwd'
      return { state: { ...histState, [key]: target }, lines: [] }
    }

    case 'cat': {
      if (!args[0]) return { state: histState, lines: ['cat: argument manquant'] }
      const node = fs[cwd]
      const content = node?.files?.[args[0]]
      if (content === undefined) return { state: histState, lines: [`cat: ${args[0]}: fichier introuvable`] }
      return { state: histState, lines: content.split('\n') }
    }

    case 'clear':
      return { state: histState, lines: [], clear: true }

    case 'uname':
      return {
        state: histState,
        lines: [
          argStr.includes('-a')
            ? `Linux ${histState.device?.boardShort || 'pi'} 6.6.31-v8+ #1 SMP PREEMPT aarch64 GNU/Linux (simulé)`
            : 'Linux',
        ],
      }

    case 'neofetch':
      return { state: histState, lines: neofetchArt(histState) }

    case 'date':
      return { state: histState, lines: [new Date().toString()] }

    case 'ifconfig':
    case 'ip': {
      if (cmd === 'ip' && args[0] !== 'a' && args[0] !== 'addr') {
        return { state: histState, lines: [`ip: sous-commande inconnue : ${argStr}`] }
      }
      const lines = [
        'lo: flags=73<UP,LOOPBACK,RUNNING> mtu 65536',
        '    inet 127.0.0.1  netmask 255.0.0.0',
      ]
      if (histState.wifiConnected) {
        lines.push('wlan0: flags=4163<UP,BROADCAST,RUNNING> mtu 1500')
        lines.push('    inet 10.13.37.55  netmask 255.255.255.0  broadcast 10.13.37.255')
      } else {
        lines.push('wlan0: flags=4098<BROADCAST,MULTICAST> mtu 1500  (non connecté)')
      }
      return { state: histState, lines }
    }

    case 'nmcli': {
      if (args[0] === 'device' && args[1] === 'wifi' && args[2] === 'list') {
        return {
          state: histState,
          lines: [
            'SSID          SIGNAL  SECURITY',
            'Lab-Range     ▂▄▆█    WPA2',
            'Voisin_5G     ▂▄__    WPA2',
            'IoT-Guest     ▂___    Open',
          ],
        }
      }
      if (args[0] === 'device' && args[1] === 'wifi' && args[2] === 'connect') {
        const ssid = (args[3] || '').toLowerCase()
        if (ssid === LAB_WIFI_SSID) {
          return {
            state: { ...histState, wifiConnected: true },
            lines: ['Device wlan0 successfully activated with connection \'Lab-Range\'', 'IP attribuée : 10.13.37.55'],
          }
        }
        return { state: histState, lines: [`Error: le réseau '${args[3] || ''}' n'est pas accessible depuis ce labo.`] }
      }
      return { state: histState, lines: ['nmcli: usage : nmcli device wifi list | connect <ssid>'] }
    }

    case 'ping': {
      const target = args[0]
      if (!target) return { state: histState, lines: ['ping: cible manquante'] }
      if (!histState.wifiConnected) return { state: histState, lines: ['ping: network is unreachable (Wi-Fi non connecté)'] }
      if (target === '10.13.37.10' || target === '10.13.37.42' || target === '8.8.8.8') {
        return {
          state: histState,
          lines: [
            `PING ${target} 56(84) bytes of data.`,
            `64 bytes from ${target}: icmp_seq=1 ttl=64 time=3.21 ms`,
            `64 bytes from ${target}: icmp_seq=2 ttl=64 time=2.87 ms`,
            `--- ${target} ping statistics --- 2 transmitted, 2 received, 0% packet loss`,
          ],
        }
      }
      return { state: histState, lines: [`ping: ${target}: Name or service not known (hors labo fictif)`] }
    }

    case 'nmap': {
      const target = args[args.length - 1]
      if (!histState.wifiConnected) return { state: histState, lines: ['nmap: réseau non connecté. Utilise nmcli d\'abord.'] }
      if (target === '10.13.37.0/24') {
        return {
          state: histState,
          lines: [
            'Starting Nmap ( labo fictif isolé )',
            'Nmap scan report for 10.13.37.10 (gateway-lab)',
            '  22/tcp   open  ssh',
            '  53/tcp   open  domain',
            'Nmap scan report for 10.13.37.42 (target-lab-42)',
            '  22/tcp   open  ssh    OpenSSH 9.x (simulé)',
            '  80/tcp   open  http',
            'Nmap scan report for 10.13.37.99 (printer-lab)',
            '  9100/tcp open  jetdirect',
            'Nmap done: 3 hosts up scanned in 1.8s (labo fictif)',
          ],
        }
      }
      return { state: histState, lines: [`nmap: cible hors périmètre autorisé du labo : ${target}`] }
    }

    case 'ssh': {
      const m = /^([\w.-]+)@([\d.]+)$/.exec(args[0] || '')
      if (!m) return { state: histState, lines: ['ssh: usage : ssh <utilisateur>@<hôte>'] }
      if (!histState.wifiConnected) return { state: histState, lines: ['ssh: connect to host: Network is unreachable'] }
      const [, user, host] = m
      if (host !== '10.13.37.42') return { state: histState, lines: [`ssh: connect to host ${host} port 22: Connection refused (hors labo fictif)`] }
      return { state: { ...histState, mode: 'awaiting-password', pendingSSH: { user, host } }, lines: [] }
    }

    case 'exit':
    case 'logout': {
      if (!isRemote) return { state: histState, lines: [] }
      return { state: { ...histState, mode: 'local', pendingSSH: null }, lines: ['Connection to target-lab-42 closed.'] }
    }

    case 'passwd':
      if (isRemote) return { state: histState, lines: ['passwd: non autorisé sur cette session distante (lecture seule)'] }
      return { state: { ...histState, mode: 'awaiting-newpassword' }, lines: ['Changing password for trainee.'] }

    case 'apt': {
      if (args[0] === 'update') {
        return { state: { ...histState, updated: true }, lines: ['Réception des listes de paquets...', 'Lecture des listes de paquets... Fait', 'Tous les paquets sont à jour.'] }
      }
      if (args[0] === 'upgrade') {
        return { state: { ...histState, updated: true }, lines: ['Calcul de la mise à niveau...', '0 mis à niveau, 0 nouvellement installés.', 'Système à jour.'] }
      }
      return { state: histState, lines: ['apt: usage : apt update | apt upgrade'] }
    }

    case 'ufw':
      if (args[0] === 'enable') return { state: { ...histState, firewallEnabled: true }, lines: ['Pare-feu actif et activé au démarrage du système (simulé)'] }
      return { state: histState, lines: ['ufw: usage : ufw enable'] }

    case 'gpg': {
      if (argStr.includes('--gen-key') || argStr.includes('--full-generate-key')) {
        return {
          state: { ...histState, gpgKeyGenerated: true },
          lines: [
            'gpg: génération de la paire de clés RSA 4096 (simulé)...',
            'gpg: clé 7F3A9C1B2D4E5F60 créée',
            'gpg: trousseau mis à jour',
          ],
        }
      }
      if (argStr.includes('--list-keys')) {
        return {
          state: histState,
          lines: histState.gpgKeyGenerated
            ? ['pub   rsa4096 [SC]  7F3A 9C1B 2D4E 5F60', 'uid           trainee@cyberdeck (labo fictif)']
            : ['(aucune clé — utilise gpg --gen-key)'],
        }
      }
      return { state: histState, lines: ['gpg: usage : gpg --gen-key | --list-keys'] }
    }

    case 'history':
      return { state: histState, lines: histState.historyCmds.map((c, i) => `  ${i + 1}  ${c}`) }

    case 'man':
      return { state: histState, lines: [args[0] ? `${args[0]}(1) — page de manuel simulée, non exhaustive.` : 'man: quelle commande ?'] }

    case 'reboot':
    case 'shutdown': {
      const boot = histState.device?.osBoot || ['Redémarrage...', 'login: ']
      const fresh = createInitialState(histState.device)
      return { state: fresh, lines: ['', ...boot], reboot: true }
    }

    default:
      return { state: histState, lines: [`commande introuvable : ${cmd} — tape 'help' pour la liste des commandes.`] }
  }
}
