
import { GetNavBarInnerHTML } from "/assets/html/sharedNavBarInnerHtml.js";
import { ensureLabels } from "./i18n.js";

await ensureLabels();

const navBarEnEl = document.getElementById("mainNavBarEn");
const navBarFrEl = document.getElementById("mainNavBarFr");
const navBarEsEl = document.getElementById("mainNavBarEs");

if (navBarEnEl) {
    navBarEnEl.innerHTML = GetNavBarInnerHTML("en");
}

if (navBarFrEl) {
    navBarFrEl.innerHTML = GetNavBarInnerHTML("fr");
}

if (navBarEsEl) {
    navBarEsEl.innerHTML = GetNavBarInnerHTML("es");
}

window.toggleMenu = function toggleMenu() {
    const menu = document.getElementById("navMenu");
    if (menu.style.maxHeight && menu.style.maxHeight !== "0px") {
        menu.style.maxHeight = "0px";
    } else {
        menu.style.maxHeight = menu.scrollHeight + "px";
    }
};

// Language toggle that keeps the current page
function configureLanguageToggle() {
    const toggle = document.getElementById("langToggle");
    if (!toggle) return;

    const currentUrl = new URL(window.location.href);
    const languageMatch = currentUrl.pathname.match(/(^|\/)(en|fr)(?=\/|$)/);

    if (!languageMatch) {
        toggle.href = new URL("en/index.html", currentUrl).href;
        return;
    }

    const currentLanguage = languageMatch[2];
    const targetLanguage = currentLanguage === "fr" ? "en" : "fr";

    if (currentLanguage === "fr") {
        toggle.textContent = "EN";
    } else {
        toggle.textContent = "FR";
    }

    const targetPath = currentUrl.pathname.replace(
        /(^|\/)(en|fr)(?=\/|$)/,
        `$1${targetLanguage}`
    );

    currentUrl.pathname = targetPath;
    toggle.href = currentUrl.href;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configureLanguageToggle);
} else {
    configureLanguageToggle();
}