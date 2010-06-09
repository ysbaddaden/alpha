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
 * TODO: Element.addEventListener() must handle custom events.
 * TODO: Element.removeEventListener() must handle custom events.
 */

if (!Element.prototype.addEventListener)
{
  // fixes the Event DOM prototype
  if (typeof Event == 'undefined') {
    Event = new kokone.prototypeEmulator();
  }

  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }

  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  kokone.event = function(event, currentTarget)
  {
    // adds missing methods
    for (var method in Event.prototype) {
      event[method] = Event.prototype[method];
    }
    
    // custom event
    if (event._kokone_event_type) {
      event.type = event._kokone_event_type;
    }
    
    // target: the element the event happened on
    if (event.target) {
      event.target = kokone.$(event.target);
    }
    else if (event.srcElement) {
      event.target = kokone.$(event.srcElement);
    }
    
    // currentTarget: the element that handles the event
    if (!event.currentTarget && currentTarget) {
      event.currentTarget = kokone.$(currentTarget);
    }
    
    if (event.type == 'mouseover')
    {
      // relatedTarget: the element the mouse came from
      event.relatedTarget = kokone.$(event.fromElement);
    }
    else if (event.type == 'mouseout')
    {
      // relatedTarget: the element the mouse left to
      event.relatedTarget = kokone.$(event.toElement);
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
    if (!this._kokone_events) {
      this._kokone_events = {};
    }

    // creates the real listener for event type
    if (!this._kokone_events[type])
    {
      var self = this;
      
      this['_kokone_event_' + type + '_counter'] = 0; // expando
      this._kokone_events[type] = {
        listeners: [],
        real_listener: function()
        {
          // the event object
          self['_kokone_event_' + type + '_event'] = kokone.event(window.event, self);
          
          // runs the list of listeners for event type. we use a custom launcher
          // in order for failing listeners not to stop the event dispatch.
          // see http://deanedwards.me.uk/weblog/2009/03/callbacks-vs-events/ for explanations.
          for (var i = 0, len = self._kokone_events[type].listeners.length; i < len; i++) {
            self['_kokone_event_' + type + '_listener'] = self._kokone_events[type].listeners[i];
          }
        },
        custom_launcher: function(evt)
        {
          if (evt.propertyName == '_kokone_event_' + type + '_listener') {
            self['_kokone_event_' + type + '_listener'].call(self, self['_kokone_event_' + type + '_event']);
          }
        }
      };

      // we attach the real listener
      this.attachEvent('on' + type, this._kokone_events[type].real_listener);
      this.attachEvent('onpropertychange', this._kokone_events[type].custom_launcher);
    }

    // adds the listener to internal list
    this._kokone_events[type].listeners.push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      return new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }
    
    if (this._kokone_events)
    {
      if (this._kokone_events[type])
      {
        // removes the listener
        var idx = this._kokone_events[type].listeners.indexOf(listener);
        if (idx > -1)
        {
          delete this._kokone_events[type].listeners[idx];
          this._kokone_events[type].listeners.splice(idx, 1);
        }
        
        // no more listeners: let's detach the real one and clean up
        if (this._kokone_events[type].listeners.length == 0)
        {
          this.detachEvent('on' + type, this._kokone_events[type].real_listener);
          this.detachEvent('onpropertychange', this._kokone_events[type].custom_launcher);
          delete this._kokone_events[type];
        }
      }
      
      // no more listeners: let's clean up
      if (this._kokone_events.length == 0) {
        delete this._kokone_events;
      }
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this._kokone_events)
    {
      for (var type in this._kokone_events)
      {
        if (this._kokone_events[type].listeners)
        {
          for (var i=0, len=this._kokone_events[type].listeners.length; i<len; i++) {
            delete this._kokone_events[type].listeners[i];
          }
          this.detachEvent('on' + type, this._kokone_events[type].real_listener);
          this.detachEvent('onpropertychange', this._kokone_events[type].custom_launcher);
        }
        delete this._kokone_events[type];
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

// Inspired by Prototype.js by Sam Stephenson http://www.prototypejs.org/
if (!document.createEvent && document.createEventObject)
{
  kokone.events = {};
  
  kokone.events.Event = function() {}
  kokone.events.Event.prototype.initEvent = function(type, canBubble, cancelable)
  {
    this.type = type;
    this.event = document.createEventObject();
    this.event.eventType = canBubble ? 'ondataavailable' : 'onfilterchange';
    this.event._kokone_event_type = type;
  }
  kokone.events.HTMLEvent = function() {}
  kokone.events.HTMLEvent.prototype = new kokone.events.Event();
  kokone.events.HTMLEvents = kokone.events.HTMLEvent;
  
  document.createEvent = function(type) {
    return new kokone.events[type];
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
    return this.fireEvent(event.type, event.event);
  }
  
  document.body.dispatchEvent = function(event) {
    return Element.prototype.dispatchEvent.call(this, event);
  }
}

