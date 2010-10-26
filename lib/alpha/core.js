/**
 * Core JavaScript backward compatibility.
 */

var Alpha = {};

// Internet Explorer browser sniffing (comes handy sometimes).
Alpha.browser = {
  ie:  !!(window.VBArray),
  ie6: !!(window.VBArray && document.implementation)
};

// NodeList emulator
Alpha.NodeList = function(nodes)
{
  for(var i=0, len=nodes.length; i<len; i++) {
    this[i] = nodes[i];
  }
  this.length = nodes.length;
}
Alpha.NodeList.prototype.item = function(i) {
  return this[i];
}

// Shortcut for document.getElementById, and element extender for MSIE < 8.
Alpha.$ = function(element)
{
  if (typeof element == "string") {
    element = document.getElementById(element)
  }
  else if (Alpha.extendElement) {
    element = Alpha.extendElement(element);
  }
  return element;
}

// Shortcut: $ => Alpha.$
if (typeof window.$ == "undefined") {
  window.$ = Alpha.$;
}

