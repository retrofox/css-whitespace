/**
 * Module dependencies.
 */

var scan = require('./lexer');

/**
 * Parse the given `str`, returning an AST.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

module.exports = function(str) {
  var toks = scan(str);

  return stmts();

  /**
   * Grab the next token.
   */

  function next() {
    return toks.shift();
  }

  /**
   * Check if the next token is `type`.
   */

  function is(type) {
    if (type == toks[0][0]) return true;
  }

  /**
   * Expect `type` or throw.
   */

  function expect(type) {
    if (is(type)) return next();
    throw new Error('expected "' + type + '", but got "' + toks[0][0] + '"');
  }

  /**
   * stmt+
   */

  function stmts() {
    var stmts = [];
    while (!is('eos')) stmts.push(stmt());
    return ['root', stmts];
  }

  /**
   * INDENT stmt+ OUTDENT
   */

  function block() {
    var props = [];
    expect('indent');
    while (!is('outdent')) props.push(prop());
    expect('outdent');
    return ['block', props];
  }

  /**
   * prop
   */

  function prop() {
    return ['prop', next()[1]];
  }

  /**
   * rule
   */

  function stmt() {
    if (is('rule')) return rule();
  }

  /**
   * rule block
   */

  function rule() {
    var rule = next();
    rule.push(block());
    return rule;
  }
}