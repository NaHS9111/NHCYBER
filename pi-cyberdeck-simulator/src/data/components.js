// Catalogue de matériel simulé — aucune donnée ici ne correspond à un produit
// réel à commander : c'est un jeu de pièces fictif pour l'assemblage pédagogique.

export const DEVICE_TYPES = [
  {
    id: 'raspi-deck',
    name: 'Raspberry Pi Cyberdeck',
    tagline: 'Le classique : un Pi nu, une carte SD, et tout ce qu\'il faut autour.',
    icon: '🍓',
    color: '#00ff9d',
    blurb:
      "Un cyberdeck générique construit autour d'un Raspberry Pi. Modulable : petit boîtier de poche ou station complète avec écran et clavier externes.",
  },
  {
    id: 'berry-deck',
    name: 'BlackBerry Pi Cyberdeck',
    tagline: 'Le mod culte : un Pi Zero greffé dans un clavier BlackBerry.',
    icon: '📟',
    color: '#8f5cff',
    blurb:
      "Le projet DIY bien connu de la communauté maker : un Raspberry Pi Zero (W/2W) recâblé sur la matrice du clavier physique d'un BlackBerry, avec un petit écran, pour un mini-terminal portable à clavier réel.",
  },
]

export const CATEGORIES = ['board', 'keyboard', 'display', 'power', 'storage', 'case']

export const COMPONENTS = {
  board: [
    { id: 'pi5', name: 'Raspberry Pi 5 (8GB)', icon: '🧠', devices: ['raspi-deck'], specs: 'Quad-core 2.4GHz · 8GB RAM · idéal station complète', power: 5 },
    { id: 'pi4', name: 'Raspberry Pi 4B (4GB)', icon: '🧠', devices: ['raspi-deck'], specs: 'Quad-core 1.5GHz · 4GB RAM · bon compromis', power: 4 },
    { id: 'pizero2w', name: 'Raspberry Pi Zero 2 W', icon: '🔬', devices: ['raspi-deck', 'berry-deck'], specs: 'Quad-core 1GHz · 512MB RAM · ultra compact, faible conso', power: 2 },
    { id: 'pizerow', name: 'Raspberry Pi Zero W', icon: '🔬', devices: ['berry-deck'], specs: 'Single-core 1GHz · 512MB RAM · le choix historique du mod', power: 1 },
  ],
  keyboard: [
    { id: 'bb-bold', name: 'Clavier BlackBerry Bold (QWERTY)', icon: '⌨️', devices: ['berry-deck'], specs: 'Matrice recâblée en I2C via carte contrôleur GPIO', flex: true },
    { id: 'bb-classic', name: 'Clavier BlackBerry Classic', icon: '⌨️', devices: ['berry-deck'], specs: 'Trackpad + touches dédiées, matrice plus dense', flex: true },
    { id: 'usb-mini', name: 'Mini-clavier USB pliable', icon: '⌨️', devices: ['raspi-deck'], specs: 'Externe, branché en USB, aucun câblage requis' },
    { id: 'usb-full', name: 'Clavier mécanique 60%', icon: '⌨️', devices: ['raspi-deck'], specs: 'Externe USB, confort de frappe pour station fixe' },
  ],
  display: [
    { id: 'oled096', name: 'Écran OLED 0.96" I2C', icon: '🖥️', devices: ['berry-deck'], specs: '128×64 mono, très faible conso, parfait pour un shell' },
    { id: 'lcd28', name: 'Écran LCD tactile 2.8"', icon: '🖥️', devices: ['berry-deck', 'raspi-deck'], specs: '320×240, tactile résistif, driver SPI' },
    { id: 'hdmi7', name: 'Écran HDMI 7" tactile', icon: '🖥️', devices: ['raspi-deck'], specs: '1024×600, capacitif, alimentation dédiée requise' },
    { id: 'headless', name: 'Aucun (mode headless)', icon: '🌐', devices: ['raspi-deck', 'berry-deck'], specs: 'Accès uniquement via SSH depuis un autre poste' },
  ],
  power: [
    { id: 'li18650', name: 'Batterie Li-Ion 18650 + PMIC', icon: '🔋', devices: ['berry-deck'], specs: '~3000mAh, module de charge/protection intégré' },
    { id: 'lipo1200', name: 'Batterie LiPo 1200mAh', icon: '🔋', devices: ['berry-deck', 'raspi-deck'], specs: 'Compacte, autonomie ~3h en usage terminal' },
    { id: 'powerbank', name: 'Powerbank USB-C 10000mAh', icon: '🔌', devices: ['raspi-deck'], specs: 'Externe, autonomie confortable, recharge rapide' },
    { id: 'secteur', name: 'Alimentation secteur', icon: '🔌', devices: ['raspi-deck'], specs: 'Usage sédentaire uniquement, pas d\'autonomie' },
  ],
  storage: [
    { id: 'sd32', name: 'MicroSD 32GB A1', icon: '💾', devices: ['raspi-deck', 'berry-deck'], specs: 'Suffisant pour un OS léger + outils de base' },
    { id: 'sd128', name: 'MicroSD 128GB A2', icon: '💾', devices: ['raspi-deck', 'berry-deck'], specs: 'Confortable pour wordlists, captures, VM légères' },
    { id: 'ssdusb', name: 'SSD USB 3.0 256GB', icon: '💽', devices: ['raspi-deck'], specs: 'Boot sur SSD, bien plus endurant qu\'une carte SD' },
  ],
  case: [
    { id: 'bb-shell', name: 'Coque BlackBerry recyclée', icon: '📦', devices: ['berry-deck'], specs: 'Le boîtier d\'origine, redécoupé pour loger le Pi et la batterie' },
    { id: 'print3d', name: 'Boîtier imprimé en 3D sur-mesure', icon: '🧊', devices: ['berry-deck', 'raspi-deck'], specs: 'Design imprimé, ventilation et découpes pour ports' },
    { id: 'alu', name: 'Boîtier aluminium passif', icon: '🗜️', devices: ['raspi-deck'], specs: 'Dissipation passive, look station de bureau' },
    { id: 'none-case', name: 'Sans boîtier (à nu)', icon: '🪛', devices: ['raspi-deck', 'berry-deck'], specs: 'Pour le prototypage rapide, fragile' },
  ],
}

