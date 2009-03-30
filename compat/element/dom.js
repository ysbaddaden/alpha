/**
 * Tries to emulate the DOM Element prototype in MSIE < 8.
 */

// The following tries to fix the DOM Element in MSIE < 8.
if (typeof Element == 'undefined')
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
        // FIXME: Calling elm.clearAttributes() on unload crashes IE7?!
//        if (element.clearAttributes) {
//          element.clearAttributes();
//        }
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
      if (/*typeof o == 'object' &&*/ !o._misago_extended)
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
  // NOTE: we do not declare 'var Element', because it causes a bug with IE8,
  // where Element is suddenly undefined for the script.
  Element = new misago.prototypeEmulator();

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
    return elms.length ? new misago.NodeList(misago.extendElements(elms)) : elms;
  }

  // document.getElementsByTagName should return extended elements
  misago._msie_getElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(id)
  {
    var elms = misago._msie_getElementsByTagName(id);
    return elms.length ? new misago.NodeList(misago.extendElements(elms)) : elms;
  }

  // elm.getElementsByTagName should return extended elements
  Element.prototype.getElementsByTagName = function(id)
  {
    var elms = this._misago_getElementsByTagName(id);
    return elms.length ? new misago.NodeList(misago.extendElements(elms)) : elms;
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

