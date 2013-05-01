// Mine a string for require calls and export the module names
// Extract all require calls using a proper state-machine parser.
module.exports = function mine(js) {
  var names = [];
  var state = 0;
  var ident;
  var quote;
  var name;
  var states = [
    // 0 - START
    function (char) {
      if (char === "/") state = 6;
      else if (char === "'" || char === '"') {
        quote = char;
        state = 4;
      }
      else if (char === "r") {
        ident = char;
        state = 1;
      }
    },
    // 1 - IDENT
    function (char) {
      if (char === "require"[ident.length]) {
        ident += char;
      }
      else if (char === "(" && ident === "require") {
        ident = undefined;
        state = 2;
      }
      else {
        state = 0;
      }
    },
    // 2 - CALL
    function (char) {
      if (char === "'" || char === '"') {
        quote = char;
        name = "";
        state = 3;
      }
      else {
        state = 0;
      }
    },
    // 3 - NAME
    function (char) {
      if (char === quote) {
        names.push(name);
        name = undefined;
        state = 0;
      }
      else {
        name += char;
      }
    },
    // 4 - STRING
    function (char) {
      if (char === "\\") {
        state = 5;
      }
      else if (char === quote) {
        state = 0;
      }
    },
    // 5 - ESCAPE
    function (char) {
      state = 4;
    },
    // 6 - SLASH
    function (char) {
      if (char === "/") state = 7;
      else if (char === "*") state = 8;
      else state = 0;
    },
    // 7 - LINE_COMMENT
    function (char) {
      if (char === "\r" || char === "\n") state = 0;
    },
    // 8 - MULTILINE_COMMENT
    function (char) {
      if (char === "*") state = 9;
    },
    // 9 - MULTILINE_ENDING
    function (char) {
      if (char === "/") state = 0;
      else if (char !== "*") state = 8;
    }
  ];
  for (var i = 0, l = js.length; i < l; i++) {
    states[state](js[i]);
  }
  return names;
}