export const OS_IMAGES = [
  {
    id: 'raspios-lite',
    name: 'Raspberry Pi OS Lite',
    icon: '🐧',
    size: '0.5 GB',
    desc: 'Base Debian minimale, sans interface graphique. Rapide à flasher, parfait pour un cyberdeck terminal.',
    boot: [
      '[    0.000000] Booting Linux on physical CPU 0x0',
      '[    0.912004] Kernel command line: root=/dev/mmcblk0p2 rootfstype=ext4',
      '[    2.104412] Starting kernel ...',
      '[    4.331098] systemd[1]: System initialized.',
      '[    5.002214] Reached target Multi-User System.',
      'raspberrypi login: ',
    ],
  },
  {
    id: 'dietpi',
    name: 'DietPi',
    icon: '🥗',
    size: '0.4 GB',
    desc: 'Distribution ultra-optimisée, pensée pour le matériel modeste comme un Pi Zero. Idéale pour préserver la batterie.',
    boot: [
      '[  OK  ] Started DietPi-PostBoot',
      '[  OK  ] Reached target DietPi Ready',
      '[  OK  ] Optimisations mémoire appliquées',
      'DietPi v9 — login: ',
    ],
  },
  {
    id: 'labos',
    name: 'LabOS Pentest Edition (fictif)',
    icon: '🧪',
    size: '3.1 GB',
    desc: 'Distribution pédagogique fictive préchargée avec les outils du module Missions : environnement de laboratoire isolé uniquement.',
    boot: [
      '[  OK  ] Environnement de laboratoire isolé initialisé',
      '[  OK  ] Cible fictive du labo chargée (10.13.37.0/24)',
      '[ WARN ] Rappel : ce système ne doit être utilisé que sur le labo fictif fourni',
      'labos login: ',
    ],
  },
  {
    id: 'ubuntu-server',
    name: 'Ubuntu Server ARM64',
    icon: '🟠',
    size: '1.2 GB',
    desc: 'Pour ceux qui veulent un écosystème de paquets plus large. Plus lourd, demande une carte SD rapide.',
    boot: [
      'Ubuntu 24.04 LTS ttyAMA0',
      '[  OK  ] Reached target Cloud-init target.',
      '[  OK  ] Started Netplan configuration',
      'ubuntu login: ',
    ],
  },
]
