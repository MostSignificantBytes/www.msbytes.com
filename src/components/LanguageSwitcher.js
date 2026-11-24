import { Link } from 'gatsby'

import nav from '../data/navbar'

// Chaque lien mène à la page courante dans sa propre langue :
// français à la racine, anglais sous /en/.
const LanguageSwitcher = ({ slug }) => {

    const activeLanguage = slug.startsWith('/en/') ? 'en' : 'fr'
    const frenchPath = activeLanguage === 'en' ? slug.replace('/en/', '/') : slug
    const urls = {
        fr: frenchPath,
        en: '/en' + frenchPath,
    }

    return (
        nav.map(item => (
            <Link className={`navbar-item${activeLanguage === item.language ? ' is-active' : ''}`} key={item.language} to={urls[item.language]}>
                {item.language}
            </Link>
        ))
    )
}

export default LanguageSwitcher
