// Scénarios pédagogiques guidés. Chaque étape est validée soit sur la
// commande brute tapée, soit sur un drapeau d'état renvoyé par le moteur de
// terminal (utils/terminalEngine.js). Tout se déroule dans le labo fictif
// isolé 10.13.37.0/24 fourni avec le simulateur — jamais sur un réseau réel.

function typed(pattern) {
  return (raw) => pattern.test(raw.trim())
}

export const MISSIONS = [
  {
    id: 'first-boot',
    title: 'Premier démarrage',
    icon: '🟢',
    difficulty: 'Débutant',
    briefing:
      "Ton cyberdeck vient de démarrer pour la première fois. Avant toute chose, on identifie la machine : qui es-tu, quel noyau tourne, quel matériel as-tu assemblé ?",
    steps: [
      { id: 'whoami', prompt: "Vérifie ton identité sur le système.", hint: 'whoami', match: typed(/^whoami$/) },
      { id: 'uname', prompt: "Affiche les informations du noyau.", hint: 'uname -a', match: typed(/^uname\s+-a$/) },
      { id: 'neofetch', prompt: "Affiche le résumé matériel de ton cyberdeck.", hint: 'neofetch', match: typed(/^neofetch$/) },
    ],
    reward: "Bien joué. Tu sais maintenant lire l'identité et la configuration de base d'un poste Linux.",
  },
  {
    id: 'network-setup',
    title: 'Configuration réseau',
    icon: '📡',
    difficulty: 'Débutant',
    briefing:
      "Un cyberdeck isolé ne sert à rien. On rejoint le réseau du labo d'entraînement (SSID « Lab-Range »), on vérifie l'adresse obtenue, puis on teste la connectivité vers la passerelle.",
    steps: [
      { id: 'wifi-list', prompt: 'Liste les réseaux Wi-Fi visibles.', hint: 'nmcli device wifi list', match: typed(/^nmcli\s+device\s+wifi\s+list$/) },
      { id: 'wifi-connect', prompt: "Connecte-toi au réseau du labo « Lab-Range ».", hint: 'nmcli device wifi connect Lab-Range', match: (raw, s) => /^nmcli\s+device\s+wifi\s+connect\s+lab-range/i.test(raw.trim()) && s.wifiConnected },
      { id: 'ifconfig', prompt: 'Vérifie ton adresse IP attribuée.', hint: 'ifconfig', match: typed(/^(ifconfig|ip\s+a(ddr)?)$/) },
      { id: 'ping-gw', prompt: 'Teste la connectivité vers la passerelle du labo (10.13.37.10).', hint: 'ping 10.13.37.10', match: typed(/^ping\s+10\.13\.37\.10$/) },
    ],
    reward: 'Ton cyberdeck est en ligne sur le réseau de labo. Prêt pour la reconnaissance.',
  },
  {
    id: 'recon-lab',
    title: 'Reconnaissance autorisée',
    icon: '🔎',
    difficulty: 'Intermédiaire',
    requires: ['network-setup'],
    briefing:
      "Rappel important : toute action ci-dessous ne s'exécute que dans le labo fictif isolé 10.13.37.0/24, fourni pour l'entraînement, avec autorisation explicite. On scanne le sous-réseau, on se connecte à la cible d'entraînement 10.13.37.42 avec l'utilisateur « trainee » (mot de passe fourni dans l'énoncé de ta session), puis on relève le rapport de mission.",
    steps: [
      { id: 'scan', prompt: 'Scanne le sous-réseau du labo.', hint: 'nmap 10.13.37.0/24', match: typed(/^nmap\s+10\.13\.37\.0\/24$/) },
      { id: 'ssh', prompt: 'Connecte-toi en SSH à la cible 10.13.37.42.', hint: 'ssh trainee@10.13.37.42', match: (raw, s) => /^ssh\s+trainee@10\.13\.37\.42$/.test(raw.trim()) },
      { id: 'auth', prompt: 'Saisis le mot de passe fourni pour la cible du labo.', hint: 'Tr41n3r!2024', match: (raw, s) => s.mode === 'remote' },
      { id: 'flag', prompt: 'Relève le rapport de mission sur la cible.', hint: 'cat flag.txt', match: (raw, s) => /^cat\s+flag\.txt$/.test(raw.trim()) && s.mode === 'remote' },
      { id: 'exit', prompt: 'Referme proprement la session distante.', hint: 'exit', match: (raw, s) => /^(exit|logout)$/.test(raw.trim()) && s.mode === 'local' },
    ],
    reward: "Reconnaissance terminée. Tu as scanné, authentifié et récupéré une preuve d'accès — en environnement autorisé.",
  },
  {
    id: 'hardening',
    title: 'Durcissement du poste',
    icon: '🛡️',
    difficulty: 'Intermédiaire',
    briefing:
      "Un bon opérateur protège aussi son propre matériel. On change le mot de passe par défaut, on met à jour les paquets, et on active le pare-feu local.",
    steps: [
      { id: 'passwd', prompt: 'Change le mot de passe local.', hint: 'passwd (puis saisis un nouveau mot de passe)', match: (raw, s) => s.passwordChanged },
      { id: 'update', prompt: 'Mets à jour la liste des paquets.', hint: 'apt update', match: (raw, s) => /^apt\s+update$/.test(raw.trim()) },
      { id: 'ufw', prompt: 'Active le pare-feu local.', hint: 'ufw enable', match: (raw, s) => /^ufw\s+enable$/.test(raw.trim()) && s.firewallEnabled },
    ],
    reward: 'Ton cyberdeck est durci : mot de passe changé, système à jour, pare-feu actif.',
  },
  {
    id: 'crypto',
    title: 'Chiffrement des communications',
    icon: '🔐',
    difficulty: 'Avancé',
    briefing:
      "Avant d'échanger des notes sensibles depuis le terrain, on génère une paire de clés GPG et on vérifie qu'elle est bien enregistrée.",
    steps: [
      { id: 'genkey', prompt: 'Génère une paire de clés GPG.', hint: 'gpg --gen-key', match: (raw, s) => s.gpgKeyGenerated },
      { id: 'listkeys', prompt: 'Vérifie que la clé est bien présente.', hint: 'gpg --list-keys', match: (raw, s) => /^gpg\s+--list-keys$/.test(raw.trim()) && s.gpgKeyGenerated },
    ],
    reward: 'Tes communications peuvent désormais être chiffrées de bout en bout.',
  },
  {
    id: 'debrief',
    title: 'Débriefing final',
    icon: '📋',
    difficulty: 'Débutant',
    briefing:
      "Fin de session. On relit l'historique des actions menées, puis on éteint proprement le cyberdeck.",
    steps: [
      { id: 'history', prompt: 'Affiche l\'historique des commandes de la session.', hint: 'history', match: typed(/^history$/) },
      { id: 'reboot', prompt: 'Redémarre le cyberdeck pour clore la session.', hint: 'reboot', match: typed(/^(reboot|shutdown)$/) },
    ],
    reward: "Session clôturée proprement. Tu maîtrises maintenant le cycle complet d'usage d'un cyberdeck.",
  },
]

export function missionProgressKey(missionId) {
  return `mission:${missionId}`
}
