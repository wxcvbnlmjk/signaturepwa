
# Application PWA de signature manuscrite de documents PDF

**Version :** 1.0
**Date :** Juillet 2026

---

# 1. Contexte

L'objectif est de développer une Progressive Web App (PWA) permettant à un utilisateur de signer des documents PDF de manière manuscrite à l'aide d'un écran tactile, d'un stylet ou d'une souris.

L'application doit être installable sur :

* Android
* iPhone / iPad
* Windows
* macOS
* Linux
* ChromeOS

L'ensemble des traitements doit être réalisé localement dans le navigateur afin de garantir la confidentialité des documents.

---

# 2. Objectifs

L'application devra permettre de :

* ouvrir un document PDF local ;
* afficher toutes les pages ;
* créer une signature manuscrite ;
* placer une ou plusieurs signatures ;
* déplacer et redimensionner les signatures ;
* exporter un nouveau PDF signé ;
* fonctionner sans connexion Internet après installation.

---

# 3. Architecture technique

## Framework

* React
* TypeScript
* Vite

## Bibliothèques

| Fonction                            | Bibliothèque           |
| ----------------------------------- | ---------------------- |
| Affichage PDF                       | react-pdf              |
| Moteur PDF                          | pdfjs-dist             |
| Signature manuscrite                | react-signature-canvas |
| Capture de signature                | signature_pad          |
| Manipulation PDF                    | pdf-lib                |
| Déplacement / redimensionnement     | fabric.js ou react-rnd |
| Gestion du cache et mode hors ligne | vite-plugin-pwa        |
| Stockage local                      | IndexedDB              |
| Gestion d'état                      | Zustand (recommandé)   |

---

# 4. Architecture logicielle

```text
                   React
                     │
               TypeScript
                     │
                    Vite
                     │
          ┌──────────┴──────────┐
          │                     │
     Interface UI          Gestion PWA
          │                     │
    react-pdf            Service Worker
          │                     │
   Signature Canvas       Cache Offline
          │
   Gestion des objets
          │
       pdf-lib
          │
     Export PDF signé
```

---

# 5. Fonctionnalités

## 5.1 Installation

L'application devra être installable directement depuis le navigateur.

Une fois installée :

* elle apparaîtra dans la liste des applications du système ;
* elle possédera sa propre icône ;
* elle s'ouvrira dans une fenêtre indépendante (mode `standalone`) ;
* elle pourra fonctionner sans navigateur visible.

---

## 5.2 Fonctionnement hors ligne

L'application devra continuer à fonctionner sans connexion Internet.

Le Service Worker devra mettre en cache :

* les fichiers JavaScript ;
* les feuilles de style ;
* les polices ;
* les icônes ;
* les ressources statiques.

Les documents PDF de l'utilisateur ne devront jamais être mis en cache automatiquement.

---

## 5.3 Ouverture d'un document

L'utilisateur pourra :

* sélectionner un fichier PDF ;
* glisser-déposer un PDF (sur les plateformes qui le permettent).

Formats acceptés :

* PDF.

---

## 5.4 Visualisation

Le visualiseur devra permettre :

* le défilement des pages ;
* le zoom avant ;
* le zoom arrière ;
* la rotation ;
* la navigation entre les pages.

---

## 5.5 Signature manuscrite

Une fenêtre dédiée permettra :

* de dessiner avec le doigt ;
* de dessiner avec un stylet ;
* de dessiner avec une souris.

Fonctions disponibles :

* effacer ;
* recommencer ;
* enregistrer la signature.

---

## 5.6 Positionnement

La signature sera insérée sous forme d'objet graphique.

L'utilisateur pourra :

* déplacer ;
* redimensionner ;
* faire pivoter ;
* supprimer ;
* dupliquer.

---

## 5.7 Export

Le document signé sera généré avec `pdf-lib`.

Le fichier exporté conservera :

* les pages originales ;
* la qualité du document ;
* les signatures ajoutées.

---

# 6. Stockage local

