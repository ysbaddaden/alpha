/**
 * Core JavaScript backward compatibility.
 */

var Alpha = {};

// Browser sniffing (might come handy)
Alpha.browser = {};
(function()
{
  var ua = navigator.userAgent.toLowerCase();
  Alpha.browser.ie    = (window.VBArray) ? true : false;
  Alpha.browser.ie6   = (Alpha.browser.ie && document.implementation) ? true : false;
  Alpha.browser.ie7   = (Alpha.browser.ie && window.XMLHttpRequest) ? true : false;
//  Alpha.browser.ie8   = (Alpha.browser.ie && Element && Element.prototype) ? true : false;
  Alpha.browser.opera = (window.opera) ? true : false;
  Alpha.browser.gecko = (window.netscape && !Alpha.browser.opera) ? true : false;
  Alpha.browser.khtml = (ua.indexOf("safari") + 1 || ua.indexOf("konqueror") + 1) ? true : false;
})();


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

// Shortcut for document.getElementById and element extender for MSIE < 8.
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

