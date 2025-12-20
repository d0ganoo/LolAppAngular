# 🎮 Champions Analytics - Angular LOL

Application interactive pour analyser les champions League of Legends. Comparez les statistiques en fonction du niveau du champion et des items équipés. Données officielles via l'API Data Dragon de Riot Games.

---

## ✨ Description

Un outil complet et interactif permettant :

### 🔥 Analyse complète des champions
- Statistiques détaillées (HP, Armor, Dégâts d'attaque, etc.)
- Calcul dynamique des stats en fonction du niveau (1-18)
- Visualisation des progressions par niveau

### 🛍️ Système d'items complet
- Catalogue complet des items League of Legends
- Filtrage par catégorie (basique, épique, légendaire, etc.)
- Application en temps réel des bonus d'items
- Calcul des stats finales avec items

---

## 🛠️ Technologies utilisées

- **Framework** : Angular 21 (Standalone Components)
- **State Management** : Signals & Computed Signals
- **Reactive Programming** : RxJS avec interop Signals/Observables
- **APIs** : Riot Games Data Dragon
- **Styling** : CSS custom
- **Package Manager** : npm

---

## 🚀 Installation

### 🧰 Prérequis

- Node.js ≥ 18
- npm ≥ 9

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/<ton-user>/<ton-repo>.git
cd mon-app-anuglar-lol
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

---

## ▶️ Lancer le projet en local

```bash
npm start
```

Une fois le serveur de développement lancé, ouvrez votre navigateur et accédez à :

```
http://localhost:4200/
```

L'application se rechargera automatiquement à chaque modification de fichier source.

---

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── features/
│   │   ├── home/                    # Page d'accueil
│   │   └── champions-versus/        # Comparateur de champions
│   ├── services/
│   │   ├── ddragon.service.ts       # API Data Dragon
│   │   └── champion-stats.service.ts # Calculs de stats
│   ├── app.ts                       # Composant racine
│   └── app.routes.ts                # Configuration des routes
└── main.ts                          # Point d'entrée
```

---

## 📝 Scripts disponibles

```bash
npm start              # Lancer le serveur de développement
npm run build          # Compiler le projet pour la production
npm run watch          # Build en mode watch
npm test               # Lancer les tests unitaires
npm run serve:ssr:mon-app-anuglar-lol      # Lancer avec SSR
```

---

**Bon jeu ! 🎮**
