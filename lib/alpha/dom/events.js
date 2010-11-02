/**
 * Emulates DOM Events in Internet Explorer.
 * 
 * - document.createEvent()
 * - Element.dispatchEvent()
 * - Element.addEventListener()
 * - Element.removeEventListener()
 * 
 * requires: compat/core.js
 * requires: compat/element/dom.js
 * requires: compat/element/element.js
 * 
 * Custom event dispatching is inspired by Prototype.js
 * by Sam Stephenson http://www.prototypejs.org/
 */

if (!Element.prototype.addEventListener)
{
  // adds support for DOMContentLoaded
  if (document.attachEvent)
  {
    document.attachEvent('onreadystatechange', function()
    {
      if (document.readyState == 'complete')
      {
        var e = document.createEvent('HTMLEvents');
        e.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(e);
      }
    });
  }

  // fixes the Event DOM prototype
  if (typeof Event == 'undefined') {
    Event = new Alpha.prototypeEmulator();
  }

  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }

  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  Alpha.event = function(currentTarget)
  {
    // clones current event
    var event = {};
    for (var i in window.event) {
      event[i] = window.event[i];
    }
    
    // adds missing methods
    for (var method in Event.prototype) {
      event[method] = Event.prototype[method];
    }
    
    // custom event
    if (event._alpha_event_type) {
      event.type = event._alpha_event_type;
    }
    
    // target: the element the event happened on
    if (event.target) {
      event.target = Alpha.$(event.target);
    }
    else if (event.srcElement) {
      event.target = Alpha.$(event.srcElement);
    }
    
    // currentTarget: the element that handles the event
    if (!event.currentTarget && currentTarget) {
      event.currentTarget = Alpha.$(currentTarget);
    }
    
    if (event.type == 'mouseover')
    {
      // relatedTarget: the element the mouse came from
      event.relatedTarget = Alpha.$(event.fromElement);
    }
    else if (event.type == 'mouseout')
    {
      // relatedTarget: the element the mouse left to
      event.relatedTarget = Alpha.$(event.toElement);
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
    if (!this._alpha_events) {
      this._alpha_events = {};
    }

    // creates the real listener for event type
    if (!this._alpha_events[type])
    {
      var self = this;
      var _event    = '_alpha_event_' + type + '_event';
      var _listener = '_alpha_event_' + type + '_listener';
      
      this._alpha_events[type] = {
        listeners: [],
        real_listener: function()
        {
          // the event object
          self[_event] = Alpha.event(self);
          
          // runs the list of listeners for event type. we use a custom launcher
          // in order for failing listeners not to stop the event dispatch.
          // see http://deanedwards.me.uk/weblog/2009/03/callbacks-vs-events/ for explanations.
          for (var i = 0, len = self._alpha_events[type].listeners.length; i < len; i++) {
            self[_listener] = self._alpha_events[type].listeners[i];
          }
          
          // copies properties for preventDefault() and stopPropagation() to have any effect
          window.event.returnValue  = self[_event].returnValue;
          window.event.cancelBubble = self[_event].cancelBubble;
        },
        custom_launcher: function(evt)
        {
          if (evt.propertyName == _listener) {
            self[_listener].call(self, self[_event]);
          }
        }
      };

      // attaches the real listener
      if (typeof this['on' + type] != 'undefined') {
        this.attachEvent('on' + type, this._alpha_events[type].real_listener);
      }
      else
      {
        // custom event: we listen for two event types (one that bubbles, and one that doesn't)
        this.attachEvent('ondataavailable', this._alpha_events[type].real_listener);
        this.attachEvent('onlosecapture',   this._alpha_events[type].real_listener);
      }
      this.attachEvent('onpropertychange', this._alpha_events[type].custom_launcher);
    }

    // adds the listener to internal list
    this._alpha_events[type].listeners.push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      return new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }
    
    if (this._alpha_events)
    {
      if (this._alpha_events[type])
      {
        // removes the listener
        var idx = this._alpha_events[type].listeners.indexOf(listener);
        if (idx > -1)
        {
          delete this._alpha_events[type].listeners[idx];
          this._alpha_events[type].listeners.splice(idx, 1);
        }
        
        // no more listeners: let's detach the real one and clean up
        if (this._alpha_events[type].listeners.length == 0)
        {
          this._alpha_remove_event_listener(type);
          delete this._alpha_events[type];
        }
      }
      
      // no more listeners: let's clean up
      if (this._alpha_events.length == 0) {
        delete this._alpha_events;
      }
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this._alpha_events)
    {
      for (var type in this._alpha_events)
      {
        if (this._alpha_events[type].listeners)
        {
          for (var i=0, len=this._alpha_events[type].listeners.length; i<len; i++) {
            delete this._alpha_events[type].listeners[i];
          }
          this._alpha_remove_event_listener(type);
        }
        delete this._alpha_events[type];
      }
    }
  }

  Element.prototype._alpha_remove_event_listener = function(type)
  {
    if (typeof this['on' + type] != 'undefined') {
      this.detachEvent('on' + type, this._alpha_events[type].real_listener);
    }
    else
    {
      // custom event: we listen for two event types (one that bubbles, and one that doesn't)
      this.detachEvent('ondataavailable', this._alpha_events[type].real_listener);
      this.detachEvent('onlosecapture',   this._alpha_events[type].real_listener);
    }
    this.detachEvent('onpropertychange', this._alpha_events[type].custom_launcher);
  }


  // custom events

  Alpha.events = {};
  
  Alpha.events.Event = function() {}
  Alpha.events.Event.prototype.initEvent = function(type, canBubble, cancelable)
  {
    this.type = type;
    this.event = document.createEventObject();
    this.event.eventType = canBubble ? 'ondataavailable' : 'onlosecapture';
    this.event._alpha_event_type = type;
  }
  Alpha.events.HTMLEvent = function() {}
  Alpha.events.HTMLEvent.prototype = new Alpha.events.Event();
  Alpha.events.HTMLEvents = Alpha.events.HTMLEvent;
  
  document.createEvent = function(className) {
    return new Alpha.events[className];
  }
  
  Element.prototype.dispatchEvent = function(event)
  {
    for (var i in event)
    {
      if (i != 'type' && i != 'event'
        && typeof event.event[i] == undefined)
      {
        event.event[i] = event;
      }
    }
    return this.fireEvent(event.event.eventType, event.event);
  }
  
  document.addEventListener    = Element.prototype.addEventListener;
  document.removeEventListener = Element.prototype.removeEventListener;
  document.clearEvents         = Element.prototype.clearEvents;
  document.dispatchEvent       = Element.prototype.dispatchEvent;
  
  document.documentElement.addEventListener    = Element.prototype.addEventListener;
  document.documentElement.removeEventListener = Element.prototype.removeEventListener;
  document.documentElement.clearEvents         = Element.prototype.clearEvents;
  document.documentElement.dispatchEvent       = Element.prototype.dispatchEvent;
  
  window.addEventListener = function(type, listener, useCapture) {
    return document.documentElement.addEventListener(type, listener, useCapture);
  }
  window.removeEventListener = function(type, listener, useCapture) {
    return document.documentElement.removeEventListener(type, listener, useCapture);
  }
  window.clearEvents = function() {
    return document.documentElement.clearEvents();
  }
  window.dispatchEvent = function(event) {
    return document.documentElement.dispatchEvent(event);
  }
  
  document.addEventListener('DOMContentLoaded', function(event)
  {
    document.body.addEventListener    = Element.prototype.addEventListener;
    document.body.removeEventListener = Element.prototype.removeEventListener;
    document.body.clearEvents         = Element.prototype.clearEvents;
    document.body.dispatchEvent       = Element.prototype.dispatchEvent;
  });
}
