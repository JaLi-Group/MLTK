// This file contains functions related to internationalization (i18n) and localization (l10n) for the website.
// It provides functions to load language labels, determine the preferred language, and ensure that the labels are available for use in the application.
// The labels are stored in JSON files for each supported language (English, French, and Spanish) and are loaded into the global window object for easy access throughout the application.

// Get the preferred language of the user based on the browser settings
// Returns "fr" for French and "en" for English. Defaults to "en" if the language is not recognized.
// Will add support for Spanish in the future.
export function getPreferredLanguage() {
    const browserLanguage = navigator.language || navigator.userLanguage || "en";
    return browserLanguage.toLowerCase().startsWith("fr") ? "fr" : "en";
}

// Ensure that the labels are loaded and available in the global window object
// This function checks if the labels are already loaded, and if not, it fetches them from the JSON files
export async function ensureLabels() {
    const cached = sessionStorage.getItem("siteLabels");
    if (!window.labels_en && !window.labels_fr && !window.labels_es && cached) {
        try {
            const parsed = JSON.parse(cached);
            window.labels_en = parsed.en || {};
            window.labels_fr = parsed.fr || {};
            window.labels_es = parsed.es || {};
        } catch (error) {
            console.warn("Failed to restore labels from sessionStorage", error);
        }
    }

    const hasLabels =
        window.labels_en &&
        window.labels_fr &&
        window.labels_es;

    if (hasLabels) {
        return {
            en: window.labels_en,
            fr: window.labels_fr,
            es: window.labels_es,
        };
    }

    const [en, fr, es] = await Promise.all([
        fetchJson("/assets/i18n/en.json"),
        fetchJson("/assets/i18n/fr.json"),
        fetchJson("/assets/i18n/es.json"),
    ]);

    window.labels_en = en;
    window.labels_fr = fr;
    window.labels_es = es;

    sessionStorage.setItem(
        "siteLabels",
        JSON.stringify({ en, fr, es })
    );

    return { en, fr, es };
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
    }
    return response.json();
}

export function getPageLanguage() {
    const match = window.location.pathname.match(/(?:^|\/)(en|fr|es)(?=\/|$)/i);
    return match ? match[1].toLowerCase() : null;
}
