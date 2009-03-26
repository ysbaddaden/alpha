/**
 * Emulates DOM events in Internet Explorer.
 * requires: misago/core.js
 */

if (!Element.prototype.addEventListener)
{
  // fixes the Event DOM prototype
  if (typeof Event == 'undefined') {
    Event = new misago.prototypeEmulator();
  }

  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }

  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  misago.event = function(event, currentTarget)
  {
    // adds missing methods
    for (var method in Event.prototype) {
      event[method] = Event.prototype[method];
    }

    // target: the element the event happened on
    if (event.target) {
      event.target = misago.$(event.target);
    }
    else if (event.srcElement) {
      event.target = misago.$(event.srcElement);
    }

    // currentTarget: the element that handles the event
    if (!event.currentTarget && currentTarget) {
      event.currentTarget = misago.$(currentTarget);
    }

    // relatedTarget:
    if (event.type == 'mouseover')
    {
      // the element the mouse came from
      event.relatedTarget = misago.$(event.fromElement);
    }
    else if (event.type == 'mouseout')
    {
      // the element the mouse left to
      event.relatedTarget = misago.$(event.toElement);
    }
    else {
      event.relatedTarget = null;
    }

    // fixes values
    event.pageX = event.clientX + document.scrollLeft;
    event.pageY = event.clientY + document.scrollTop;

    return event;
  }

  Element.prototype.addEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      throw new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }

    // creates the list of listeners to call (per type)
    if (!this._misago_events) {
      this._misago_events = {};
    }

    // creates the real listener for event type
    if (!this._misago_events[type])
    {
      var self = this;
      this._misago_events[type] = {
        listeners: [],
        real_listener: function()
        {
          // the event object
          var event = misago.event(window.event, self);

          // runs the list of listeners for event type
          for(var i = 0, len = self._misago_events[type].listeners.length; i < len; i++) {
            self._misago_events[type].listeners[i].call(self, event);
          }
        }
      };

      // we attach the real listener (once)
      this.attachEvent('on' + type, this._misago_events[type].real_listener);
    }

    // adds the listener to internal list
    this._misago_events[type].listeners.push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      return new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }
    
    if (this._misago_events)
    {
      if (this._misago_events[type])
      {
        // removes the listener
        var idx = this._misago_events[type].listeners.indexOf(listener);
        if (idx > -1)
        {
          delete this._misago_events[type].listeners[idx];
          this._misago_events[type].listeners.splice(idx, 1);
        }
        
        // no more listeners: let's detach the real one and clean up
        if (this._misago_events[type].listeners.length == 0)
        {
          this.detachEvent('on' + type, this._misago_events[type].real_listener);
          delete this._misago_events[type];
        }
      }
      
      // no more listeners: let's clean up
      if (this._misago_events.length == 0) {
        delete this._misago_events;
      }
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this._misago_events)
    {
      for (var type in this._misago_events)
      {
        if (this._misago_events[type].listeners)
        {
          for (var i=0, len=this._misago_events[type].listeners.length; i<len; i++) {
            delete this._misago_events[type].listeners[i];
          }
          this.detachEvent('on' + type, this._misago_events[type].real_listener);
        }
        delete this._misago_events[type];
      }
    }
  }

  if (typeof document.body.addEventListener == 'undefined')
  {
    document.body.addEventListener    = Element.prototype.addEventListener;
    document.body.removeEventListener = Element.prototype.removeEventListener;
    document.body.clearEvents         = Element.prototype.clearEvents;
    
    document.documentElement.addEventListener    = Element.prototype.addEventListener;
    document.documentElement.removeEventListener = Element.prototype.removeEventListener;
    document.documentElement.clearEvents         = Element.prototype.clearEvents;
  }

  if (typeof window.addEventListener == 'undefined')
  {
    /*
    window.addEventListener    = Element.prototype.addEventListener;
    window.removeEventListener = Element.prototype.removeEventListener;
    window.clearEvents         = Element.prototype.clearEvents;
    */
    window.addEventListener = function(type, listener, useCapture) {
      return document.documentElement.addEventListener(type, listener, useCapture);
    }
    window.removeEventListener = function(type, listener, useCapture) {
      return document.documentElement.removeEventListener(type, listener, useCapture);
    }
    window.clearEvents = function() {
      return document.documentElement.clearEvents();
    }
  }
}
