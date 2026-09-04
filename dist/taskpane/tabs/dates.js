/* dates.js - complete, self-contained rewrite
   - Defensive and consistent: single source of truth for element refs
   - Uses class-based visibility but also applies inline styles as a fallback
   - Persists user preference in localStorage under "mltk.useDatePicker"
   - Converts Excel serial dates when loading from the sheet
   - Assumes helper functions exist on window: formatDate, LocaleInfo, normalizeLocaleCode, isValidLocale, excelSerialToPlainDate
*/

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

mltkLogger.debug("Dates tab JS loaded");

/* -------------------------
   Element references
   ------------------------- */
const datesLocaleInputEl = document.getElementById("datesLocaleInput");
const datesLocaleLoadCellBtnEl = document.getElementById("datesLocaleLoadCellBtn");

const datesDateInputEl = document.getElementById("datesDateInput");
const datesDatePickerEl = document.getElementById("datesDatePicker");
const datesDateLoadCellBtnEl = document.getElementById("datesDateLoadCellBtn");
const datesTogglePickerBtnEl = document.getElementById("datesTogglePickerBtn");

const datesFormatInputEl = document.getElementById("datesFormatInput");
const datesFormatLoadCellBtnEl = document.getElementById("datesFormatLoadCellBtn");
const datesCopyFormatBtnEl = document.getElementById("datesCopyFormatBtn");
const datesApplyFormatBtnEl = document.getElementById("datesApplyFormatBtn");

const datesShowResultBtnEl = document.getElementById("datesShowResultBtn");

const datesMsgEl = document.getElementById("datesMsg");
const datesOutputEl = document.getElementById("datesOutput");

/* -------------------------
   Constants
   ------------------------- */
const DATEPREF_KEY = "mltk.useDatePicker";

/* -------------------------
   Utility helpers
   ------------------------- */
function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function setMsg(text, timeout = 1400) {
  if (!datesMsgEl) return;
  datesMsgEl.innerText = text;
  if (timeout > 0) {
    setTimeout(() => {
      if (datesMsgEl && datesMsgEl.innerText === text) datesMsgEl.innerText = "";
    }, timeout);
  }
}

/* -------------------------
   Date parsing helper (keeps your existing safeParseDate semantics)
   ------------------------- */
function safeParseDate(input) {
  if (!input || typeof input !== "string") {
    return { error: "No date provided", date: Temporal.PlainDate.from("1987-07-25") };
  }

  const raw = input.trim();

  // Auto-formatting: convert common formats to ISO
  let iso = raw;

  // dd/mm/yyyy → yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/");
    iso = `${yyyy}-${mm}-${dd}`;
  }

  // dd-mm-yyyy → yyyy-mm-dd
  if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("-");
    iso = `${yyyy}-${mm}-${dd}`;
  }

  // yyyy/mm/dd → yyyy-mm-dd
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(raw)) {
    const [yyyy, mm, dd] = raw.split("/");
    iso = `${yyyy}-${mm}-${dd}`;
  }

  // Validate ISO format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { error: `Invalid date format: "${raw}"`, date: null };
  }

  // Try Temporal
  try {
    const d = Temporal.PlainDate.from(iso);
    return { error: null, date: d };
  } catch (e) {
    return { error: `Invalid ISO date: "${iso}"`, date: null };
  }
}

/* -------------------------
   Visibility helpers (classes + inline fallback)
   ------------------------- */
function showPickerInline() {
  if (!datesDatePickerEl || !datesDateInputEl) return;
  // class toggles (preferred)
  datesDatePickerEl.classList.remove("datesDatePickNone", "datesTextHidden");
  datesDatePickerEl.classList.add("datesDatePickVisible");
  datesDateInputEl.classList.remove("datesTextVisible");
  datesDateInputEl.classList.add("datesTextHidden");

  // inline fallback to ensure immediate visual change
  datesDatePickerEl.style.display = "inline-block";
  datesDatePickerEl.style.visibility = "visible";
  datesDatePickerEl.style.opacity = "1";
  datesDateInputEl.style.display = "none";
}

