/**
 * Core JavaScript backward compatibility.
 */

var kokone = {};

// Browser sniffing (might come handy)
kokone.browser = {};
(function()
{
  var ua = navigator.userAgent.toLowerCase();
  kokone.browser.ie    = (window.VBArray) ? true : false;
  kokone.browser.ie6   = (kokone.browser.ie && document.implementation) ? true : false;
  kokone.browser.ie7   = (kokone.browser.ie && window.XMLHttpRequest) ? true : false;
//  kokone.browser.ie8   = (kokone.browser.ie && Element && Element.prototype) ? true : false;
  kokone.browser.opera = (window.opera) ? true : false;
  kokone.browser.gecko = (window.netscape && !kokone.browser.opera) ? true : false;
  kokone.browser.khtml = (ua.indexOf("safari") + 1 || ua.indexOf("konqueror") + 1) ? true : false;
})();


// NodeList emulator
kokone.NodeList = function(nodes)
{
  for(var i=0, len=nodes.length; i<len; i++) {
    this[i] = nodes[i];
  }
  this.length = nodes.length;
}
kokone.NodeList.prototype.item = function(i) {
  return this[i];
}

// Shortcut for document.getElementById and element extender for MSIE < 8.
kokone.$ = function(element)
{
  if (typeof element == "string") {
    element = document.getElementById(element)
  }
  else if (kokone.extendElement) {
    element = kokone.extendElement(element);
  }
  return element;
}

// Shortcut: $ => kokone.$
if (typeof window.$ == "undefined") {
  window.$ = kokone.$;
}

