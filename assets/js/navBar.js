
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

function configureLanguageSelector() {
    const picker = document.getElementById("languagePicker");
    const button = document.getElementById("languageButton");
    const label = document.getElementById("languageButtonLabel");
    const menu = document.getElementById("languageMenu");

    if (!picker || !button || !label || !menu) return;

    const currentPath = window.location.pathname;
    const effectivePath = currentPath.endsWith("/") ? `${currentPath}index.html` : currentPath;

    function getLocalizedPageUrl(targetLang, currentPathname = window.location.pathname) {
        const path = currentPathname.endsWith("/") ? `${currentPathname}index.html` : currentPathname;
        const segments = path.split("/").filter(Boolean);
        const localeIndex = segments.findIndex(segment => ["en", "fr", "es"].includes(segment.toLowerCase()));

        if (localeIndex === -1) {
            return `/${targetLang}/index.html`;
        }

        const remainingSegments = segments.slice(localeIndex + 1);
        const pagePath = remainingSegments.length > 0 ? `/${remainingSegments.join("/")}` : "/index.html";
        return `/${targetLang}${pagePath}`;
    }

    const setCurrentLabel = () => {
        const isFrench = /\/fr(?=\/|$)/.test(effectivePath);
        label.textContent = isFrench ? "Français" : "English";
    };

    const openMenu = () => {
        picker.classList.add("open");
    };

    const closeMenu = () => {
        picker.classList.remove("open");
    };

    let closeTimer = null;
    const scheduleClose = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            closeMenu();
        }, 120);
    };

    setCurrentLabel();

    picker.addEventListener("mouseenter", () => {
        if (closeTimer) clearTimeout(closeTimer);
        openMenu();
    });

    picker.addEventListener("mouseleave", scheduleClose);
    picker.addEventListener("focusin", openMenu);
    picker.addEventListener("focusout", (event) => {
        if (!picker.contains(event.relatedTarget)) {
            scheduleClose();
        }
    });

    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (picker.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    menu.addEventListener("click", (event) => {
        const option = event.target.closest(".language-option");
        if (!option) return;

        event.preventDefault();
        event.stopPropagation();

        const target = option.dataset.url || getLocalizedPageUrl(option.dataset.lang || "en");
        const nextLabel = option.dataset.label;
        if (target) {
            label.textContent = nextLabel;
            closeMenu();
            window.location.href = target;
        }
    });

    document.addEventListener("click", (event) => {
        if (!picker.contains(event.target)) {
            closeMenu();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configureLanguageSelector);
} else {
    configureLanguageSelector();
}