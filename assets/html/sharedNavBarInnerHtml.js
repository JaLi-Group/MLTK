// HTML code for the navigation bar

let navBarLbls = {};

// Get text for the navigation bar based on the selected language
function getLocalizedPageUrl(targetLang, currentPathname = window.location.pathname) {
    const path = currentPathname.endsWith("/") ? `${currentPathname}index.html` : currentPathname;
    const segments = path.split("/").filter(Boolean);
    const localeIndex = segments.findIndex(segment => ["en", "fr", "es"].includes(segment.toLowerCase()));

    // If no locale is found in the path, default to the target language's index page
    if (localeIndex === -1) {
        return `/${targetLang}/index.html`;
    }

    const remainingSegments = segments.slice(localeIndex + 1);
    const pagePath = remainingSegments.length > 0 ? `/${remainingSegments.join("/")}` : "/index.html";
    return `/${targetLang}${pagePath}`;
}

// HTML code for the shared version of the navigation bar
export function GetNavBarInnerHTML(lang) {
    const lbls = lang === "fr" ? window.labels_fr : window.labels_en;
    navBarLbls = lbls.navBar;

    const languageOptions = [
        { code: "en", label: "English", url: getLocalizedPageUrl("en", window.location.pathname) },
        { code: "fr", label: "Français", url: getLocalizedPageUrl("fr", window.location.pathname) }
    ].filter(option => option.code !== lang);

    const languageMenuHtml = languageOptions.map(option => `
        <li>
            <button type="button" class="language-option" data-url="${option.url}" data-label="${option.label}">${option.label}</button>
        </li>
    `).join("");

    return `
        <div class="brand-block">
            <img class="brand-logo" src="/assets/pictures/logos/jali-logo-img-128.png" alt="BPOpti Tech logo" />
            <div class="brand-text">
                <div class="logo">BP<em>Opti</em> Tech</div>
                <div class="brand-tagline">${navBarLbls.tagLine}</div>
            </div>
        </div>

        <button class="hamburger" aria-label="Menu" onclick="toggleMenu()">
            <svg width="30" height="30" viewBox="0 0 100 80" fill="#ffffff">
                <rect width="100" height="12"></rect>
                <rect y="30" width="100" height="12"></rect>
                <rect y="60" width="100" height="12"></rect>
            </svg>
        </button>

        <ul class="nav-links" id="navMenu">
            <li><a href="/${lang}/index.html" class="nav-link ${window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? 'active' : ''}">${navBarLbls.home}</a></li>
            <li><a href="/${lang}/products.html" class="nav-link ${window.location.pathname.includes('/products.html') ? 'active' : ''}">${navBarLbls.tools}</a></li>
            <li><a href="/${lang}/pricing.html" class="nav-link ${window.location.pathname.includes('/pricing.html') ? 'active' : ''}">${navBarLbls.pricing}</a></li>
            <li><a href="/${lang}/about.html" class="nav-link ${window.location.pathname.includes('/about.html') ? 'active' : ''}">${navBarLbls.about}</a></li>
            <li><a href="/${lang}/contact.html" class="nav-link ${window.location.pathname.includes('/contact.html') ? 'active' : ''}">${navBarLbls.contact}</a></li>
            <li><a href="https://docs.BPOpti Tech.ca">Documentation</a></li>
        </ul>

        <div class="nav-actions">
            <div class="language-picker" id="languagePicker">
                <button type="button" class="language-button" id="languageButton" aria-label="Select language">
                    <span class="language-icon" aria-hidden="true">🌐</span>
                    <span class="language-button-text" id="languageButtonLabel">${lang === "fr" ? "Français" : "English"}</span>
                </button>
                <ul class="language-menu" id="languageMenu" role="menu" aria-label="Language menu">
                    ${languageMenuHtml}
                </ul>
            </div>
        </div>
    `;
}