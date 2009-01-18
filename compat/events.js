/**
 * EMulates DOM Event Handling in Internet Explorer.
 *
 * requires: compat/core.js
 */

if (!Element.prototype.addEventListener)
{
  // fixes the Event DOM prototype
  var Event = function() {}
  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  // TODO Fix & extend target, relatedTarget, currentTarget, etc.
  // TODO Fix client width/height, buttons, keys, etc.
  compat.event = function(event, currentTarget)
  {
    // adds missing methods
    for (var method in Event.prototype)
    {
      if (!event[method]) {
        event[method] = Event.prototype[method];
      }
    }

    // target: the element the event happened on
    if (this.target)
    {
	    this.target = new Element(this.target);
	    compat.garbage.push(this.target);
    }
    else if (this.srcElement)
    {
	    this.target = new Element(this.srcElement);
	    compat.garbage.push(this.target);
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
	    compat.garbage.push(this.relatedTarget);
    }
    else if (this.type == 'mouseout')
    {
	    this.relatedTarget = new Element(this.toElement);
	    compat.garbage.push(this.relatedTarget);
    }

    // fixes values
    this.pageX = this.clientX + document.scrollLeft;
    this.pageY = this.clientY + document.scrollTop;

    return event;
  }

  Element.prototype.addEventListener = function(type, listener, useCapture)
  {
    if (phase) {
      return new Error("Capture mode isn't supported in MSIE.'");
    }

    // array of type/listeners to call
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[type])
    {
      this.$events[type] = [];

      // we bind our own caller (once)
      // TODO Add compat._MSIE_listener_bounds instead of anonymous function, in order to be able to remove our caller
      var self = this;
      this.attachEvent('on' + type, function()
      {
        var evt = compat.event(window.event, self);
        this.$events[type].forEach(function(listener) {
          listener.call(self, window.event);
        });
      });
    }

    // adds the listener to our list
    this.$events[type].push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (phase) {
      return new Error("Capture mode isn't supported in MSIE.'");
    }

    // removes listener from our list
    if (this.$events && this.$events[type])
    {
      var idx = this.$events[action].indexOf(fn);
      if (idx > -1)
      {
	      delete this.$events[type][idx];
	      this.$events[type].splice(idx, 1);
      }
    }

    if (this.$events[type].length == 0)
    {
      // nothing to call anymore, let's unbind our caller
      this.detachEvent('on' + type, listener);
      delete this.$events[type];
    }

    if (this.$events.length == 0) {
      delete this.$events;
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this.$events)
    {
      for (var type in this.$events)
      {
        for (var i=0, len=this.$events[type].length; i<len; i++)
        {
//        this.detachEvent(type, this.$events[type][i]);
          delete this.$events[type][i];
        });
      }
      delete this.$events;
    }
  }

  document.body.addEventListener    = Element.prototype.addEventListener;
  document.body.removeEventListener = Element.prototype.removeEventListener;
  document.body.clearEvents         = Element.prototype.clearEvents;

  window.addEventListener           = Element.prototype.addEventListener;
  window.removeEventListener        = Element.prototype.removeEventListener;
  document.body.clearEvents         = Element.prototype.clearEvents;
}
