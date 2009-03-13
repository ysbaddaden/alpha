/**
 * Core JavaScript backward compatibility.
 * Mostly emulates DOM prototypes in MSIE < 8.
 *
 * TODO: What about memory leaks in IE8?
 */

var misago = {};

// browser sniffing (might come handy)
misago.browser = {};
(function()
{
  var ua = navigator.userAgent.toLowerCase();
  misago.browser.ie    = (window.VBArray) ? true : false;
  misago.browser.ie6   = (misago.browser.ie && document.implementation) ? true : false;
  misago.browser.ie7   = (misago.browser.ie && window.XMLHttpRequest) ? true : false;
  misago.browser.ie7   = (misago.browser.ie && Element && Element.prototype) ? true : false;
  misago.browser.opera = (window.opera) ? true : false;
  misago.browser.gecko = (window.netscape && !misago.browser.opera) ? true : false;
  misago.browser.khtml = (ua.indexOf("safari") + 1 || ua.indexOf("konqueror") + 1) ? true : false;
})();

// The following tries to fix MSIE < 8.
if (typeof Element == "undefined")
{
  // Garbage Collector, to prevent memory leaks
  misago.garbage = [];
  window.attachEvent('onunload', function()
  {
    for (var i=0, len=misago.garbage.length; i<len; i++)
    {
      var element = misago.garbage[i];
      if (element)
      {
        /*
        // FIXME: Calling elm.clearAttributes() on unload crashes IE7?!
        if (element.clearAttributes) {
          element.clearAttributes();
        }
        */
        if (element.clearEvents) {
          element.clearEvents();
        }
      }
      delete misago.garbage[i];
    }
  });

  // Generic Object prototype emulator
  misago.prototypeEmulator = function()
  {
    var Obj       = {};
    Obj.prototype = {};

    Obj._misago_extend = function(o)
    {
      if (!o._misago_extended)
      {
        misago.garbage.push(o);

        for (var method in Obj.prototype)
        {
          // saves the original method
          if (o[method] && !o['_misago_' + method]) {
            o['_misago_' + method] = o[method];
          }
          
          // creates (or overwrites) the method
          o[method] = Obj.prototype[method];
        }
        o._misago_extended = true;
      }
      return o;
    }
    return Obj;
  }

  // Emulates the DOM Element prototype
  var Element = new misago.prototypeEmulator();

  // Manually extends an element
  misago.extendElement = function(elm) {
    return Element._misago_extend(elm);
  }

  // Manually extends many elements
  misago.extendElements = function(elms)
  {
    var rs = [];
    for (var i=0, len=elms.length; i<len; i++) {
      rs.push(misago.extendElement(elms[i]));
    }
    rs.item = function(i) {
      return this[i];
    }
    return rs;
  }

  // document.createElement should return an already extended element
  misago._msie_createElement = document.createElement;
  document.createElement = function(tagName)
  {
    var elm = misago._msie_createElement(tagName);
    return misago.extendElement(elm);
  }

  // document.getElementById should return an extended element
  misago._msie_getElementById = document.getElementById;
  document.getElementById = function(id)
  {
    var elm = misago._msie_getElementById(id);
    return elm ? misago.extendElement(elm) : elm;
  }

  // document.getElementsByName should return extended elements
  misago._msie_getElementsByName = document.getElementsByName;
  document.getElementsByName = function(id)
  {
    var elms = misago._msie_getElementsByName(id);
    return elms.length ? misago.extendElements(elms) : elms;
  }

  // document.getElementsByTagName should return extended elements
  misago._msie_getElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(id)
  {
    var elms = misago._msie_getElementsByTagName(id);
    return elms.length ? misago.extendElements(elms) : elms;
  }

  // elm.getElementsByTagName should return extended elements
  Element.prototype.getElementsByTagName = function(id)
  {
    var elms = this._misago_getElementsByTagName(id);
    return elms.length ? misago.extendElements(elms) : elms;
  }

  // fixes a pseudo-leak in MSIE
  Element.prototype.removeChild = function(child)
  {
    var garbage = document.getElementById('_misago_msie_leak_garbage');
    if (!garbage)
    {
        garbage = document.createElement('div');
        garbage.id = '_misago_msie_leak_garbage';
        garbage.style.display    = 'none';
        garbage.style.visibility = 'hidden';
        document.body.appendChild(garbage);
    }
    
    // removes the child
    this._misago_removeChild(child);
    
    // destroys the reference
    garbage.appendChild(child);
    garbage.innerHTML = '';
  }
}

// Shortcut for document.getElementById and element extender for MSIE < 8.
misago.$ = function(element)
{
  if (typeof element == "string") {
    element = document.getElementById(element)
  }
  if (misago.extendElement) {
    element = misago.extendElement(element);
  }
  return element;
}

// Shortcut: $ => misago.$
if (typeof window.$ == "undefined") {
  window.$ = misago.$;
}

