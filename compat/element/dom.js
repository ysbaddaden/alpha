/**
 * Tries to emulate the DOM Element prototype in MSIE < 8.
 */

// The following tries to fix the DOM Element in MSIE < 8.
if (typeof Element == 'undefined')
{
  // Garbage Collector, to prevent memory leaks
  kokone.garbage = [];
  window.attachEvent('onunload', function()
  {
    for (var i=0, len=kokone.garbage.length; i<len; i++)
    {
      var element = kokone.garbage[i];
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
      delete kokone.garbage[i];
    }
  });
  
  // Generic Object prototype emulator
  kokone.prototypeEmulator = function()
  {
    var Obj       = {};
    Obj.prototype = {};

    Obj._kokone_extend = function(o)
    {
      if (/*typeof o == 'object' &&*/ !o._kokone_extended)
      {
        kokone.garbage.push(o);

        for (var method in Obj.prototype)
        {
          // saves the original method
          if (o[method] && !o['_kokone_' + method]) {
            o['_kokone_' + method] = o[method];
          }
          
          // creates (or overwrites) the method
          o[method] = Obj.prototype[method];
        }
        o._kokone_extended = true;
      }
      return o;
    }
    return Obj;
  }

  // Emulates the DOM Element prototype
  Element = new kokone.prototypeEmulator();

  // Manually extends an element
  kokone.extendElement = function(elm) {
    return Element._kokone_extend(elm);
  }

  // Manually extends many elements
  kokone.extendElements = function(elms)
  {
    var rs = [];
    for (var i=0, len=elms.length; i<len; i++) {
      rs.push(kokone.extendElement(elms[i]));
    }
    return rs;
  }
  
  // document.createElement should return an already extended element
  // also extends <canvas> elements if excanvas.js is loaded
  kokone._msie_createElement = document.createElement;
  document.createElement = function(tagName)
  {
    var elm = kokone._msie_createElement(tagName);
    if(tagName == 'canvas' && window.G_vmlCanvasManager) {
      elm = G_vmlCanvasManager.initElement(elm);
    }
    return kokone.extendElement(elm);
  }

  // document.getElementById should return an extended element
  kokone._msie_getElementById = document.getElementById;
  document.getElementById = function(id)
  {
    var elm = kokone._msie_getElementById(id);
    return elm ? kokone.extendElement(elm) : elm;
  }

  // document.getElementsByName should return extended elements
  kokone._msie_getElementsByName = document.getElementsByName;
  document.getElementsByName = function(id)
  {
    var elms = kokone._msie_getElementsByName(id);
    return elms.length ? new kokone.NodeList(kokone.extendElements(elms)) : elms;
  }

  // document.getElementsByTagName should return extended elements
  kokone._msie_getElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(id)
  {
    var elms = kokone._msie_getElementsByTagName(id);
    return elms.length ? new kokone.NodeList(kokone.extendElements(elms)) : elms;
  }

  // elm.getElementsByTagName should return extended elements
  Element.prototype.getElementsByTagName = function(id)
  {
    var elms = this._kokone_getElementsByTagName(id);
    return elms.length ? new kokone.NodeList(kokone.extendElements(elms)) : elms;
  }

  // fixes a pseudo-leak in MSIE
  Element.prototype.removeChild = function(child)
  {
    var garbage = document.getElementById('_kokone_msie_leak_garbage');
    if (!garbage)
    {
        garbage = document.createElement('div');
        garbage.id = '_kokone_msie_leak_garbage';
        garbage.style.display    = 'none';
        garbage.style.visibility = 'hidden';
        document.body.appendChild(garbage);
    }
    
    // removes the child
    this._kokone_removeChild(child);
    
    // destroys the reference
    garbage.appendChild(child);
    garbage.innerHTML = '';
  }
}

