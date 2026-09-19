// HTML code for the navigation bar

let navBarLbls = {};

// HTML code for the shared version of the navigation bar
export function GetNavBarInnerHTML(lang) {

    console.log(`window.labels_en => ${window.labels_en}`)
    console.log(`window.labels_fr => ${window.labels_fr}`)

    const lbls = lang === "fr" ? window.labels_fr  : window.labels_en;  
    navBarLbls = lbls.navBar;

    return  `
        <div class="logo">BP<em>Opti</em> Tech </div><br>
        <div class="logo">${navBarLbls.title1}</div>

        <button class="hamburger" aria-label="Menu" onclick="toggleMenu()">
            <svg width="30" height="30" viewBox="0 0 100 80" fill="#ffffff">
                <rect width="100" height="12"></rect>
                <rect y="30" width="100" height="12"></rect>
                <rect y="60" width="100" height="12"></rect>
            </svg>
        </button>

        <ul class="nav-links" id="navMenu">
            <li><a href="/${lang}/index.html">${navBarLbls.home}</a></li>
            <li><a href="/${lang}/products.html">${navBarLbls.tools}</a></li>
            <li><a href="/${lang}/pricing.html">${navBarLbls.pricing}</a></li>
            <li><a href="/${lang}/about.html">${navBarLbls.about}</a></li>
            <li><a href="/${lang}/contact.html">${navBarLbls.contact}</a></li>
            <li><a href="https://docs.jaligroup.ca">Documentation</a></li>
        </ul>
    `;   

}

// export const navBarEnInnerHTML = `
//     <div class="logo">JaliGroup</div>

//     <button class="hamburger" aria-label="Menu" onclick="toggleMenu()">
//         <svg width="30" height="30" viewBox="0 0 100 80" fill="#ffffff">
//             <rect width="100" height="12"></rect>
//             <rect y="30" width="100" height="12"></rect>
//             <rect y="60" width="100" height="12"></rect>
//         </svg>
//     </button>

//     <ul class="nav-links" id="navMenu">
//         <li><a href="/en/index.html">Home</a></li>
//         <li><a href="/en/products.html">Tools</a></li>
//         <li><a href="/en/pricing.html">Pricing</a></li>
//         <li><a href="/en/about.html">About</a></li>
//         <li><a href="/en/contact.html">Contact</a></li>
//         <li><a href="https://docs.jaligroup.ca">Documentation</a></li>
//     </ul>
// `;   

// // HTML code for the French version of the navigation bar
// export const navBarFrInnerHTML = `
//     <div class="logo">Jali Group</div>

//     <button class="hamburger" aria-label="Menu" onclick="toggleMenu()">
//         <svg width="30" height="30" viewBox="0 0 100 80" fill="#ffffff">
//             <rect width="100" height="12"></rect>
//             <rect y="30" width="100" height="12"></rect>
//             <rect y="60" width="100" height="12"></rect>
//         </svg>
//     </button>

//     <ul class="nav-links" id="navMenu">
//         <li><a href="/fr/index.html">Accueil</a></li>
//         <li><a href="/fr/products.html">Outils</a></li>
//         <li><a href="/fr/pricing.html">Tarification</a></li>
//         <li><a href="/fr/about.html">À propos</a></li>
//         <li><a href="/fr/contact.html">Contact</a></li>
//         <li><a href="https://docs.jaligroup.ca">Documentation</a></li>
//     </ul>
// `;   



