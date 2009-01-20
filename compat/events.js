/**
 * EMulates DOM Event Handling in Internet Explorer.
 *
 * requires: misago/core.js
 *
 * FIXME Conflicts between Event DOM prototype an IE8?
 */

if (!Element.prototype.addEventListener)
{
  // fixes the Event DOM prototype
  var Event = new misago.prototypeEmulator();

  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  // TODO Fix buttons, keys, etc.
  misago.event = function(event, currentTarget)
  {
    // adds missing methods
    for (var method in Event.prototype) {
      event[method] = Event.prototype[method];
    }

    // target: the element the event happened on
    if (this.target)
    {
	    this.target = new Element(this.target);
	    misago.garbage.push(this.target);
    }
    else if (this.srcElement)
    {
	    this.target = new Element(this.srcElement);
	    misago.garbage.push(this.target);
    }

    // currentTarget: the element that handles the event
    if (!this.currentTarget && currentTarget) {
	    this.currentTarget = currentTarget;
    }

    // relatedTarget:
    // on mouseover: the element the mouse came from
    // on mouseout:  the element the mouse left to
    if (this.type == 'mouseover')
    {
	    this.relatedTarget = new Element(this.fromElement);
	    misago.garbage.push(this.relatedTarget);
    }
    else if (this.type == 'mouseout')
    {
	    this.relatedTarget = new Element(this.toElement);
	    misago.garbage.push(this.relatedTarget);
    }

    // fixes values
    this.pageX = this.clientX + document.scrollLeft;
    this.pageY = this.clientY + document.scrollTop;

    return event;
  }

  Element.prototype.addEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      throw new Error("Capture mode isn't supported in MSIE.'");
    }

    // array of type/listeners to call
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[type])
    {
      var self = this;
      this.$events[type] = {
        listeners: [],
        caller: function()
        {
          var evt = misago.event(window.event, self);
          self.$events[type].listeners.forEach(function(listener) {
            listener.call(self, window.event);
          });
        }
      };

      // we bind our own caller (once)
      this.attachEvent('on' + type, this.$events[type].caller);
    }

    // adds the listener to our list
    this.$events[type].listeners.push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      return new Error("Capture mode isn't supported in MSIE.'");
    }
    
    if (this.$events)
    {
      if (this.$events[type])
      {
        // removes listener
        var idx = this.$events[type].listeners.indexOf(listener);
        if (idx > -1)
        {
          delete this.$events[type].listeners[idx];
          this.$events[type].listeners.splice(idx, 1);
        }
        
        if (this.$events[type].listeners.length == 0)
        {
          // nothing to call anymore? we unbind our caller
          this.detachEvent('on' + type, listener);
          delete this.$events[type];
        }
      }
      
      if (this.$events.length == 0) {
        delete this.$events;
      }
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this.$events)
    {
      for (var type in this.$events)
      {
        for (var i=0, len=this.$events[type].listeners.length; i<len; i++)
        {
          delete this.$events[type].listeners[i];
          this.detachEvent(type, this.$events[type].caller);
        }
      }
      //delete this.$events;
    }
  }

  document.body.addEventListener    = Element.prototype.addEventListener;
  document.body.removeEventListener = Element.prototype.removeEventListener;
  document.body.clearEvents         = Element.prototype.clearEvents;

  window.addEventListener           = Element.prototype.addEventListener;
  window.removeEventListener        = Element.prototype.removeEventListener;
  document.body.clearEvents         = Element.prototype.clearEvents;
}
