// safe logger reference (place at top of files that use mltkLogger)
if (typeof window.mltkLogger === "undefined") {
  window.mltkLogger = {
    log: () => {},
    debug: () => {},
    info: () => {},
    warn: (...args) => { console.warn(...args); },
    error: (...args) => { console.error(...args); }
  };
}

mltkLogger.debug("Numbers tab JS loaded");

const numbersLocaleValueInputEl = document.getElementById("numbersLocaleValueInput");
const numbersNumberValueInputEl = document.getElementById("numbersNumberValueInput");
const numbersLocaleLoadCellBtnEl = document.getElementById("numbersLocaleLoadCellBtn");
const numbersNumberLoadCellBtnEl = document.getElementById("numbersNumberLoadCellBtn");




function initNumbersTab() {
    mltkLogger.debug("Initializing Numbers tab…");

    numbersLocaleLoadCellBtnEl.onclick = loadLocaleFromSelectedCell;
    numbersNumberLoadCellBtnEl.onclick = loadNumberFromSelectedCell;

    document.getElementById("numericDecimalsInput").oninput = updateNumericPreview;

    // Fire all updates on Enter
    numbersNumberValueInputEl.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            updateCurrencyPreview();
            updateNumericPreview();
            // updateCustomPreview();
            // showNumberFormats();
        }
    });

    // Trigger Show Formats on Enter
    numbersLocaleValueInputEl.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            updateCurrencyPreview();
            updateNumericPreview();
            // updateCustomPreview();
        }
    });


    applyNumbersTabLabels();
    updateCurrencyPreview();
    updateNumericPreview();
    // updateCustomPreview();
    // showNumberFormats();
    mltkLogger.debug("Numbers tab initialized.");
}

function applyNumbersTabLabels() {
    const L = window.labels.numbers;

    document.getElementById("numbers-title").innerText = L.title;
    document.getElementById("numbers-locale-label").innerText = L.locale;
    numbersLocaleLoadCellBtnEl.innerText = L.show;

    document.getElementById("numbersNumberLbl").innerText = L.controls.numbersNumberLbl;
    numbersNumberLoadCellBtnEl.innerText = L.controls.numbersLoadBtn;

    // Section headers (if localized)
    // You may add these keys to your JSON if desired:
    // document.getElementById("inputsHearder").innerText = L.inputsSection;
    // document.getElementById("currencyHearder").innerText = L.currencySection;
    // document.getElementById("numericHearder").innerText = L.numericSection;
    // document.getElementById("customHearder").innerText = L.customSection;

    // Buttons
    // document.getElementById("currencyApplyBtn").innerText = L.controls.apply;
    // document.getElementById("currencyCopyBtn").innerText = L.controls.copy;

    // document.getElementById("numericApplyBtn").innerText = L.controls.apply;
    // document.getElementById("numericCopyBtn").innerText = L.controls.copy;

    // document.getElementById("customApplyBtn").innerText = L.controls.apply;
    // document.getElementById("customCopyBtn").innerText = L.controls.copy;
}
 

function loadNumberFromSelectedCell() {
    Excel.run(async (ctx) => {
        const range = ctx.workbook.getSelectedRange();
        range.load("values");
        await ctx.sync();

        const val = range.values[0][0];
        numbersNumberValueInputEl.value = val;
        updateCurrencyPreview();
        updateNumericPreview();
        // updateCustomPreview();
    });
}

function loadLocaleFromSelectedCell() {
    Excel.run(async (ctx) => {
        const range = ctx.workbook.getSelectedRange();
        range.load("values");
        await ctx.sync();

        const val = range.values[0][0] ? range.values[0][0] : "en-CA"  ;

        numbersLocaleValueInputEl.value = val;
        updateCurrencyPreview();
        updateNumericPreview();
        // updateCustomPreview();
    });
}

function showNumberFormats() {
    const tag = numbersLocaleValueInputEl.value.trim();
    const info = window.LocaleInfo(tag);

    if (info.error) {
        document.getElementById("numbersOutput").innerHTML = `<b>Error:</b> ${info.error}`;
        return;
    }

    const summary = `
        <b>Locale:</b> ${info.locale}<br>
        <b>Language:</b> ${info.languageName}<br>
        <b>Country:</b> ${info.countryName}<br>
        <b>Currency:</b> ${info.currencyCode} (${info.currencySymbol})<br>
        <b>Thousands:</b> "${info.th}"<br>
        <b>Decimal:</b> "${info.dec}"<br>
    `;

    document.getElementById("numbersLocaleSummary").innerHTML = summary;

    updateCurrencyPreview();
    updateNumericPreview();
    // updateCustomPreview();
}

function updateCurrencyPreview() {
    const tag = numbersLocaleValueInputEl.value.trim();
    const val = parseFloat(numbersNumberValueInputEl.value);

    const previewSymbol = window.formatNumber(val, tag, "currency", "symbol");
    const previewNarrowSymbol = window.formatNumber(val, tag, "currency", "narrowSymbol");
    const previewCode = window.formatNumber(val, tag, "currency", "code");
    const previewName = window.formatNumber(val, tag, "currency", "name");

    document.getElementById("currencyPreview").innerHTML = `
     - <strong>"symbol"</strong>:       ${previewSymbol}<br>
     - <strong>"narrowSymbol"</strong>: ${previewNarrowSymbol}<br>
     - <strong>"code"</strong>:         ${previewCode}<br>
     - <strong>"name"</strong>:         ${previewName}     
     `;
}

function updateNumericPreview() {
    const tag = numbersLocaleValueInputEl.value.trim();
    const val = parseFloat(numbersNumberValueInputEl.value);
    const decimals = parseInt(document.getElementById("numericDecimalsInput").value);

    const previewDecimal = window.formatNumber(val, tag, "decimal", "", decimals);
    const previewPercent = window.formatNumber(val, tag, "percent", "", decimals);
    const previewScientific = window.formatNumber(val, tag, "decimal", "", decimals, {notation: "scientific"});
    const previewEngineering = window.formatNumber(val, tag, "decimal", "", decimals, {notation: "engineering"});

    const strPreviewDecimal = `MTLK.FormatNumber(num,loc,"decimal", "", ${decimals})`;
    const strPreviewPercent = `MTLK.FormatNumber(num,loc,"percent", "", ${decimals})`;
    const strPreviewScientific = `MTLK.FormatNumber(num,loc,"scientific", "", ${decimals})`;
    const strPreviewEngineering = `MTLK.FormatNumber(num,loc,"engineering", "", ${decimals})`;

    document.getElementById("numericPreview").innerHTML = `
     =<strong>${strPreviewDecimal}</strong> returns:  ${previewDecimal}<br>
     =<strong>${strPreviewPercent}</strong> returns:  ${previewPercent}<br>
     =<strong>${strPreviewScientific}</strong> returns:  ${previewScientific}<br>
     =<strong>${strPreviewEngineering}</strong> returns:  ${previewEngineering}<br>
     `;
}

function updateCustomPreview() {
    const tag = numbersLocaleValueInputEl.value.trim();
    const val = parseFloat(numbersNumberValueInputEl.value);
    const mask = document.getElementById("customMaskInput").value;

    currentCustomMask = mask;

    const info = window.LocaleInfo(tag);
    // const preview = formatWithMask(val, mask, info);

    // document.getElementById("customPreview").innerHTML = preview;
}

