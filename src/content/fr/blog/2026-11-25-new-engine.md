---
templateKey: blog-post
language: fr
identifier: new-engine
slug: +blog+2026-11-25-new-engine
title: Un nouveau moteur pour notre site web
date: 2026-11-25T17:30:00.000Z
description: Notre site change de moteur… sans changer de visage !
featuredpost: true
featuredimage: /img/20261125_pixabay_car-engine_1.jpg
tags:
  - jamstack
  - astro
  - sveltia
  - css
  - github
  - netlify
---
![moteur](/img/20261125_pixabay_car-engine_1.jpg)

Nous sommes heureux de vous présenter la quatrième version de notre site.

À première vue, rien n'a changé : les pages, les adresses et la présentation restent les mêmes. Et c'est voulu ! Tout se passe sous le capot : le site est plus léger et plus rapide. Une page charge maintenant moins de 2 Ko de JavaScript, contre près de 700 Ko auparavant, et toute sa mise en forme tient en 14 Ko.

Le site suit toujours l'architecture [Jamstack](https://jamstack.org/), avec les technologies suivantes :

1. Générateur [Astro](https://astro.build/) à la place de Gatsby : des pages HTML statiques, sans React ni GraphQL
2. Styles écrits en CSS natif, sans framework : Bulma et Sass ne sont plus nécessaires
3. Back-office [Sveltia CMS](https://github.com/sveltia/sveltia-cms) : en français, utilisable sur tablette et sur téléphone, avec la version française et la version anglaise de chaque article côte à côte
4. Code toujours hébergé sur GitHub, compilé et déployé sur Netlify

Le site a trois fois moins de dépendances, ce qui le rend aussi plus simple à maintenir et à tenir à jour.

## La suite

Nous en avons profité pour améliorer l'accessibilité : navigation au clavier, focus visible, meilleurs contrastes. D'autres ajustements de présentation suivront, et peut-être un mode sombre (on y pense !). Nous vous en dirons plus prochainement.

Bonne visite !
