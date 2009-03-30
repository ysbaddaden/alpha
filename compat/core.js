/**
 * Core JavaScript backward compatibility.
 */

var misago = {};

// Browser sniffing (might come handy)
misago.browser = {};
(function()
{
  var ua = navigator.userAgent.toLowerCase();
  misago.browser.ie    = (window.VBArray) ? true : false;
  misago.browser.ie6   = (misago.browser.ie && document.implementation) ? true : false;
  misago.browser.ie7   = (misago.browser.ie && window.XMLHttpRequest) ? true : false;
//  misago.browser.ie8   = (misago.browser.ie && Element && Element.prototype) ? true : false;
  misago.browser.opera = (window.opera) ? true : false;
  misago.browser.gecko = (window.netscape && !misago.browser.opera) ? true : false;
  misago.browser.khtml = (ua.indexOf("safari") + 1 || ua.indexOf("konqueror") + 1) ? true : false;
})();


// NodeList emulator
misago.NodeList = function(nodes)
{
  for(var i=0, len=nodes.length; i<len; i++) {
    this[i] = nodes[i];
  }
  this.length = nodes.length;
}
misago.NodeList.prototype.item = function(i) {
  return this[i];
}

// Shortcut for document.getElementById and element extender for MSIE < 8.
misago.$ = function(element)
{
  if (typeof element == "string") {
    element = document.getElementById(element)
  }
  else if (misago.extendElement) {
    element = misago.extendElement(element);
  }
  return element;
}

// Shortcut: $ => misago.$
if (typeof window.$ == "undefined") {
  window.$ = misago.$;
}