function showTextInline() {
  if (!datesDatePickerEl || !datesDateInputEl) return;
  datesDatePickerEl.classList.remove("datesDatePickVisible");
  datesDatePickerEl.classList.add("datesDatePickNone");
  datesDateInputEl.classList.remove("datesTextHidden");
  datesDateInputEl.classList.add("datesTextVisible");

  datesDatePickerEl.style.display = "none";
  datesDateInputEl.style.display = "inline-block";
  datesDateInputEl.style.visibility = "visible";
  datesDateInputEl.style.opacity = "1";
}

/* -------------------------
   Apply preference (boolean)
   ------------------------- */
function applyDatePickerPreference(usePicker) {
  if (!datesDatePickerEl || !datesDateInputEl || !datesTogglePickerBtnEl) {
    mltkLogger.warn("applyDatePickerPreference: missing elements");
    return;
  }

  usePicker = !!usePicker;

  if (usePicker) {
    showPickerInline();
    // sync value if text input contains ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(datesDateInputEl.value)) {
      datesDatePickerEl.value = datesDateInputEl.value;
    } else {
      datesDatePickerEl.value = "";
    }
    datesTogglePickerBtnEl.innerText = "Use Text Input";
  } else {
    showTextInline();
    if (datesDatePickerEl.value) datesDateInputEl.value = datesDatePickerEl.value;
    datesTogglePickerBtnEl.innerText = "Toggle Date Picker";
  }

  mltkLogger.debug(`applyDatePickerPreference: usePicker=${usePicker}`);
}

/* -------------------------
   Toggle handler (defensive)
   ------------------------- */
function toggleDatePicker() {
  try {
    if (!datesDatePickerEl || !datesDateInputEl || !datesTogglePickerBtnEl) {
      mltkLogger.error("toggleDatePicker: missing elements");
      setMsg("Toggle failed: missing UI elements.");
      return;
    }

    // Determine current visible state using computed style (defensive)
    const pickerComputed = getComputedStyle(datesDatePickerEl);
    const pickerVisible = pickerComputed.display !== "none" && pickerComputed.visibility !== "hidden" && pickerComputed.opacity !== "0";
    const newUsePicker = !pickerVisible;

    // Apply immediately
    if (newUsePicker) {
      showPickerInline();
      if (/^\d{4}-\d{2}-\d{2}$/.test(datesDateInputEl.value)) datesDatePickerEl.value = datesDateInputEl.value;
    } else {
      showTextInline();
      if (datesDatePickerEl.value) datesDateInputEl.value = datesDatePickerEl.value;
    }

    // Persist preference (non-fatal)
    try {
      localStorage.setItem(DATEPREF_KEY, newUsePicker ? "1" : "0");
      mltkLogger.debug(`toggleDatePicker: persisted ${DATEPREF_KEY}=${newUsePicker ? "1" : "0"}`);
    } catch (e) {
      mltkLogger.warn("toggleDatePicker: localStorage.setItem failed", e);
    }

    setMsg(newUsePicker ? "Using date picker (saved)" : "Using text input (saved)");
  } catch (err) {
    mltkLogger.error("toggleDatePicker: unexpected error", err);
    setMsg(`Toggle error: ${err.message || err}`);
  }
}

/* -------------------------
   Load data from selected cell (async)
   - Converts Excel serials to ISO using window.excelSerialToPlainDate if available
   ------------------------- */
