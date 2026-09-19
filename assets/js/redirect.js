import { ensureLabels, getPreferredLanguage } from "./i18n.js";

// Redirect to the appropriate language version of the site based on the user's preferred language
const targetLanguage = getPreferredLanguage();
const targetPath = `/${targetLanguage}/index.html`;

// Ensure that the labels are loaded and available in the global window object
await ensureLabels();

// Store the labels in sessionStorage for future use
sessionStorage.setItem(
    "siteLabels",
    JSON.stringify({
        en: window.labels_en,
        fr: window.labels_fr,
        es: window.labels_es,
    })
);

// Redirect to the target path
// Use window.location.replace to avoid adding the redirect to the browser's history
// This way, the user won't be able to click "Back" and return to the redirect page
// Note1: If you want to allow the user to go back to the redirect page, use window.location.href instead
// Note2: Keep this last line of code in this file, otherwise the redirect won't work, the user will stay 
//        on the redirect page and the labels won't be loaded in the global window object
window.location.replace(targetPath);

