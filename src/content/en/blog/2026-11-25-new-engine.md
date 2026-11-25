---
templateKey: blog-post
language: en
identifier: new-engine
slug: +blog+2026-11-25-new-engine
title: A new engine for our website
date: 2026-11-25T17:30:00.000Z
description: Our website has a new engine… and the same face!
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
![engine](/img/20261125_pixabay_car-engine_1.jpg)

We are pleased to present the fourth version of our site.

At first glance, nothing has changed: the pages, addresses and design are the same. That's on purpose! Everything happened under the hood: the site is lighter and faster. A page now loads less than 2 KB of JavaScript, down from almost 700 KB, and all of its styling fits in 14 KB.

The site is still built on the [Jamstack](https://jamstack.org/) architecture, with the following technologies:

1. [Astro](https://astro.build/) site generator instead of Gatsby: static HTML pages, with no React or GraphQL
2. Styles written in native CSS, with no framework: Bulma and Sass are no longer needed
3. [Sveltia CMS](https://github.com/sveltia/sveltia-cms) back-office: in French, usable on tablets and phones, with the French and English versions of each article side by side
4. Code still hosted on GitHub, built and deployed on Netlify

The site has three times fewer dependencies, which also makes it easier to maintain and keep up to date.

## What's next

We took the opportunity to improve accessibility: keyboard navigation, visible focus and better contrast. More design tweaks will follow, and maybe a dark mode (we're thinking about it!). We will tell you more about it soon.

Enjoy your visit!
