# signa.

PWA React + TypeScript pour signer des documents PDF manuscritement, directement dans le navigateur. Les PDF ne sont jamais envoyés à un serveur.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez ensuite l’URL affichée par Vite. Pour accéder à l’application depuis un téléphone ou une tablette connectés au même réseau, utilisez l’adresse `http://ADRESSE_IP_DU_PC:5173` affichée sous `Network`.

Sous Windows, l’adresse IPv4 peut être trouvée avec `ipconfig`. Si Windows Defender Firewall affiche une demande, autorisez Node.js sur le réseau privé.

## Production

```bash
npm run build
npm run preview
```

Le dossier `dist/` est prêt à être déployé sur un hébergement HTTPS. Le build génère le manifeste PWA et le service worker avec `vite-plugin-pwa`.

## Utilisation

1. Choisissez un PDF ou glissez-déposez-le dans la zone centrale.
2. Utilisez la barre d’outils pour zoomer ou faire pivoter l’affichage.
3. Cliquez sur **Nouvelle signature**, dessinez avec une souris, un doigt ou un stylet, puis validez.
4. Déplacez ou redimensionnez la signature sur la page active.
5. Téléchargez le PDF signé avec le bouton de téléchargement.

Le document source est lu avec `react-pdf`; les signatures sont intégrées au fichier exporté avec `pdf-lib`. Le service worker ne met en cache que les ressources statiques et les bundles, jamais les documents utilisateur.

## Structure

- `src/App.tsx` : flux principal de visualisation, signature et export.
- `src/App.css` : interface responsive de l’atelier.
- `vite.config.ts` : manifest, icônes et stratégie offline.
- `public/icons/` : icônes d’installation PWA.