async function loadDataFromSelectedCell(input) {
  try {
    await Excel.run(async (ctx) => {
      const range = ctx.workbook.getSelectedRange();
      range.load("values");
      await ctx.sync();
      const val = range.values && range.values[0] ? range.values[0][0] : null;

      switch (input) {
        case "locale": {
          if (val != null) datesLocaleInputEl.value = String(val);
          break;
        }
        case "date": {
          if (val == null) break;

          // If numeric (Excel serial) or numeric string, convert
          const raw = val;
          if (typeof raw === "number" || (/^\d+(\.\d+)?$/.test(String(raw).trim()))) {
            const serial = typeof raw === "number" ? raw : Number(String(raw).trim());
            try {
              if (typeof window.excelSerialToPlainDate === "function") {
                const plain = window.excelSerialToPlainDate(serial);
                // Accept Temporal.PlainDate or POJO {year,month,day}
                let iso = null;
                if (plain instanceof Temporal.PlainDate) {
                  iso = plain.toString();
                } else if (plain && plain.year && plain.month && plain.day) {
                  const mm = String(plain.month).padStart(2, "0");
                  const dd = String(plain.day).padStart(2, "0");
                  iso = `${plain.year}-${mm}-${dd}`;
                } else if (typeof plain === "string" && /^\d{4}-\d{2}-\d{2}$/.test(plain)) {
                  iso = plain;
                }

                if (iso) {
                  datesDateInputEl.value = iso;
                  datesDatePickerEl.value = iso;
                } else {
                  // fallback: set raw serial as string
                  datesDateInputEl.value = String(raw);
                }
              } else {
                // No helper available: set raw value
                datesDateInputEl.value = String(raw);
              }
            } catch (e) {
              mltkLogger.warn("excelSerialToPlainDate conversion failed:", e);
              datesDateInputEl.value = String(raw);
            }
          } else {
            // Non-numeric: treat as text date
            datesDateInputEl.value = String(raw);
            if (/^\d{4}-\d{2}-\d{2}$/.test(datesDateInputEl.value)) {
              datesDatePickerEl.value = datesDateInputEl.value;
            }
          }
          break;
        }
        case "format": {
          if (val != null) datesFormatInputEl.value = String(val);
          break;
        }
        default:
          mltkLogger.warn("loadDataFromSelectedCell: unknown input:", input);
      }

      // After loading, refresh preview
      showDateFormats();
    });
  } catch (err) {
    mltkLogger.error("Error loading selected cell:", err);
    setMsg(`Load error: ${err.message || err}`);
  }
}

/* -------------------------
   Show date formats (renders table)
   ------------------------- */
