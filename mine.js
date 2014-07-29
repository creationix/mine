"use strict";

// Mine a string for require calls and export the module names
// Extract all require calls using a proper state-machine parser.
module.exports = mine;
function mine(js) {
  js = "" + js;

  var l = js.length;
  var i;
  var names = [];
  var state;
  var ident;
  var quote;
  var name;
  var start;
  var regexBacktrack;

  var isIdent = /[a-z0-9_.$]/i;
  var isWhitespace = /[ \r\n\t]/;
  function isNewLine(char) {
    return char === "\r" || char === "\n";
  }
  function isEOF() {
    return i == (l - 1);
  }

  function $start(char) {
    if (char === "/") {
      return $slash;
    }
    if (char === "'" || char === '"') {
      quote = char;
      return $string;
    }
    if (char === "#") {
      return $hash;
    }
    if (isIdent.test(char)) {
      ident = char;
      return $ident;
    }
    return $start;
  }

  function $ident(char) {
    if (isIdent.test(char)) {
      ident += char;
      return $ident;
    }
    return $identEnd(char);
  }

  function $identEnd(char) {
    if (char === "(" && ident === "require") {
      ident = undefined;
      return $call;
    }

    if (isWhitespace.test(char)) {
        return $identEnd;
    }

    return $start(char);
  }

  function $call(char) {
    if (isWhitespace.test(char)) return $call;
    if (char === "'" || char === '"') {
      quote = char;
      name = "";
      start = i + 1;
      return $name;
    }
    return $start(char);
  }

  function $name(char) {
    if (char === quote) {
      return $close;
    }
    if (char === "\\") {
      return $nameEscape;
    }
    name += char;
    return $name;
  }

  function $nameEscape(char) {
    if (char === "\\") {
      name += char;
    } else {
      name += JSON.parse('"\\' + char + '"');
    }
    return $name;
  }

  function $close(char) {
    if (isWhitespace.test(char)) return $close;
    if (char === ")" || char === ',') {
      names.push({
        name: name,
        offset: start
      });
    }
    name = undefined;
    return $start(char);
  }

  function $string(char) {
    if (char === "\\") {
      return $escape;
    }
    if (char === quote) {
      return $start;
    }
    return $string;
  }

  function $escape() {
    return $string;
  }

  function $slash(char) {
    if (char === "/") return $lineComment;
    if (char === "*") return $multilineComment;
    regexBacktrack = i;
    return $regex(char);
  }

  function $lineComment(char) {
    if (isNewLine(char)) return $start;
    return $lineComment;
  }

  function $multilineComment(char) {
    if (char === "*") return $multilineEnding;
    return $multilineComment;
  }

  function $multilineEnding(char) {
    if (char === "/") return $start;
    if (char === "*") return $multilineEnding;
    return $multilineComment;
  }

  function $regex(char) {
    if (char === "\\") {
      return $regexEscape;
    }
    if (char === "/") {
      regexBacktrack = null;
      return $start;
    }
    if (isNewLine(char) || isEOF()) {
      // This isn't a regex, must have been division!
      // backtrack and pretend we knew that.
      i = regexBacktrack - 1;
      return $start;
    }

    return $regex;
  }

  function $regexEscape() {
    return $regex;
  }

  function $hash(char) {
    if (char === '!') {
      // technically shebang, but equivalent for JS
      return $lineComment
    }
    return $start;
  }

  state = $start;
  for (i = 0; i < l; i++) {
    state = state(js[i]);
  }
  return names;
}
