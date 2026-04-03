# 🎬 TikTok Cash Machine

Génère des scripts TikTok viraux, hooks percutants et hashtags optimisés en quelques secondes grâce à l'IA Claude.

## 🚀 Stack technique

- **Framework** : Next.js 14 (Pages Router)
- **Styles** : Tailwind CSS + CSS custom
- **IA** : Anthropic Claude Sonnet via API
- **Déploiement** : Vercel

## 📁 Structure du projet

```
tiktok-cash-machine/
├── pages/
│   ├── index.js          # Page principale (UI)
│   ├── _app.js           # App wrapper
│   └── api/
│       └── generate.js   # API Route → appel Anthropic
├── styles/
│   └── globals.css       # Styles globaux + animations
├── .env.example          # Template variables d'env
├── tailwind.config.js
├── next.config.js
└── package.json
```

## ⚙️ Installation locale

```bash
# 1. Installe les dépendances
npm install

# 2. Configure ta clé API
cp .env.example .env.local
# Édite .env.local et ajoute ta clé Anthropic

# 3. Lance le serveur de dev
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## 🌐 Déploiement sur Vercel

### Option 1 — CLI Vercel

```bash
npx vercel
```

Puis dans le dashboard Vercel :
1. **Settings** → **Environment Variables**
2. Ajoute `ANTHROPIC_API_KEY` = `sk-ant-...`
3. Redéploie

### Option 2 — GitHub + Vercel

1. Push le projet sur GitHub
2. Connecte le repo sur [vercel.com](https://vercel.com)
3. Ajoute la variable `ANTHROPIC_API_KEY` dans les settings
4. Déploiement automatique ✅

## 🔑 Variables d'environnement

| Variable | Description | Obligatoire |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (console.anthropic.com) | ✅ Oui |

## 💡 Comment ça marche

1. L'utilisateur entre un sujet dans le champ texte
2. Le frontend appelle `POST /api/generate` avec le sujet
3. L'API Route appelle l'API Anthropic avec un prompt optimisé
4. Le modèle retourne un JSON structuré : hook, script, description, hashtags, tips
5. L'interface affiche les résultats avec options de copie

## 🛡️ Sécurité

- La clé API n'est **jamais** exposée au frontend (server-side uniquement)
- Validation du payload côté API
- Gestion des erreurs complète

---

Construit avec ❤️ — Propulsé par Claude AI