function showDateFormats() {
  try {
    const tagRaw = (datesLocaleInputEl && datesLocaleInputEl.value) ? datesLocaleInputEl.value.trim() : "en-CA";
    const tag = tagRaw || "en-CA";
    const loc = (typeof window.normalizeLocaleCode === "function") ? window.normalizeLocaleCode(tag) : tag;

    if (typeof window.isValidLocale === "function" && !window.isValidLocale(loc)) {
      datesOutputEl.innerHTML = `<b>Locale Error:</b> ${loc}<br><br>Please enter a valid ISO locale in format (ss-SS).`;
      return;
    }

    const info = (typeof window.LocaleInfo === "function") ? window.LocaleInfo(tag) : { error: null };
    if (info && info.error) {
      datesOutputEl.innerHTML = `<b>Error:</b> ${info.error}<br><br>Please enter a valid ISO locale in format (ss-SS).`;
      return;
    }

    const dteRaw = (datesDateInputEl && datesDateInputEl.value) ? datesDateInputEl.value.trim() : "1987-07-25";

    // If the input is a numeric serial (defensive), try to convert here as well
    let dPlain = null;
    if (/^\d+(\.\d+)?$/.test(dteRaw)) {
      try {
        if (typeof window.excelSerialToPlainDate === "function") {
          const plain = window.excelSerialToPlainDate(Number(dteRaw));
          if (plain instanceof Temporal.PlainDate) dPlain = plain;
          else if (plain && plain.year && plain.month && plain.day) {
            dPlain = Temporal.PlainDate.from(`${plain.year}-${String(plain.month).padStart(2,"0")}-${String(plain.day).padStart(2,"0")}`);
          }
        }
      } catch (e) {
        // ignore and fall back to safeParseDate
        mltkLogger.warn("excelSerialToPlainDate in showDateFormats failed:", e);
      }
    }

    if (!dPlain) {
      const { error: dateError, date } = safeParseDate(dteRaw);
      if (dateError) {
        datesOutputEl.innerHTML = `<b>Date Error:</b> ${dateError}<br><br>Please enter a valid date in ISO format (YYYY-MM-DD).`;
        return;
      }
      dPlain = date;
    }

    const customFormat = (datesFormatInputEl && datesFormatInputEl.value) ? datesFormatInputEl.value : "Cddd, MMMM D*/oa, YYYY";

    // Format using your engine (wrap in try/catch)
    let shtDte = "", lngDte = "", fullDte = "", cstFmtDate = "";
    try {
      shtDte = window.formatDate ? window.formatDate(dPlain, tag, "short") : dPlain.toString();
      lngDte = window.formatDate ? window.formatDate(dPlain, tag, "long") : dPlain.toString();
      fullDte = window.formatDate ? window.formatDate(dPlain, tag, "full") : dPlain.toString();
    } catch (e) {
      mltkLogger.error("formatDate error:", e);
      datesOutputEl.innerHTML = `<b>Formatting Error:</b> ${e.message || e}`;
      return;
    }

    // Validate custom format by attempting to format; mark invalid if it throws
    let customError = null;
    try {
      cstFmtDate = window.formatDate ? window.formatDate(dPlain, tag, "custom", customFormat) : escapeHtml(customFormat);
      datesFormatInputEl && datesFormatInputEl.classList.remove("input-invalid");
    } catch (e) {
      customError = e.message || "Invalid custom format";
      cstFmtDate = `<span style="color:#d9534f">${escapeHtml(customError)}</span>`;
      datesFormatInputEl && datesFormatInputEl.classList.add("input-invalid");
    }

    // Example custom format examples (three examples + user's)
    const customFormatEx1 = "Cddd, MMMM D*/oa, YYYY";
    const customFormatEx2 = "YYYY-MM-DD";
    const customFormatEx3 = "dddd, MMM D, YYYY";

    let cstFmtEx1Date = "", cstFmtEx2Date = "", cstFmtEx3Date = "";
    try { cstFmtEx1Date = window.formatDate ? window.formatDate(dPlain, tag, "custom", customFormatEx1) : ""; } catch (e) { cstFmtEx1Date = `<span style="color:#d9534f">err</span>`; }
    try { cstFmtEx2Date = window.formatDate ? window.formatDate(dPlain, tag, "custom", customFormatEx2) : ""; } catch (e) { cstFmtEx2Date = `<span style="color:#d9534f">err</span>`; }
    try { cstFmtEx3Date = window.formatDate ? window.formatDate(dPlain, tag, "custom", customFormatEx3) : ""; } catch (e) { cstFmtEx3Date = `<span style="color:#d9534f">err</span>`; }

    // Build table HTML with narrow first column via colgroup
    const html = `
      <div><b>MLTK.FormatDate("${dPlain.toString()}", "${tag}", <em>type</em>, [<em>cstFormat</em>])</b></div>
      <table class="dates-table" aria-label="Date format examples">
        <colgroup>
          <col style="width: 90px;">
          <col style="width: 200px;">
          <col style="width: auto;">
        </colgroup>
        <thead>
          <tr>
            <th><em>Type</em></th>
            <th><em>cstFormat</em></th>
            <th>Returns</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>short</td>
            <td>—</td>
            <td>${escapeHtml(shtDte)}</td>
          </tr>
          <tr>
            <td>long</td>
            <td>—</td>
            <td>${escapeHtml(lngDte)}</td>
          </tr>
          <tr>
            <td>full</td>
            <td>—</td>
            <td>${escapeHtml(fullDte)}</td>
          </tr>
        <tr>
          <td>custom</td>
        </tr>
        <tr>
          <td> - Ex.1</td>
          <td>${escapeHtml(customFormatEx1)}</td>
          <td>${cstFmtEx1Date}</td>
        </tr>
        <tr>
          <td> - Ex.2</td>
          <td>${escapeHtml(customFormatEx2)}</td>
          <td>${cstFmtEx2Date}</td>
        </tr>
        <tr>
          <td> - Ex.3</td>
          <td>${escapeHtml(customFormatEx3)}</td>
          <td>${cstFmtEx3Date}</td>
        </tr>
        <tr>
          <td> - yours</td>
          <td>${escapeHtml(customFormat)}</td>
          <td>${cstFmtDate}</td>
        </tr>

        </tbody>
      </table>
    `;

    datesOutputEl.innerHTML = html;
  } catch (err) {
    mltkLogger.error("showDateFormats: unexpected error", err);
    datesOutputEl.innerHTML = `<b>Error:</b> ${escapeHtml(err.message || String(err))}`;
  }
}

