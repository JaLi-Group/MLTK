// Placeholder for future scripts
console.log("JaliGroup main site loaded.");

function toggleMenu() {
    const menu = document.getElementById("navMenu");
    if (menu.style.maxHeight) {
        menu.style.maxHeight = null;
    } else {
        menu.style.maxHeight = menu.scrollHeight + "px";
    }
}
