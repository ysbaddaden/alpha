
// CHANGED: closeOnOuterClick should now work under IE (untested).
// TODO: Implement a position:auto case, where the tooltip is displayed at the best place in the visible area (defaulting to top-right).

UI.Picker = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = misago.$(relativeElement);
  
  this.options = {
    id: null,
    className: '',
    position: null,
    onClose: 'hide',
    closeOnEscape: true,
    closeOnOuterClick: true
  };
  this.options.merge(options || {});
  
  this.createPicker();
}

UI.Picker.prototype.createPicker = function()
{
  UI.Window.prototype.createContainer.call(this);
  this.container.className = 'picker ' + this.options.className;
  if (this.options.id) {
    this.container.id = this.options.id;
  }
  
  UI.Window.prototype.createContent.call(this);
  
  if (this.options.closeOnOuterClick)
  {
    var elm = document.documentElement ? document.documentElement : window;
    elm.addEventListener('click', function(evt)
    {
      var obj = evt.target;
      do
      {
        if (obj == this.container
          || obj == this.relativeElement)
        {
          return;
        }
      }
      while(obj = obj.parentNode);
      
      this.onClose();
    }.bind(this), false);
  }
}

UI.Picker.prototype.bounds = {};

UI.Picker.prototype.computePosition = function()
{
  var relativePosition = this.relativeElement.getPosition();
  var pos = {
    left: relativePosition.x,
    top:  relativePosition.y
  };
  
  if (this.options.position && this.options.position.indexOf)
  {
    // vertical position
    if (this.options.position.indexOf('top') > -1) {
      pos.top -= this.container.offsetHeight;
    }
    else if (this.options.position.indexOf('bottom') > -1) {
      pos.top += this.relativeElement.offsetHeight;
    }
    else
    {
      pos.top += this.relativeElement.offsetHeight / 2;
      pos.top -= this.container.offsetHeight / 2;
    }
    
    // horizontal position
    if (this.options.position.indexOf('left') > -1) {
      pos.left -= this.container.offsetWidth;
    }
    else if (this.options.position.indexOf('right') > -1) {
      pos.left += this.relativeElement.offsetWidth;
    }
    else
    {
      pos.left += this.relativeElement.offsetWidth / 2;
      pos.left -= this.container.offsetWidth / 2;
    }
  }
  else {
    pos.top += this.relativeElement.offsetHeight;
  }
  
  // normalizes the position
  if (this.options.position && this.options.position.indexOf)
  {
    var className = [];
    if (this.options.position.indexOf('top') > -1) {
      className.push('top');
    }
    else if (this.options.position.indexOf('bottom') > -1) {
      className.push('bottom');
    }
    if (this.options.position.indexOf('left') > -1) {
      className.push('left');
    }
    else if (this.options.position.indexOf('right') > -1) {
      className.push('right');
    }
    pos.position = className.join('-');
  }
  return pos;
}

UI.Picker.prototype.setPosition = function()
{
  this.container.setStyle('position', 'absolute');
  
  var pos = this.computePosition();
  var style = {
    left: pos.left + 'px',
    top:  pos.top  + 'px'
  };
  
  if (!pos.position) {
    style['min-width'] = this.relativeElement.offsetWidth + 'px';
  }
  else {
    this.container.className += ' ' + pos.position;
  }
  
  this.container.setStyle(style);
}

UI.Picker.prototype.onClose    = UI.Window.prototype.onClose;
UI.Picker.prototype.display    = UI.Window.prototype.display;
UI.Picker.prototype.hide       = UI.Window.prototype.hide;
UI.Picker.prototype.destroy    = UI.Window.prototype.destroy;
UI.Picker.prototype.setContent = UI.Window.prototype.setContent;

