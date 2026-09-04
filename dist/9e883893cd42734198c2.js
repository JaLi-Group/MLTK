function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// safe logger reference (place at top of files that use mltkLogger)
if (typeof window.mltkLogger === "undefined") {
  window.mltkLogger = {
    log: function log() {},
    debug: function debug() {},
    info: function info() {},
    warn: function warn() {
      var _console;
      (_console = console).warn.apply(_console, arguments);
    },
    error: function error() {
      var _console2;
      (_console2 = console).error.apply(_console2, arguments);
    }
  };
}
import { GetLocaleInfo, LocaleInfo } from "mltk-core";
import { formatDate, normalizeLocaleCode, formatNumber, isValidLocale, excelSerialToPlainDate } from "mltk-core";

// 1) Is Temporal already present?
mltkLogger.debug('Temporal on global?', typeof globalThis.Temporal !== 'undefined');
mltkLogger.debug('GetLocaleInfo?', typeof GetLocaleInfo !== 'undefined');
mltkLogger.debug('LocaleInfo?', typeof LocaleInfo !== 'undefined');

// Exposes the mltk-core LocaleInfo() and GetLocaleInfo() to the entire project scope
// by attaching them to the window object.
// window.LocaleInfo(tag) returns an array with selected pieces of information about the locale 'tag' such as "languageCode" and "countryName"
window.LocaleInfo = LocaleInfo;
// window.GetLocaleInfo(tag, field) returns information about the locale (tag)
window.GetLocaleInfo = GetLocaleInfo;

// Exposes the mltk-core formatDate(), normalizeLocaleCode() and formatNumber() functions to the entire project scope
// by attaching them to the window object.
window.formatDate = formatDate;
window.formatNumber = formatNumber;
window.normalizeLocaleCode = normalizeLocaleCode;
window.isValidLocale = isValidLocale;
window.excelSerialToPlainDate = excelSerialToPlainDate;
Office.onReady(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        setupMenuBar();
        // setupTabs();
        _context.n = 1;
        return loadLocalizationSystem();
      case 1:
        _context.n = 2;
        return loadTabContent();
      case 2:
        return _context.a(2);
    }
  }, _callee);
})));
document.addEventListener("DOMContentLoaded", function () {
  var dropdowns = document.querySelectorAll(".dropdown");
  mltkLogger.debug("dropdowns: ".concat(dropdowns));
  dropdowns.forEach(function (drop) {
    drop.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent closing immediately
      closeAllDropdowns(drop); // Close others
      drop.classList.toggle("open");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function () {
    closeAllDropdowns();
  });
});
function closeAllDropdowns() {
  var except = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  document.querySelectorAll(".dropdown").forEach(function (drop) {
    if (drop !== except) {
      drop.classList.remove("open");
      mltkLogger.debug("Closed dropdown named: ".concat(drop.id));
    }
    ;
  });
}
function setupMenuBar() {
  document.getElementById("menuHome").addEventListener("click", function () {
    return showTab("home");
  });
  document.getElementById("menuLocale").addEventListener("click", function () {
    return showTab("locale");
  });
  document.getElementById("menuMerge").addEventListener("click", function () {
    return showTab("merge");
  });
  document.getElementById("menuDates").addEventListener("click", function () {
    return showTab("dates");
  });
  document.getElementById("menuNumbers").addEventListener("click", function () {
    return showTab("numbers");
  });
  document.getElementById("menuSettings").addEventListener("click", function () {
    return showTab("settings");
  });
  document.getElementById("menuHelp").addEventListener("click", function () {
    return showTab("help");
  });
  loadDefaultTab();
}

/* ---------------------------
   Menu SYSTEM
---------------------------- */

function showTab(tab) {
  document.querySelectorAll(".tab-panel").forEach(function (p) {
    return p.style.display = "none";
  }); // Hide all panels
  document.getElementById("tab-" + tab).style.display = "block"; // Show selected panel
}
function loadDefaultTab() {
  showTab("home");
}

/* ---------------------------
   LOCALIZATION SYSTEM
---------------------------- */

var labels = {};
function loadLocalizationSystem() {
  return _loadLocalizationSystem.apply(this, arguments);
} // Later we will add a Settings tab to choose UI language
// For now: detect from browser or default to English
function _loadLocalizationSystem() {
  _loadLocalizationSystem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var uiLang;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return loadLabels("en");
        case 1:
          window.labels_en = _context2.v;
          _context2.n = 2;
          return loadLabels("fr");
        case 2:
          window.labels_fr = _context2.v;
          _context2.n = 3;
          return loadLabels("es");
        case 3:
          window.labels_es = _context2.v;
          // ?????????????????????????????????????????????????????????????????????????????????????????????
          // Use the UI language for general UI labels
          // 1. Get the UI language
          uiLang = detectUILanguage(); // Returns 'en', 'fr' or 'es' for now
          // 2. Assign the proper language to the labels  object
          labels = uiLang === "fr" ? window.labels_fr : uiLang === "es" ? window.labels_es : window.labels_en;
          // 3. Attach the labels object to the window object so they are available across the entire project
          window.labels = labels;

          // Finally, apply the label to each UI control label
          applyLabelsToUI();
        case 4:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return _loadLocalizationSystem.apply(this, arguments);
}
function detectUILanguage() {
  var browserLang = navigator.language || "en";
  if (browserLang.startsWith("fr")) return "fr";
  return "en";
  // return "fr";
  // return "es";
}
function loadLabels(_x) {
  return _loadLabels.apply(this, arguments);
}
function _loadLabels() {
  _loadLabels = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(lang) {
    var response;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return fetch("i18n/".concat(lang, ".json"));
        case 1:
          response = _context3.v;
          console.log(response);
          _context3.n = 2;
          return response.json();
        case 2:
          return _context3.a(2, _context3.v);
      }
    }, _callee3);
  }));
  return _loadLabels.apply(this, arguments);
}
function applyLabelsToUI() {
  document.getElementById("menuHome").innerText = labels.ui.tabs.home;
  document.getElementById("menuLocale").innerText = labels.ui.tabs.locale;
  document.getElementById("menuMerge").innerText = labels.ui.tabs.merge;
  document.getElementById("menuDates").innerText = labels.ui.tabs.dates;
  document.getElementById("menuNumbers").innerText = labels.ui.tabs.numbers;
  document.getElementById("menuSettings").innerText = labels.ui.tabs.settings;
  document.getElementById("menuHelp").innerText = labels.ui.tabs.help;
}

