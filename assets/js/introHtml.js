import { GetIntroInnerHTML } from "../html/sharedIntroInnerHtml.js";
import { ensureLabels } from "./i18n.js";

await ensureLabels();

const introEnEl = document.getElementById("introContentEn");
const introFrEl = document.getElementById("introContentFr");

if (introEnEl) {
    introEnEl.innerHTML = GetIntroInnerHTML("en");
}

if (introFrEl) {
    introFrEl.innerHTML = GetIntroInnerHTML("fr");
}

