# www.msbytes.com

Site Web institutionnel de **Most Significant Bytes (MSB SAS)** : présentation de la société, de ses activités et de son histoire, blog et formulaire de contact.

- Site statique généré par **Gatsby 5.16** (React 19), styles **Bulma 0.9.4** + Sass.
- Bilingue : français à la racine (`/`), anglais sous `/en/`.
- Contenus en Markdown dans `src/pages/{fr,en}/`, médias dans `static/img/`.
- Hébergement **Netlify** : production sur `master`, recette sur `recette`, aperçus des pull requests.
- Back-office **Decap CMS 3** sous `/admin/` (pas encore activé).

La documentation complète (spécifications, installation, exploitation, mise en production, recette) est tenue dans le projet « Site web MSB » (dossier `documentation/`, références MSB-WEB-xxx).

## Prérequis

| Outil | Version |
|---|---|
| Node.js | 24.x LTS (`nvm install 24 && nvm use 24`) |
| npm | fourni avec Node 24 |
| Git | 2.x |

## Installation

```bash
git clone https://github.com/MostSignificantBytes/www.msbytes.com.git
cd www.msbytes.com
npm ci
```

Toujours installer avec `npm ci` (versions exactes de `package-lock.json`). Les avertissements `ERESOLVE overriding peer dependency` (routeur interne de Gatsby et dépendances de Decap CMS déclarés pour React 18) sont attendus : Gatsby 5.16 prend officiellement en charge React 19.

### Formulaire de contact en local (facultatif)

Le widget reCAPTCHA lit la clé de site dans `GATSBY_SITE_RECAPTCHA_KEY`. Pour l'afficher en local, créer un fichier `.env.development` (jamais versionné) :

```
GATSBY_SITE_RECAPTCHA_KEY=<clé de site reCAPTCHA v2>
```

et ajouter `localhost` aux domaines de la clé. L'envoi réel ne fonctionne que sur Netlify.

## Commandes

| Commande | Usage |
|---|---|
| `npm run develop` | Serveur de développement : http://localhost:8000 (FR), /en/ (EN), /___graphql |
| `npm run build` | Génération de production dans `public/` |
| `npm run serve` | Sert `public/` : http://localhost:9000 |
| `npm run clean` | Supprime `.cache/` et `public/` |
| `npm run format` | Formatage du code avec Prettier |

Vérification locale avant chaque push : `npm run build && npm run serve`.

## Organisation du dépôt

| Chemin | Rôle |
|---|---|
| `gatsby-config.js` | Métadonnées, plugins, en-têtes HTTP (appliqués par l'adaptateur Netlify) |
| `gatsby-node.js` | Création des pages et des pages de tag |
| `gatsby-ssr.js`, `gatsby-browser.js` | Langue de `<html>` (pré-rendu et navigation) |
| `src/pages/{fr,en}/` | Contenus Markdown ; `src/pages/404.js` : page d'erreur |
| `src/templates/` | Gabarits de page (requêtes GraphQL et export `Head`) |
| `src/components/` | Composants React et `all.sass` |
| `src/utils/slugHandler.js` | Calcul du chemin d'une page à partir du frontmatter |
| `src/data/navbar.js` | Menus FR / EN et lien des mentions légales |
| `src/cms/`, `static/admin/config.yml` | Back-office Decap CMS |
| `static/` | Fichiers publiés tels quels (images, vérification Google) |
| `netlify.toml` | Build et plugins Netlify |

## Déploiement (Netlify)

- Build : `npm run build`, dossier publié `public`, Node 24 (`netlify.toml`).
- Sur Netlify, Gatsby installe automatiquement l'adaptateur `gatsby-adapter-netlify`.
- Variables d'environnement (console Netlify) : `SITE_RECAPTCHA_KEY`, `SITE_RECAPTCHA_SECRET` (secrète, portée Runtime), `GATSBY_SITE_RECAPTCHA_KEY` (portée Builds).
- Circuit : branche de travail → pull request vers `recette` (aperçu Netlify) → recette → fusion sur `master` (production).
- Formulaire : Netlify Forms (formulaire `contact`), notifications par e-mail paramétrées dans la console Netlify.

## Licence

MIT – © Most Significant Bytes (MSB SAS)