/* ---------------------------
   LOAD TAB CONTENT
---------------------------- */

// Load every tab
// - Put the whole xx html file into the div element id tab-nn of the taskpane.html file where
//      xx is the second parameter, and
//      nn is the first parameter
// - Attach the script file to the window object and execute it
//  ********* JP:  Change to a loop once all done!!!!   ****************
function loadTabContent() {
  return _loadTabContent.apply(this, arguments);
}
function _loadTabContent() {
  _loadTabContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return loadContentIntoTab("home", "taskpane/tabs/home.html");
        case 1:
          loadScriptIntoTab("taskpane/tabs/home.js");
          // If initHomeTab() is found (exists) in the entire project, then wait .50ms and attach it to the
          // window object so it can be accessed from anywhere in the project and execute it
          setTimeout(function () {
            if (window.initHomeTab) window.initHomeTab();
          }, 50);

          // locale tab
          _context4.n = 2;
          return loadContentIntoTab("locale", "taskpane/tabs/locale.html");
        case 2:
          // await loadScriptIntoTab("taskpane/tabs/locale.js");
          loadScriptIntoTab("taskpane/tabs/locale.js");
          // If initLocaleTab() is found (exists) in the entire project, then wait .50ms and attach it to the
          // window object so it can be access from anywhere in the project and execute it
          setTimeout(function () {
            if (window.initLocaleTab) window.initLocaleTab();
          }, 50);

          // merge tab
          _context4.n = 3;
          return loadContentIntoTab("merge", "taskpane/tabs/merge.html");
        case 3:
          // await loadScriptIntoTab("taskpane/tabs/merge.js");
          loadScriptIntoTab("taskpane/tabs/merge.js");
          // Initialize AFTER HTML + JS are loaded
          setTimeout(function () {
            if (window.initMergeTab) window.initMergeTab();
          }, 50);

          // Dates tab
          _context4.n = 4;
          return loadContentIntoTab("dates", "taskpane/tabs/dates.html");
        case 4:
          // await loadScriptIntoTab("taskpane/tabs/dates.js");
          loadScriptIntoTab("taskpane/tabs/dates.js");
          setTimeout(function () {
            if (window.initDatesTab) window.initDatesTab();
          }, 50);

          // Numbers tab
          _context4.n = 5;
          return loadContentIntoTab("numbers", "taskpane/tabs/numbers.html");
        case 5:
          // await loadScriptIntoTab("taskpane/tabs/numbers.js");
          loadScriptIntoTab("taskpane/tabs/numbers.js");
          setTimeout(function () {
            if (window.initNumbersTab) window.initNumbersTab();
          }, 50);

          // settings tab
          _context4.n = 6;
          return loadContentIntoTab("settings", "taskpane/tabs/settings.html");
        case 6:
          loadScriptIntoTab("taskpane/tabs/settings.js");
          setTimeout(function () {
            if (window.initSettingsTab) window.initSettingsTab();
          }, 50);

          // help tab
          _context4.n = 7;
          return loadContentIntoTab("help", "taskpane/tabs/help.html");
        case 7:
          loadScriptIntoTab("taskpane/tabs/help.js");
          setTimeout(function () {
            if (window.initHelpTab) window.initHelpTab();
          }, 50);
        case 8:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _loadTabContent.apply(this, arguments);
}
function loadContentIntoTab(_x2, _x3) {
  return _loadContentIntoTab.apply(this, arguments);
}
function _loadContentIntoTab() {
  _loadContentIntoTab = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(tabName, filePath) {
    var response, html;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return fetch(filePath);
        case 1:
          response = _context5.v;
          _context5.n = 2;
          return response.text();
        case 2:
          html = _context5.v;
          document.getElementById("tab-" + tabName).innerHTML = html;
        case 3:
          return _context5.a(2);
      }
    }, _callee5);
  }));
  return _loadContentIntoTab.apply(this, arguments);
}
function loadScriptIntoTab(path) {
  var script = document.createElement("script");
  script.src = path;
  document.body.appendChild(script);
}