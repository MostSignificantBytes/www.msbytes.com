// Tests du site public dans un navigateur : accessibilité (axe-core), navigation, langues, formulaire.
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Pages représentatives de chaque gabarit, en français et en anglais
const PAGES = [
    '/', '/en/', '/activities/', '/en/activities/', '/about/', '/story/', '/blog/', '/en/blog/',
    '/blog/2022-06-15-osi-model/', '/contact/', '/en/contact/', '/contact/thanks/', '/tags/', '/tags/wi-fi/',
    '/legal/', '/en/legal/', '/page-inexistante/',
]
const WIDTHS = { mobile: 375, ordinateur: 1280 }

// Règles WCAG 2.1 niveaux A et AA, et bonnes pratiques d'axe-core
const RULES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

for (const [device, width] of Object.entries(WIDTHS)) {
    test.describe(`Accessibilité (${device})`, () => {
        test.use({ viewport: { width, height: 900 } })
        for (const url of PAGES) {
            test(url, async ({ page }) => {
                await page.goto(url)
                const { violations } = await new AxeBuilder({ page }).withTags(RULES).analyze()
                const summary = violations.map((v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)
                expect(summary, 'alertes axe-core').toEqual([])
            })
        }
    })
}

test.describe('Navigation', () => {
    test('page inconnue : page 404 avec le menu', async ({ page }) => {
        const response = await page.goto('/page-inexistante/')
        expect(response.status()).toBe(404)
        await expect(page.locator('header nav')).toBeVisible()
        await expect(page.locator('main')).toBeVisible()
    })

    test('menu mobile : ouverture et fermeture au clic et au clavier', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 })
        await page.goto('/')
        const burger = page.locator('#burger-menu')
        const menu = page.locator('#navMenu')
        await expect(burger).toHaveAttribute('aria-expanded', 'false')
        await expect(menu).toBeHidden()
        await burger.click()
        await expect(burger).toHaveAttribute('aria-expanded', 'true')
        await expect(menu).toBeVisible()
        await burger.click()
        await expect(menu).toBeHidden()
        await burger.focus()
        await page.keyboard.press('Enter')
        await expect(menu).toBeVisible()
    })

    test('menu ordinateur : entrée de la page courante signalée', async ({ page }) => {
        await page.goto('/activities/')
        await expect(page.locator('#navMenu a[aria-current="page"]').first()).toHaveAttribute('href', '/activities/')
    })

    test('sélecteur de langue : même page dans l\'autre langue', async ({ page }) => {
        await page.goto('/activities/')
        await page.locator('#navMenu a', { hasText: /^en$/ }).click()
        await expect(page).toHaveURL(/\/en\/activities\/$/)
        await expect(page.locator('html')).toHaveAttribute('lang', 'en')
        await page.locator('#navMenu a', { hasText: /^fr$/ }).click()
        await expect(page).toHaveURL(/\/activities\/$/)
        await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    })

    test('sélecteur de langue : mot-clé non traduit → liste des mots-clés', async ({ page }) => {
        await page.goto('/tags/reseau/')
        await page.locator('#navMenu a', { hasText: /^en$/ }).click()
        await expect(page).toHaveURL(/\/en\/tags\/$/)
    })

    test('blog : articles du plus récent au plus ancien, lien vers l\'article', async ({ page }) => {
        await page.goto('/blog/')
        const dates = await page.locator('main article time').evaluateAll((els) => els.map((e) => e.getAttribute('datetime')))
        expect(dates.length).toBeGreaterThan(2)
        expect(dates).toEqual([...dates].sort().reverse())
        const first = page.locator('main article a').first()
        const href = await first.getAttribute('href')
        await first.click()
        await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\/') + '$'))
        await expect(page.locator('h1')).toBeVisible()
    })
})

test.describe('Formulaire de contact', () => {
    for (const url of ['/contact/', '/en/contact/']) {
        test(`${url} : formulaire Netlify complet`, async ({ page }) => {
            await page.goto(url)
            const form = page.locator('form[name="contact"]')
            await expect(form).toHaveAttribute('data-netlify', 'true')
            await expect(form).toHaveAttribute('data-netlify-honeypot', 'bot-field')
            await expect(form.locator('input[name="form-name"]')).toHaveValue('contact')
            for (const name of ['name', 'email', 'message']) {
                await expect(form.locator(`[name="${name}"]`)).toHaveAttribute('required', '')
            }
            await expect(form).toHaveAttribute('action', url === '/contact/' ? '/contact/thanks/' : '/en/contact/thanks/')
        })
    }
})

test.describe('Sécurité', () => {
    test('politique de sécurité du contenu (CSP) : présente et sans violation', async ({ page }) => {
        // Les violations sont relevées par l'événement « securitypolicyviolation » du navigateur
        await page.addInitScript(() => {
            window.__cspViolations = []
            document.addEventListener('securitypolicyviolation', (e) => {
                window.__cspViolations.push(`${e.violatedDirective} : ${e.blockedURI || 'inline'}`)
            })
        })
        for (const url of PAGES) {
            await page.goto(url)
            await expect(page.locator('meta[http-equiv="content-security-policy"]'), url).toHaveCount(1)
            await page.waitForLoadState('load')
            expect(await page.evaluate(() => window.__cspViolations), url).toEqual([])
        }
    })
})

test.describe('Lien d\'évitement', () => {
    test('premier élément au clavier, mène à la zone principale', async ({ page }) => {
        await page.goto('/about/')
        await page.keyboard.press('Tab')
        const skip = page.locator('a.skip-link')
        await expect(skip).toBeFocused()
        await expect(skip).toHaveText('Aller au contenu')
        await expect(skip).toBeInViewport()
        await page.keyboard.press('Enter')
        await expect(page.locator('main#contenu')).toBeFocused()
        await page.goto('/en/about/')
        await expect(page.locator('a.skip-link')).toHaveText('Skip to content')
    })
})
