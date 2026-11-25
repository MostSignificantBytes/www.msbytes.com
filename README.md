# www.msbytes.com

Site Web institutionnel de **Most Significant Bytes (MSB SAS)** : présentation de la société, de ses activités et de son histoire, blog et formulaire de contact.

- Site statique généré par **Astro 7** (pages HTML, très peu de JavaScript), styles **Bulma 0.9.4** + Sass.
- Bilingue : français à la racine (`/`), anglais sous `/en/`.
- Contenus en Markdown dans `src/content/{fr,en}/`, médias dans `src/assets/img/` (optimisés au build).
- Hébergement **Netlify** : production sur `master`, recette sur `recette`, aperçus des pull requests.
- Back-office **Sveltia CMS** sous `/admin/` : connexion par compte GitHub, chaque modification est un brouillon (pull request) publié par l'administrateur.

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

Toujours installer avec `npm ci` (versions exactes de `package-lock.json`). La version de Sveltia CMS est figée dans `package.json` : la changer est une évolution à recetter.

### Formulaire de contact en local (facultatif)

Le widget reCAPTCHA lit la clé de site au build dans `GATSBY_SITE_RECAPTCHA_KEY` (nom conservé de l'ancien site). Pour l'afficher en local, créer un fichier `.env` (jamais versionné) :

```
GATSBY_SITE_RECAPTCHA_KEY=<clé de site reCAPTCHA v2>
```

et ajouter `localhost` aux domaines de la clé. L'envoi réel ne fonctionne que sur Netlify.

## Commandes

| Commande | Usage |
|---|---|
| `npm run dev` | Serveur de développement : http://localhost:4321 (FR), /en/ (EN) |
| `npm run build` | Génération de production dans `dist/` (puis `scripts/postbuild.mjs` : purge CSS, sitemap.xml, médias sous /img/, back-office) |
| `npm run preview` | Sert `dist/` : http://localhost:4321 |
| `npm run format` | Formatage du code avec Prettier |

Vérification locale avant chaque push : `npm run build && npm run preview`. En cas de résultat incohérent après un changement de configuration Markdown, supprimer le cache `.astro/` et `node_modules/.astro/`.

## Organisation du dépôt

| Chemin | Rôle |
|---|---|
| `astro.config.mjs` | Configuration : site statique, langues, sitemap, rendu Markdown (remark), Sass |
| `src/content.config.js` | Collection des contenus et schéma vérifié au build (templateKey, language…) |
| `src/content/{fr,en}/` | Contenus Markdown (un dossier par langue, mêmes noms de fichiers) |
| `src/pages/[...path].astro` | Génération de toutes les pages (adresse calculée par slugHandler) et des pages de tag ; `404.astro` : page d'erreur |
| `src/layouts/Layout.astro` | En-tête HTML (titre, canonical, hreflang, OpenGraph), navigation, pied de page |
| `src/templates/` | Gabarits de page (un par `templateKey`) |
| `src/components/` | Composants (navigation, pied de page, bandeau, images, liste des articles…) |
| `src/styles/all.sass` | Styles du site (Bulma 0.9.4 personnalisé) |
| `src/utils/` | Langues (`languages.mjs`), chemins (`slugHandler.js`), extrait et médias Markdown (`remark.mjs`), libellés, fonctions communes |
| `src/data/navbar.js` | Menus FR / EN et lien des mentions légales |
| `src/assets/` | Médias des contenus (`img/`), logos et icônes |
| `public/` | Fichiers publiés tels quels : back-office (`admin/`), icônes (`img/`), manifeste, robots.txt, service worker de remplacement, vérification Google |
| `scripts/postbuild.mjs` | Étapes après le build |
| `netlify.toml` | Build et en-têtes HTTP Netlify |

## Déploiement (Netlify)

- Build : `npm run build`, dossier publié `dist`, Node 24 (`netlify.toml`).
- Variables d'environnement (console Netlify) : `SITE_RECAPTCHA_KEY`, `SITE_RECAPTCHA_SECRET` (secrète, portée Runtime), `GATSBY_SITE_RECAPTCHA_KEY` (portée Builds).
- Circuit : branche de travail → pull request vers `recette` (aperçu Netlify) → recette → fusion sur `master` (production).
- Formulaire : Netlify Forms (formulaire `contact`), notifications par e-mail paramétrées dans la console Netlify.

## Back-office (Sveltia CMS)

- Adresse : https://www.msbytes.com/admin/ (recette : `https://recette--<site>.netlify.app/admin/`).
- Connexion « Se connecter avec GitHub » : le compte doit avoir un accès en écriture au dépôt. Authentification par le fournisseur OAuth GitHub de Netlify (application OAuth GitHub dont l'URL de rappel est `https://api.netlify.com/auth/done`, déclarée dans Netlify > Project configuration > Access & security > OAuth).
- Circuit de validation (`publish_mode: editorial_workflow`) : un brouillon crée une branche `cms/…` et une pull request avec son aperçu Netlify ; l'administrateur publie depuis le back-office.
- Branche visée : `master` en production ; `recette` lorsque le back-office est ouvert depuis l'adresse de recette (voir `public/admin/init.js`).
- Articles : le nom du fichier est `AAAA-MM-JJ-<identifiant>.md` ; l'adresse de l'article en est déduite (`/blog/AAAA-MM-JJ-<identifiant>/`). Utiliser le même identifiant et la même date pour les versions française et anglaise.
- Accès : tout compte GitHub ayant le droit d'écriture (rôle « Write ») sur le dépôt peut se connecter. Ajouter ou retirer un rédacteur dans GitHub > dépôt > Settings > Collaborators and teams.
- Publication : la branche `master` est protégée par une règle GitHub (Settings > Rules > Rulesets, « Protection de master ») : fusion uniquement par pull request approuvée, suppression et réécriture d'historique interdites. Les administrateurs du dépôt peuvent passer outre (publication depuis le back-office, push direct des contenus). Un rédacteur peut préparer et soumettre un brouillon (« Ready ») mais pas le publier : l'administrateur publie depuis le back-office.
- Coût : chaque publication déclenche un déploiement de production Netlify (15 crédits sur les 300 crédits mensuels de l'offre gratuite) ; les brouillons (aperçus) et la branche `recette` ne consomment pas de crédits de déploiement. Regrouper les modifications avant de publier.
- Médias : téléversés dans `src/assets/img/` et notés `/img/<fichier>` dans les contenus ; les pages utilisent des versions optimisées (WebP, tailles adaptées).
- Script : `sveltia-cms.js` et ses modules (`chunks/`) sont copiés depuis le paquet npm `@sveltia/cms` au build (`scripts/postbuild.mjs`).
- Test en local sans authentification : `npm run build && npm run preview`, ouvrir http://localhost:4321/admin/ dans Chrome ou Edge et choisir « Travailler avec un dépôt local », puis sélectionner le dossier du dépôt (les modifications sont écrites directement dans les fichiers locaux, sans circuit de validation).

## Licence

MIT – © Most Significant Bytes (MSB SAS)
