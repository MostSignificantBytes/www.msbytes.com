// Tests dans un navigateur (Chromium) sur le site construit : npm test (après npm run build).
// Le serveur de test sert dist/ comme Netlify (tests/serve.mjs).
import { defineConfig } from '@playwright/test'

const PORT = 4322

export default defineConfig({
    testDir: 'tests',
    testMatch: '*.spec.mjs',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        // Chromium déjà installé (poste ou environnement sans téléchargement) : PW_CHROMIUM_PATH=<chemin>
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
    },
    webServer: {
        command: `node tests/serve.mjs dist ${PORT}`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env.CI,
    },
})
