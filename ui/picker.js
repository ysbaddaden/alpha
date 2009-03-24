
UI.Picker = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = misago.$(relativeElement);
  
  this.options = {
    id: null,
    className: '',
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
    window.addEventListener('click', function(evt)
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

// TODO: Handle a given position around relativeElement
UI.Picker.prototype.computePosition = function()
{
  var pos = this.relativeElement.getPosition();
  var style = {
    left: pos.x,
    top:  pos.y + this.relativeElement.offsetHeight
  };
  return style;
}

UI.Picker.prototype.setPosition = function()
{
  var pos = this.computePosition();
  this.container.setStyle({
    position: 'absolute',
    left: pos.left + 'px',
    top:  pos.top  + 'px',
    'min-width': this.relativeElement.offsetWidth + 'px'
  });
}

UI.Picker.prototype.onClose    = UI.Window.prototype.onClose;
UI.Picker.prototype.display    = UI.Window.prototype.display;
UI.Picker.prototype.hide       = UI.Window.prototype.hide;
UI.Picker.prototype.destroy    = UI.Window.prototype.destroy;
UI.Picker.prototype.setContent = UI.Window.prototype.setContent;

