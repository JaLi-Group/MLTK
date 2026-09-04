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

/* Merge Preview Tab */
let mergeData = [];      // all rows
let mergeIndex = -1;     // current row index

function initMergeTab() {
    mltkLogger.debug("Initializing Merge tab…");
    document.getElementById("mergeLoadBtn").onclick = loadSelectedRow;
    document.getElementById("mergePrevBtn").onclick = showPreviousRecord;
    document.getElementById("mergeNextBtn").onclick = showNextRecord;
    document.getElementById("mergeCopyBtn").onclick = copyMergeOutput;
    document.getElementById("mergeInsertBtn").onclick = insertMergeOutput;
    document.getElementById("mergeGoBtn").onclick = goToRecord;

    document.getElementById("mergeRecordInput").addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            goToRecord();
        }
    });

    applyMergeTabLabels();
    mltkLogger.debug("...Merge tab initialized.");
}

function applyMergeTabLabels() {
    if (!window.labels) return;
    document.getElementById("merge-title").innerText = window.labels.ui.tabs.merge;

    const b = window.labels.merge.controls;
    document.getElementById("mergeLoadBtn").innerText = b.loadRecBtnLbl;
    document.getElementById("mergePrevBtn").innerText = b.prevBtnLbl;
    document.getElementById("mergeNextBtn").innerText = b.nextBtnLbl;
    document.getElementById("mergeCopyBtn").innerText = b.copyBtnLbl;
    document.getElementById("mergeInsertBtn").innerText = b.insertBtnLbl;
    document.getElementById("mergeGoBtn").innerText = b.goBtnLbl;
    const recInput = document.getElementById("mergeRecordInput");
    if (recInput) recInput.placeholder = b.recNumInputPlaceHolder;
    document.getElementById("mergeRecordInputLbl").innerText = b.recNumLabelLbl;
}

async function loadSelectedRow() {
    await Excel.run(async (ctx) => {
        const sheet = ctx.workbook.worksheets.getActiveWorksheet();
        const range = ctx.workbook.getSelectedRange();
        range.load("values, rowIndex");
        await ctx.sync();
        const rowIndex = range.rowIndex;

        const used = sheet.getUsedRange();
        used.load("values");

        await ctx.sync();

        mergeData = used.values;    
        // mergeData contains all rows and 
        //  - mergeData[0] = header row;
        //  - mergeData[1] = first data row
        //  - mergeData[rowIndex] = selected row

        // start at selected row
        mergeIndex = Math.min(Math.max(rowIndex, 1), mergeData.length - 1);

        showMergePreview();

    });
}

function showMergePreview() {
    if (mergeIndex < 0 || mergeIndex >= mergeData.length) return;
    const row = mergeData[mergeIndex];
    const letter = buildLetter(row);
    document.getElementById("mergeOutput").innerHTML = letter;
    document.getElementById("mergeRecordInput").value = mergeIndex;
}

function getMergeLabels(prefLang) {
    if (prefLang === "fr") return window.labels_fr.merge.ltrTexts;
    if (prefLang === "es") return window.labels_es.merge.ltrTexts;
    return window.labels_en.merge.ltrTexts;
}

function buildLetter(row) {
    const firstName = row[1];
    const lastName = row[2];
    const prefLang = row[3];
    const dob = row[21];
    const doh = row[22];
    const salary = row[27];
    const locale = row[17];
    const infoAsOfDate = row[20];
    const age60Date = row[23];
    const age65Date = row[24];
    const earlyRetDate = row[25];
    const normalRetDate = row[26];

    const info = window.LocaleInfo(locale);

    const ml = getMergeLabels(prefLang);
    const transNote = (prefLang !== "en") ?
        "<b><em>NOTE: Translated from English by AI for demonstration purposes only</em></b><br><br>" :
        "";

    return `
        <br><br>
        ${transNote}

        <b>${ml.dear} ${firstName} ${lastName},</b><br><br>

        ${ml.ltrP01}<br><br>
        ${ml.ltrP02}<br><br>

        <b>${ml.planInfo} ${infoAsOfDate}</b><br>

        <b>${ml.personalInfo}</b><br>
        ${ml.dob} ${dob}<br>
        ${ml.doh} ${doh}<br>
        ${ml.salary} ${salary}<br><br>

        ${ml.age60} ${age60Date}<br>
        ${ml.age65} ${age65Date}<br>
        ${ml.erd} ${earlyRetDate}<br>
        ${ml.nrd} ${normalRetDate}<br><br>

        ${ml.closingP01}<br><br>
        ${ml.closingP02}<br>
        ${ml.closingP03}
    `;
}

function showPreviousRecord() {
    if (mergeIndex > 1) {
        mergeIndex--;
        showMergePreview();
    }
}

function showNextRecord() {
    if (mergeIndex < mergeData.length - 1) {
        mergeIndex++;
        showMergePreview();
    }
}

function copyMergeOutput() {
    mltkLogger.debug("Copy clicked");
    const html = document.getElementById("mergeOutput").innerHTML;
    navigator.clipboard.writeText(html);
}

async function insertMergeOutput() {
    mltkLogger.debug("Insert clicked");
    await Excel.run(async (ctx) => {
        const sheet = ctx.workbook.getActiveWorksheet();
        const range = ctx.workbook.getSelectedRange();
        range.values = [[document.getElementById("mergeOutput").innerText]];
        await ctx.sync();
    });
}

function goToRecord() {
    const n = parseInt(document.getElementById("mergeRecordInput").value, 10);

    if (mergeData.length === 0) loadSelectedRow();

    if (isNaN(n) || n < 1 || n > mergeData.length-1) {
        mltkLogger.debug("Invalid record number");
        return;
    }

    mergeIndex = n;
    showMergePreview();
}