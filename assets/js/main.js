// Placeholder for future scripts
console.log("JaliGroup main site loaded.");

function toggleMenu() {
    const menu = document.getElementById("navMenu");
    if (menu.style.maxHeight && menu.style.maxHeight !== "0px") {
        menu.style.maxHeight = "0px";
    } else {
        menu.style.maxHeight = menu.scrollHeight + "px";
    }
}

// Language toggle that keeps the current page
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("langToggle");
    if (!toggle) return;

    const path = window.location.pathname;

    // Detect current language
    const isFrench = path.startsWith("/fr/");
    const isEnglish = path.startsWith("/en/");

    // Compute target path
    let target = path;

    if (isFrench) {
        toggle.textContent = "EN";
        target = path.replace("/fr/", "/en/");
    } else if (isEnglish) {
        toggle.textContent = "FR";
        target = path.replace("/en/", "/fr/");
    } else {
        // Fallback: redirect to root
        target = "/en/index.html";
    }

    toggle.href = target;
});
