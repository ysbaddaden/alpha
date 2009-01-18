/**
 * (Tries to) emulate DOM Prototypes in Internet Explorer.
 *
 * requires: compat/array.js
 */

var compat = {};

if (Element)
{
  // compliant browsers

  // shortcut to getElementById
  compat.$ = function(element)
  {
    if (typeof element == 'string') {
      return document.getElementById(element);
    }
    return element;
  }
}
else
{
  // browsers without support for DOM prototypes (ie. MSIE 6 & 7)
  var Element = function() {};

  // backups some core methods
  compat._MSIE_getElementById       = document.getElementById;
  compat._MSIE_getElementsByTagName = document.getElementsByTagName;

  // garbage collector, in order to prevent memory leaks
  compat.garbage = [window, document.body];
  compat.garbageCollector = function()
  {
    for (var i=0, len=compat.garbage.length; i<len; i++)
    {
      var element = this.garbage[i];

      if (element.clearAttributes) {
        element.clearAttributes();
      }

      if (element.clearEvents) {
        element.clearEvents();
      }

      delete element;
      delete this.garbage[i];
    }

    delete compat.garbage;
  }

  // extends DOM elements
  compat.$ = function(element)
  {
    if (typeof element == 'string') {
      element = compat._MSIE_getElementById(element);
    }

    if (element.$extended) {
      return element;
    }

    for (var method in Element.prototype)
    {
      if (!element[method]) {
        element[method] = Element.prototype[method];
      }
    }

    element.$extended = true;
    return element;
  }

  // fixes core methods to auto-extend elements
  document.getElementById       = compat.$;
  document.getElementsByTagName = function(tagName)
  {
    var search   = compat._MSIE_getElementsByTagName.call(this, tagName);
    var elements = new NodeList();
    Array.prototype.forEach.call(search, function(element)
    {
      element = compat.$(element);
      Array.prototype.push.call(elements, element);
    });
    return elements;
  }

  Element.prototype.getElementsByTagName = document.getElementsByTagName;
}

if (!window.$) {
  window.$ = compat.$;
}