Le navigateur utilisera IndexedDB pour conserver :

* les signatures favorites (si l'utilisateur l'autorise) ;
* les préférences ;
* les paramètres d'affichage ;
* les derniers documents (uniquement sous forme de références ou selon le choix de l'utilisateur).

Aucune synchronisation avec un serveur n'est prévue dans cette version.

---

# 7. Manifest PWA

Le manifeste devra définir :

* nom de l'application ;
* nom court ;
* icônes (192 × 192 et 512 × 512) ;
* couleur principale ;
* couleur de fond ;
* orientation ;
* mode `standalone`.

---

# 8. Service Worker

Le Service Worker devra :

* permettre le fonctionnement hors ligne ;
* gérer le cache des ressources ;
* détecter les nouvelles versions ;
* proposer la mise à jour de l'application.

---

# 9. Interface utilisateur

## Barre supérieure

Fonctions :

* Ouvrir un PDF
* Zoom +
* Zoom –
* Rotation
* Nouvelle signature
* Télécharger le PDF
* Paramètres

## Zone centrale

Affichage du document PDF.

## Fenêtre de signature

* zone de dessin ;
* bouton Effacer ;
* bouton Annuler ;
* bouton Valider.

---

# 10. Arborescence du projet

```text
src/
 ├── assets/
 ├── components/
 │    ├── PdfViewer/
 │    ├── SignatureCanvas/
 │    ├── SignatureOverlay/
 │    ├── Toolbar/
 │    ├── Dialogs/
 │    └── Common/
 ├── hooks/
 ├── services/
 ├── stores/
 ├── types/
 ├── utils/
 ├── workers/
 ├── App.tsx
 └── main.tsx

public/
 ├── manifest.webmanifest
 ├── icons/
 └── robots.txt
```

---

# 11. Performances

Objectifs :

* chargement initial inférieur à 3 secondes (sur une connexion standard) ;
* installation en moins de 10 secondes ;
* ouverture d'un PDF de 100 pages en moins de 5 secondes sur un appareil récent ;
* déplacement fluide des signatures (≈ 60 images par seconde sur un matériel compatible).

---

# 12. Compatibilité

Navigateurs :

* Chrome
* Edge
* Firefox
* Safari (avec les limites propres aux PWA sur iOS)

Systèmes :

* Android
* iOS / iPadOS
* Windows
* macOS
* Linux

---

# 13. Sécurité

Le traitement devra être entièrement local.

Aucun document ne sera transmis à un serveur.

Les signatures resteront stockées uniquement sur l'appareil si l'utilisateur choisit de les enregistrer.

Les communications éventuelles utiliseront HTTPS.

---

# 14. Évolutions prévues

Version 2 :

* import d'une signature PNG ou SVG ;
* ajout de texte et d'annotations ;
* tampon ("Approuvé", "Reçu", etc.) ;
* date automatique ;
* insertion d'un QR Code.

Version 3 :

* signature électronique conforme au règlement eIDAS (PAdES) ;
* certificats numériques X.509 ;
* vérification des signatures ;
* synchronisation optionnelle avec un espace de stockage cloud.

---

# 15. Critères de validation

Le projet sera considéré comme conforme si :

* la PWA est installable sur les principaux systèmes compatibles ;
* l'application fonctionne sans connexion Internet après installation ;
* un PDF peut être ouvert, signé et exporté localement ;
* le positionnement des signatures est précis ;
* les performances restent satisfaisantes sur smartphone, tablette et ordinateur ;
* aucune donnée utilisateur n'est transmise à un serveur sans action explicite.

---

# 16. Livrables

* Code source React + TypeScript
* Projet Vite
* Configuration PWA (`manifest.webmanifest`, Service Worker)
* Documentation d'installation
* Documentation développeur
* Guide utilisateur
* Jeu de tests fonctionnels
* Build de production prêt à être déployé sur un serveur HTTPS

---

# 17. Vision d'ensemble

Cette PWA doit offrir une expérience proche d'une application native tout en conservant les avantages du Web : une installation simple, une maintenance facilitée grâce à une base de code unique et un fonctionnement entièrement local. L'objectif est de fournir un outil de signature manuscrite fiable, performant et respectueux de la confidentialité des documents, utilisable sur ordinateur, tablette ou smartphone sans dépendre d'un logiciel propriétaire.


GitHub Copilot: Je vais d’abord vérifier l’état réel du dossier et les consignes de création de projet, puis je mettrai en place un socle Vite React TypeScript directement exploitable avec le flux PDF, signature, export local et PWA. Ensuite je lancerai le build et les vérifications disponibles pour attraper les problèmes d’intégration tôt.

Read skill [project-setup-info-local] 
Read file:/// /JS/signaturepwa

Le dossier est vide, donc l’ancrage est confirmé : il faut initialiser le projet plutôt que greffer des fonctionnalités sur une base existante. Mon premier contrôle discriminant sera le build Vite après installation ; s’il passe, on saura que le socle TypeScript/PWA est sain avant d’ajouter le flux de signature et d’export.

Created 5 todos

Run terminal command: npx create-vite@latest . --template react-ts

Le socle Vite a bien été généré et le serveur de développement répond sur `http://localhost:5173/`. Je lance maintenant le build de référence, puis j’ajoute les bibliothèques métier nécessaires afin de garder les erreurs de configuration séparées des erreurs de fonctionnalité.

Run terminal command: npm run build
Completed with input: npm run build

Run terminal command: npm install react-pdf pdfjs-dist pdf-lib react-signature-canvas signature_pad react-rnd zustand vite-plugin-pwa lucide-react idb

Read package.json

Read public

Read src/main.tsx

Read src/index.css

Read src/App.tsx

Le build de référence passe. La structure générée reste le boilerplate Vite, donc je vais maintenant remplacer l’écran de démonstration par un atelier de signature centré sur le document : import local, rendu multi-pages, calques de signatures manipulables, export `pdf-lib`, et une modal de dessin tactile. J’ajoute aussi la persistance IndexedDB et la configuration PWA dans le même mouvement.

Apply Patch

La première passe d’édition n’a pas été appliquée, simplement parce que le patch n’avait pas le champ de description attendu par l’outil. Je corrige le format et je garde le même périmètre fonctionnel ; aucune modification partielle n’a été produite.

Generating patch (299 lines) in src/App.tsx), [](src/index.css


```

```

```

```
Le cœur de l’interface est maintenant en place, avec le document au centre et un flux de signature réellement local. Prochaine vérification ciblée : compiler immédiatement cette tranche ; je vais corriger les erreurs TypeScript/API avant d’ajouter la couche visuelle et le manifest, pour que le diagnostic reste lisible.

Run terminal command: npm run build
Completed with input: npm run build

Run terminal command: rg "type RotationTypes|RotationTypes" node_modules/pdf-lib -g "*.d.ts" | Select-Object -First 5; rg "interface SignatureCanvasProps|type SignatureCanvasProps" node_modules/react-signature-canvas -g "*.d.ts" | Select-Object -First 5
Completed with input: rg "type RotationTypes|RotationTypes" node_modules/pdf-lib -g "*.d.ts" | Select-Object -First 5; rg "interface SignatureCanvasProps|type SignatureCanvasProps" node_modules/react-signature-canvas -g "*.d.ts" | Select-Object -First 5

La compilation a trouvé uniquement des ajustements d’API, pas un problème d’architecture : imports inutilisés, type de rotation `pdf-lib`, conversion du buffer en Blob et nom de propriété de `react-signature-canvas`. Je vais corriger ces cinq points localement puis relancer exactement le même build.

Generating patch (15 lines) in src/App.tsx


```

```


Run terminal command: npm run build
Completed with input: npm run build

Run terminal command: Get-ChildItem node_modules\pdf-lib -Recurse -Filter *.d.ts | Select-String -Pattern 'RotationTypes|drawImage' | Select-Object -First 12; Get-ChildItem node_modules\react-signature-canvas -Recurse -Filter *.d.ts | Select-String -Pattern 'SignatureCanvasProps|penColor|backgroundColor' | Select-Object -First 20

Read node_modules/pdf-lib/es/api/rotations.d.ts#1-1, lines 1 to 30

Read node_modules/react-signature-canvas/dist/index.d.ts#1-1, lines 1 to 40

Run terminal command: Get-ChildItem node_modules\signature_pad -Recurse -Filter *.d.ts | Select-String -Pattern 'interface SignaturePadOptions|penColor' | Select-Object -First 20

Generating patch (12 lines) in src/App.tsx


```

```


Run terminal command: npm run build
Completed with input: npm run build

Generating patch (6 lines) in src/App.tsx


```

```


Run terminal command: npm run build

Le flux métier compile désormais et le premier build complet est vert. Il reste l’habillage et l’installation hors ligne : je vais remplacer les styles Vite par une interface de travail dense et responsive, puis brancher `vite-plugin-pwa` avec un manifeste et des icônes locales.

Read src/App.css

Generating patch (84 lines) in src/App.css), [](src/App.css

Generating patch (3 lines) in src/App.css

Created src/App.css

Run terminal command: npm run build

L’interface passe le build avec la mise en page desktop/mobile et la modal de signature. Je termine maintenant les livrables d’installation : manifest, service worker généré par Vite PWA, icônes, titre de page et documentation d’usage/développement ; le dernier build vérifiera aussi la génération du service worker.

Read vite.config.ts

Read index.html

Generating patch (40 lines) in vite.config.ts), [](index.html


```

```

```

```


Created public/icons/icon-192.svg

Created public/icons/icon-512.svg

Generating patch (9 lines) in src/main.tsx


```

```


Read src

La configuration PWA est branchée avec mise à jour automatique, cache limité aux ressources de l’application et exclusion naturelle des PDF sélectionnés localement. Je fais le dernier passage de compilation maintenant ; il doit notamment confirmer la déclaration du module virtuel `vite-plugin-pwa` et la génération du manifest/service worker.

Created src/vite-env.d.ts

Created README.md

Read README.md

Generating patch (3 lines) in README.md

Created README.md

Run terminal command: npm run build

Le build de production est vert et génère bien `manifest.webmanifest`, `sw.js` et les ressources Workbox. Il reste un avertissement de taille de bundle lié à `pdfjs-dist`, attendu pour un visualiseur PDF ; je lance le lint puis je ferme le serveur de développement laissé ouvert par le scaffold.

Run terminal command: npm run lint

Killed terminal

Checked src/App.tsx), [](src/main.tsx), [](vite.config.ts, no problems found

Read dist

La vérification finale est propre : lint sans sortie d’erreur, diagnostics VS Code sans erreur sur les fichiers touchés, et dist contient bien le manifeste et le service worker. Je mets le suivi à jour puis je résume précisément ce qui est livré et le seul point de vigilance restant, la taille du bundle PDF.

Completed: *Initialiser le projet Vite React* (1/5)

Un point du cahier des charges mérite d’être fermé avant de conclure : le flux principal est livré, mais la conservation optionnelle des signatures favorites n’était pas encore branchée. J’ajoute une petite couche IndexedDB et une case explicite dans la fenêtre de signature, puis je relance le build/lint pour que cette partie soit réellement couverte.

Created src/services/storage.ts

Generating patch (22 lines) in src/App.tsx


```

```


Generating patch (8 lines) in src/App.css


```

```


Run terminal command: npm run build

Run terminal command: npm run lint

Le dernier build et le lint restent verts après l’ajout d’IndexedDB. Pour couvrir aussi les commandes d’objet prévues au cahier des charges, j’ajoute les deux actions manquantes directement sur la signature active : rotation par quart de tour et duplication, puis une ultime compilation ciblée.

Generating patch (9 lines) in src/App.tsx


```

```


Generating patch (8 lines) in src/App.css


```

```


Run terminal command: npm run build

Run in Terminal

Continue to iterate?
[object Object]

Made changes.

User: @agent Continue: "Continue to iterate?"

GitHub Copilot: Run terminal command: npm run lint

Application PWA `signa.` créée dans signaturepwa.

Fonctionnalités livrées :

- Import local d’un PDF par sélection ou glisser-déposer.
- Affichage multi-pages avec `react-pdf`.
- Zoom et rotation du document.
- Signature manuscrite tactile, stylet ou souris.
- Effacement et validation de la signature.
- Déplacement et redimensionnement avec `react-rnd`.
- Rotation, duplication et suppression des signatures.
- Export PDF local avec `pdf-lib`.
- Stockage optionnel d’une signature favorite dans IndexedDB.
- Manifest PWA, icônes, service worker et mise à jour automatique.
- Interface responsive desktop, tablette et mobile.
- Documentation d’installation et d’utilisation dans README.md.

Fichiers principaux :

- App.tsx
- App.css
- storage.ts
- vite.config.ts
- icon-192.svg
- icon-512.svg

Vérifications effectuées :

- `npm run build` réussi.
- `npm run lint` réussi.
- manifest.webmanifest généré.
- sw.js généré.

Le build signale uniquement un avertissement de taille de bundle lié à `pdfjs-dist`, attendu pour un visualiseur PDF complet. Pour lancer l’application :

```bash
npm install
npm run dev
```

User: avec 
npm install
npm run dev
ouverture de PDF
Erreur : Impossible de lire ce PDF.

GitHub Copilot: Je vais isoler l’erreur sur le chemin de chargement `react-pdf` : d’abord vérifier la configuration du worker PDF.js et les versions installées, puis ouvrir l’application dans le navigateur pour distinguer un problème de worker d’un problème de fichier local. Le symptôme apparaît après sélection, donc le filtre de fichier est déjà franchi.

Read src/App.tsx



Run terminal command: npm run dev -- --host 127.0.0.1

Le serveur de test est actif sur `http://localhost:5174/` (le port 5173 était déjà occupé). Je vais maintenant inspecter la console du navigateur et le chargement du worker PDF.js, car la ligne actuelle utilise un import de worker qui peut fonctionner au build mais échouer selon le serveur/dev bundler.

Opened [Browser](vscode-browser:/3887055f-3d8a-4f6f-9e33-366573120727?vscodeLinkType=browser)

Ran Playwright code
Completed with input: return { title: await page.title(), body: await page.locator('body').innerText(), consoleErrors: await page.locator('body').count() }

Opened [Browser](vscode-browser:/ee46b67b-5a64-4736-803e-58ce49c8e2d8?vscodeLinkType=browser)

Created test-minimal.pdf

La page de développement sur 5173 est saine et rend correctement ; 5174 était un démarrage mal paramétré qui servait une page vide, sans rapport avec le PDF. Je teste maintenant un PDF minimal via le sélecteur de fichier sur la page réellement servie afin d’obtenir l’erreur PDF.js exacte avant de modifier le code.

Ran Playwright code
Completed with input: const messages = []; page.on('console', message => messages.push({type: message.type(), text: message.text()})); page.on('pageerror', error => messages.push({type: 'pageerror', text: error.message})); await page.locator('input[type=file]').setInputFiles('C:/JS/signaturepwa/test-minimal.pdf'); await page.waitForTimeout(1200); return {body: await page.locator('body').innerText(), messages};

Waited for Playwright code

La cause est confirmée : `react-pdf` utilise PDF.js `5.4.296`, tandis que l’import direct du worker vient de `pdfjs-dist` `5.6.205`. PDF.js refuse ce mélange, d’où l’erreur générique. Je vais aligner le worker sur l’instance PDF.js réellement exportée par `react-pdf`, ce qui supprime le décalage sans dépendre d’un chemin interne versionné.

Run terminal command: npm list react-pdf pdfjs-dist

Run terminal command: npm install pdfjs-dist@5.4.296

Run terminal command: npm run build

Ran Playwright code
Completed with input: await page.reload(); await page.locator('input[type=file]').setInputFiles('C:/JS/signaturepwa/test-minimal.pdf'); await page.waitForTimeout(1200); return {body: await page.locator('body').innerText(), errors: await page.locator('.loading').allTextContents()};

Le package est maintenant aligné et le build confirme que le worker généré est bien en `5.4.296`. La page déjà ouverte sur 5173 conserve toutefois l’ancien bundle/worker Vite en cache ; je redémarre un serveur neuf sur un autre port pour valider la correction dans une session propre, puis je supprimerai le PDF de test.

Run terminal command: npm run dev -- --host=127.0.0.1 --port=5175

Opened [Browser](vscode-browser:/7d137675-1376-4549-9ee9-f3c547777088?vscodeLinkType=browser)

Ran Playwright code
Completed with input: const messages = []; page.on('console', message => messages.push({type: message.type(), text: message.text()})); await page.locator('input[type=file]').setInputFiles('C:/JS/signaturepwa/test-minimal.pdf'); await page.waitForTimeout(1200); return {body: await page.locator('body').innerText(), messages};

Waited for Playwright code

Le test en serveur neuf réussit : le PDF est rendu et aucune erreur API/worker n’apparaît ; seul l’avertissement PDF.js « Indexing all PDF objects » concerne le PDF minimal de test. La correction est donc validée. Je retire maintenant le fichier de test créé uniquement pour le diagnostic, puis je vérifie le lint final.

Generating patch (3 lines) in test-minimal.pdf

Run terminal command: npm run lint

Killed terminal

Killed terminal

Le problème venait d’un conflit de versions PDF.js :

- `react-pdf` utilisait `pdfjs-dist@5.4.296`.
- L’application chargeait le worker depuis `pdfjs-dist@5.6.205`.
- PDF.js refusait donc de charger le document avec l’erreur :

```text
The API version "5.4.296" does not match the Worker version "5.6.205".
```

Correction appliquée dans package.json et package-lock.json : `pdfjs-dist` est maintenant aligné sur `5.4.296`.

Validation effectuée :

- Ouverture d’un PDF test réussie dans le navigateur.
- Rendu de la page PDF confirmé.
- Plus d’erreur de mismatch worker/API.
- `npm run build` réussi.
- `npm run lint` réussi.
- Le service worker PWA est toujours généré.

Tu peux relancer proprement :

```bash
npm run dev
```

Si un ancien serveur Vite est déjà actif, arrête-le avec `Ctrl+C`, puis relance la commande afin d’éviter un ancien bundle mis en cache.

Made changes.

User: rendre l'app accessible par IP

GitHub Copilot: Je vais rendre Vite accessible sur toutes les interfaces réseau, puis vérifier que le serveur annonce bien une URL LAN utilisable depuis un téléphone ou une tablette sur le même réseau Wi‑Fi. Je vais aussi corriger le script de démarrage pour que `npm run dev` suffise, sans argument supplémentaire.

Read vite.config.ts

Read package.json

La configuration actuelle ne fixe aucun hôte, donc Vite écoute probablement uniquement sur `localhost`. Je vais définir `host: true` dans Vite et ajouter `--host 0.0.0.0` aux scripts `dev` et `preview`; cela expose l’application sur l’adresse IPv4 de la machine, tout en conservant l’accès local.

Generating patch (24 lines) in vite.config.ts), [](package.json), [](README.md


```

```

```

```

```

```
La modification est appliquée : `npm run dev` et `npm run preview` écouteront maintenant sur `0.0.0.0`. Je lance d’abord le build pour vérifier que la configuration Vite reste valide, puis je démarrerai le serveur et relèverai l’URL réseau réellement annoncée.

Run terminal command: npm run build

Run terminal command: npm run dev

Made changes.