
UI.Tooltip = function(relativeElement, options)
{
  this.options = {
    id: null,
    className: '',
    position:  'bottom'
  };
  this.options.merge(options || {});
  
  this.relativeElement = misago.$(relativeElement);
}

// TODO: Add the tooltip arrow (CSS based) + it's position (as className)
UI.Tooltip.prototype.createPicker = function()
{
  var options = {
    id: this.options.id,
    className: this.options.className,
    position: this.options.position
  };
  this.picker = new Picker(this.relativeElement, options);
  
  /*
  var arrow = document.createElement('div');
  arrow.className = 'arrow';
  this.picker.container.appendChild(arrow);
  */
}

UI.Tooltip.prototype.display = function()
{
  if (!this.picker) {
    this.createPicker();
  }
  this.picker.setPosition();
  this.picker.display();
}

UI.Tooltip.prototype.hide = function()
{
  if (this.picker) {
    this.picker.hide();
  }
}

UI.Tooltip.prototype.destroy    = function()
{
  if (this.picker)
  {
    this.picker.destroy();
    delete this.picker;
  }
}

UI.Tooltip.prototype.setContent = function(content)
{
  if (!this.picker) {
    this.createPicker();
  }
  this.picker.setContent(content);
}