/* -------------------------
   Copy custom format to clipboard
   ------------------------- */
function copyCustomFormatToClipboard() {
  const mask = datesFormatInputEl ? datesFormatInputEl.value : "";
  if (!mask) {
    setMsg("Nothing to copy.");
    return;
  }
  navigator.clipboard.writeText(mask).then(() => {
    setMsg("Format copied to clipboard.");
  }).catch((err) => {
    mltkLogger.warn("copy to clipboard failed", err);
    setMsg(`Copy failed: ${err.message || err}`);
  });
}

/* -------------------------
   Apply custom format to selection (Excel)
   ------------------------- */
async function applyCustomFormatToSelection() {
  const mask = datesFormatInputEl ? datesFormatInputEl.value : "";
  if (!mask) {
    setMsg("No custom format to apply.");
    return;
  }

  try {
    await Excel.run(async (ctx) => {
      const range = ctx.workbook.getSelectedRange();
      // numberFormatLocal expects an array or string depending on host; using string here as earlier
      range.numberFormatLocal = mask;
      await ctx.sync();
      setMsg("Format applied to selection.");
    });
  } catch (err) {
    mltkLogger.error("applyCustomFormatToSelection error:", err);
    setMsg(`Apply failed: ${err.message || err}`);
  }
}

/* -------------------------
   Labels (localization)
   ------------------------- */
function applyDatesTabLabels() {
  const L = (window.labels && window.labels.dates) ? window.labels.dates : {
    title: "Date Formats",
    locale: "Locale",
    load: "Load",
    date: "Date",
    format: "Format",
    show: "Show",
    apply: "Apply to Selection",
    copy: "Copy Format"
  };

  try {
    document.getElementById("dates-title").innerText = L.title;
    document.getElementById("dateslocaleLbl").innerText = L.locale;
    document.getElementById("datesLocaleLoadCellBtn").innerText = L.load;
    document.getElementById("datesDateLbl").innerText = L.date;
    document.getElementById("datesDateLoadCellBtn").innerText = L.load;
    document.getElementById("datesFormatLbl").innerText = L.format;
    document.getElementById("datesFormatLoadCellBtn").innerText = L.load;
    document.getElementById("datesCopyFormatBtn").innerText = L.copy;
    document.getElementById("datesApplyFormatBtn").innerText = L.apply;
  } catch (e) {
    mltkLogger.warn("applyDatesTabLabels: some label elements missing", e);
  }
}

/* -------------------------
   Initialization
   ------------------------- */
