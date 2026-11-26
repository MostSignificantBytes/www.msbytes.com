// Fonctions du site testées sans navigateur.
import { test, expect } from '@playwright/test'
import kebabCase from '../src/utils/kebabCase.js'

// Adresses des pages de mot-clé : mêmes résultats que kebabCase de lodash (remplacé le 26/11/2026).
test('kebabCase : adresses des mots-clés', () => {
    const cases = {
        'modèle osi': 'modele-osi',
        réseau: 'reseau',
        présentation: 'presentation',
        'wi-fi': 'wi-fi',
        'data link': 'data-link',
        Application: 'application',
        'Wi-Fi 6E': 'wi-fi-6-e',
        '802.1X': '802-1-x',
        IPv6: 'i-pv-6',
        XMLHttpRequest: 'xml-http-request',
        "l'été": 'lete',
        Straße: 'strasse',
        œuvre: 'oeuvre',
        'TCP/IP': 'tcp-ip',
        '  ': '',
    }
    for (const [tag, path] of Object.entries(cases)) expect(kebabCase(tag), tag).toBe(path)
})
