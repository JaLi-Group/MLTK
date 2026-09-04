// logger.js
// Toggle verbose logs by setting localStorage key "mltk.debug" = "1"
// Optionally set level with localStorage key "mltk.logLevel" = "debug|info|warn|error|silent"

(function (global) {
  var DEBUG_KEY = "mltk.debug";
  var LEVEL_KEY = "mltk.logLevel";
  var LEVELS = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 99
  };
  function readLevel() {
    try {
      var lvl = localStorage.getItem(LEVEL_KEY);
      if (lvl && LEVELS[lvl] !== undefined) return lvl;
    } catch (e) {/* ignore */}
    // fallback to boolean debug flag for backward compatibility
    try {
      if (localStorage.getItem(DEBUG_KEY) === "1") return "debug";
    } catch (e) {/* ignore */}
    return "warn"; // default level in production
  }
  var currentLevel = readLevel();
  function enabledFor(level) {
    return LEVELS[level] >= LEVELS[currentLevel];
  }
  function safeConsole(method, args) {
    try {
      if (console && typeof console[method] === "function") {
        console[method].apply(console, args);
      } else if (console && typeof console.log === "function") {
        console.log.apply(console, args);
      }
    } catch (e) {
      // swallow console errors
    }
  }
  var logger = {
    level: function level() {
      return currentLevel;
    },
    setLevel: function setLevel(lvl) {
      if (LEVELS[lvl] === undefined) return false;
      currentLevel = lvl;
      try {
        localStorage.setItem(LEVEL_KEY, lvl);
      } catch (e) {/* ignore */}
      return true;
    },
    enableDebug: function enableDebug() {
      this.setLevel("debug");
    },
    disableDebug: function disableDebug() {
      this.setLevel("warn");
    },
    log: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (enabledFor("debug")) safeConsole("log", ["[mltk]"].concat(args));
    },
    // use console.log for debug so messages are visible even if console.debug is filtered
    debug: function debug() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      if (enabledFor("debug")) safeConsole("log", ["[mltk][debug]"].concat(args));
    },
    info: function info() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      if (enabledFor("info")) safeConsole("info", ["[mltk][info]"].concat(args));
    },
    warn: function warn() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      if (enabledFor("warn")) safeConsole("warn", ["[mltk][warn]"].concat(args));
    },
    error: function error() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      if (enabledFor("error")) safeConsole("error", ["[mltk][error]"].concat(args));
    }
  };

  // Expose globally
  global.mltkLogger = logger;

  // Also support ES module import if environment supports exports (optional)
  try {
    if (typeof module !== "undefined" && module.exports) {
      module.exports = logger;
    }
  } catch (e) {/* ignore in browser */}
})(window);