function initDatesTab() {
  mltkLogger.debug("initDatesTab: starting initialization");

  // Defensive element checks
  if (!datesLocaleInputEl || !datesDateInputEl || !datesDatePickerEl || !datesFormatInputEl || !datesTogglePickerBtnEl) {
    mltkLogger.error("initDatesTab: one or more required elements are missing", {
      datesLocaleInputEl: !!datesLocaleInputEl,
      datesDateInputEl: !!datesDateInputEl,
      datesDatePickerEl: !!datesDatePickerEl,
      datesFormatInputEl: !!datesFormatInputEl,
      datesTogglePickerBtnEl: !!datesTogglePickerBtnEl
    });
    // continue where possible
  }

  // Ensure base classes to avoid FOUC
  datesDateInputEl && datesDateInputEl.classList.add("datesTextVisible");
  datesDatePickerEl && datesDatePickerEl.classList.add("datesDatePickNone");

  // Attach handlers (use addEventListener to avoid accidental overwrites)
  datesLocaleLoadCellBtnEl && datesLocaleLoadCellBtnEl.addEventListener("click", () => loadDataFromSelectedCell("locale"));
  datesDateLoadCellBtnEl && datesDateLoadCellBtnEl.addEventListener("click", () => loadDataFromSelectedCell("date"));
  datesFormatLoadCellBtnEl && datesFormatLoadCellBtnEl.addEventListener("click", () => loadDataFromSelectedCell("format"));

  datesCopyFormatBtnEl && datesCopyFormatBtnEl.addEventListener("click", copyCustomFormatToClipboard);
  datesApplyFormatBtnEl && datesApplyFormatBtnEl.addEventListener("click", applyCustomFormatToSelection);

  datesShowResultBtnEl && datesShowResultBtnEl.addEventListener("click", showDateFormats);

  // Attach toggle handler defensively (do not attach multiple times)
  if (datesTogglePickerBtnEl && !datesTogglePickerBtnEl.__toggleAttached) {
    datesTogglePickerBtnEl.addEventListener("click", toggleDatePicker);
    datesTogglePickerBtnEl.__toggleAttached = true;
    mltkLogger.debug("initDatesTab: toggle handler attached");
  }

  // Enter key triggers
  datesLocaleInputEl && datesLocaleInputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); showDateFormats(); }});
  datesDateInputEl && datesDateInputEl.addEventListener("keydown",   (ev) => { if (ev.key === "Enter") { ev.preventDefault(); showDateFormats(); }});
  datesFormatInputEl && datesFormatInputEl.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); showDateFormats(); }});

  // Sync date picker -> text input
  datesDatePickerEl && datesDatePickerEl.addEventListener("change", () => {
    if (datesDatePickerEl.value) {
      datesDateInputEl.value = datesDatePickerEl.value;
      showDateFormats();
    }
  });

  // Read stored preference (default false)
  let usePicker = false;
  try {
    const v = localStorage.getItem(DATEPREF_KEY);
    if (v === "1") usePicker = true;
    mltkLogger.debug(`initDatesTab: loaded preference ${DATEPREF_KEY}=${v}`);
  } catch (e) {
    mltkLogger.warn("initDatesTab: localStorage read failed", e);
  }

  // Apply preference and sync values
  applyDatePickerPreference(usePicker);
  if (usePicker && /^\d{4}-\d{2}-\d{2}$/.test(datesDateInputEl.value)) {
    datesDatePickerEl.value = datesDateInputEl.value;
  }

  // Labels and initial render
  applyDatesTabLabels();
  showDateFormats();

  mltkLogger.debug("initDatesTab: finished initialization");
}

/* -------------------------
   Auto-init on DOM ready
   ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  try {
    initDatesTab();
  } catch (e) {
    mltkLogger.error("Dates tab initialization failed:", e);
  }
});
 
// 1) Confirm origin (must match the Application panel origin)
mltkLogger.debug('origin:', location.origin);

// 2) Direct read from localStorage
mltkLogger.debug('localStorage.getItem("mltk.useDatePicker") =', localStorage.getItem('mltk.useDatePicker'));

// 3) List any matching keys (fast scan)
for (let i=0;i<localStorage.length;i++){
  const k = localStorage.key(i);
  if (k && k.indexOf('mltk') !== -1) mltkLogger.debug('LS key:', k, localStorage.getItem(k));
}

// 4) If OfficeRuntime.storage exists, read it too (async)
(async () => {
  if (typeof OfficeRuntime !== 'undefined' && OfficeRuntime.storage && typeof OfficeRuntime.storage.getItem === 'function') {
    try {
      const v = await OfficeRuntime.storage.getItem('mltk.useDatePicker');
      mltkLogger.debug('OfficeRuntime.storage.getItem("mltk.useDatePicker") =', v);
    } catch (e) {
      mltkLogger.warn('OfficeRuntime.storage.getItem threw', e);
    }
  } else {
    mltkLogger.debug('OfficeRuntime.storage not available or has different API shape.');
  }
})();
