Office.onReady(() => {
    document.getElementById("loadSelectionBtn").onclick = loadSelectedCell;
});

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

async function loadSelectedCell() {
    try {
        await Excel.run(async (ctx) => {
            const cell = ctx.workbook.getSelectedRange();
            cell.load("values");
            await ctx.sync();

            const value = cell.values[0][0];
            if (typeof value === "string" && value.trim() !== "") {
                document.getElementById("localeInput").value = value.trim();
                lookupLocaleTag();
            }
        });
    } catch (err) {
        mltkLogger.debug("No valid cell value");
    }
}

function initLocaleTab() {
    mltkLogger.debug("Initializing Locale tab…");

    const btn = document.getElementById("localeLookupBtn");
    if (!btn) {
        mltkLogger.debug("Locale tab button not found yet.");
        return;
    }
    btn.onclick = lookupLocaleTag;

    document.getElementById("localeInput").addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            lookupLocaleTag();
        }
    });

    applyLocaleTabLabels();

    mltkLogger.debug("Locale tab initialized.");
}

// mltkLogger.debug("Locale tab JS loaded");
function applyLocaleTabLabels() {
    if (!window.labels) return;

    document.getElementById("locale-title").innerText = window.labels.ui.tabs.locale;
    document.getElementById("locale-input-label").innerText = window.labels.locale?.controls?.inputLabel || "Locale Tag:";
    document.getElementById("localeLookupBtn").innerText = window.labels.locale?.controls?.localeLookupBtn || "Enter";
    document.getElementById("loadSelectionBtn").innerText = window.labels.locale?.controls?.loadSelectionBtn || "Load";
}

async function lookupLocaleTag() {
    mltkLogger.debug("Lookup button clicked!");
    const tag = document.getElementById("localeInput").value.trim();
    if (!tag) {
        showLocaleResult("Please enter a locale tag.");
        return;
    }

    try {
        const info = await Excel.run(async (ctx) => {
            // Call your existing core function
            const result = window.LocaleInfo(tag);
            return result;
        }); 

        if (info.error) {
            showLocaleResult(info.error);
            return;
        }

        showLocaleResult(formatLocaleInfo(info));

    } catch (err) {
        showLocaleResult("Error: " + err);
    }
}

function formatLocaleInfo(info) {
    if (info.error) {
        return `<b>Error:</b> ${info.error}`;
    }

    return `
        <b>${window.labels.locale?.controls?.localeLbl}</b> ${info.locale}<br>
        <b>${window.labels.locale?.controls?.langCodeLbl}</b> ${info.languageCode}<br>
        <b>${window.labels.locale?.controls?.langNameLbl}</b> ${info.languageName}<br>
        <b>${window.labels.locale?.controls?.langNameLocalLbl}</b> ${info.languageNameLocal}<br>
        <b>${window.labels.locale?.controls?.countryCodeLbl}</b> ${info.countryCode}<br>
        <b>${window.labels.locale?.controls?.countryNameLbl}</b> ${info.countryName}<br>
        <b>${window.labels.locale?.controls?.flagLbl}</b> ${info.flag}<br>
        <b>${window.labels.locale?.controls?.continentLbl}</b> ${info.continent}<br>
        <b>${window.labels.locale?.controls?.regionLbl}</b> ${info.region}<br>
        <b>${window.labels.locale?.controls?.currencyLbl}</b><br>
        <b>${window.labels.locale?.controls?.currencyNameLbl}</b> ${info.currencyName}<br>
        <b>${window.labels.locale?.controls?.currencyNameLocalLbl}</b> ${info.currencyNameLocal}<br>
        <b>${window.labels.locale?.controls?.currencyCodeLbl}</b> ${info.currencyCode}<br>
        <b>${window.labels.locale?.controls?.currencySymbolLbl}</b> ${info.currencySymbol}<br>
    `;
}

function showLocaleResult(html) {
    document.getElementById("localeResult").innerHTML = html;
}
