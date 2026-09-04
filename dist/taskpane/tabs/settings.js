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




// settings.js
const toggle = document.getElementById("mltk-debug-toggle");
// initialize control from storage
toggle.checked = localStorage.getItem("mltk.logLevel") === "debug";
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    localStorage.setItem("mltk.logLevel", "debug");
    if (window.mltkLogger) mltkLogger.setLevel("debug");
  } else {
    localStorage.setItem("mltk.logLevel", "warn");
    if (window.mltkLogger) mltkLogger.setLevel("warn");
  }
  // optional: show a small message that setting took effect
});
