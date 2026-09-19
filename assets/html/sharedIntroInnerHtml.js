// HTML code for the Intro in index.html
let navBarLbls = {};

// Get text for the Intro section in index.html based on the selected language 
export function GetIntroInnerHTML(lang) {
    const lbls = lang === "fr" ? window.labels_fr : window.labels_en;
    const introLbls = lbls.intro;

    return `
        <h2>BP<em>Opti</em> Tech</h2>
        <h3>${introLbls.title1}</h3>
        <div><strong>BP<em>Opti</em> Tech</strong> ${introLbls.content1}</div>
        </div>
        <h3>${introLbls.title2}</h3>
        <div>${introLbls.content2}</div><br>

        <h2>${introLbls.whyChooseTitle}</h2>
        <div class="feature-grid">
            <div class="feature-card">
                <h3>${introLbls.whyChooseH}</h3>
                <p>${introLbls.whyChooseP}</p>
            </div>

            <div class="feature-card">
                <h3>${introLbls.whyChooseH2}</h3>
                <p>${introLbls.whyChooseP2}</p>
            </div>

            <div class="feature-card">
                <h3>${introLbls.whyChooseH3}</h3>
                <p>${introLbls.whyChooseP3}</p>
            </div>
        </div>
    </div>    
    `
}