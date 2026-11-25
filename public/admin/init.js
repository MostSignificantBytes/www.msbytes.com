// Initialisation manuelle de Decap CMS : la configuration est lue dans /admin/config.yml ;
// seule la branche de travail est adaptée. Sur l'adresse de recette (recette--<site>.netlify.app),
// les brouillons visent la branche « recette » afin de recetter sans toucher à la production (C12).
var host = window.location.hostname
var branch = host.indexOf('recette--') === 0 ? 'recette' : 'master'
window.CMS.init({ config: { backend: { branch: branch } } })
