// TODO: Change the default position to auto, when UI.Picker supports it.
// FIXME: Arrows are broken in IE6? It looks like it doesn't support transparent borders.

UI.Tooltip = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = Alpha.$(relativeElement);
  
  this.options = Alpha.mergeObjects({
    id: null,
    className: '',
    position: 'top right',
    onClose: 'hide',
    closeOnEscape: true,
    closeOnOuterClick: true
  }, options || {});
  this.options.className += ' tooltip';
  
  UI.Picker.prototype.createPicker.call(this);
  this.createArrow();
}

UI.Tooltip.prototype.bounds = {};

UI.Tooltip.prototype.createArrow = function()
{
  this.arrow = document.createElement('div');
  this.arrow.className = 'arrow';
  this.container.appendChild(this.arrow);
}

UI.Tooltip.prototype.setContainerPosition = function(pos)
{
  var style = {};
  switch(pos.position)
  {
    case 'top':
      style.top  = pos.top - this.arrow.offsetHeight + 'px';
      style.left = pos.left + 'px';
      break;
    case 'bottom':
      style.top  = pos.top + this.arrow.offsetHeight + 'px';
      style.left = pos.left + 'px';
      break;
    case 'left':
      style.left = pos.left - this.arrow.offsetWidth  + 'px';
      style.top  = pos.top + 'px';
      break;
    case 'right':
      style.left = pos.left + this.arrow.offsetWidth  + 'px';
      style.top  = pos.top + 'px';
      break;
    case 'top-left':
      style.left = pos.left + 3 * this.arrow.offsetWidth + 'px';
      style.top  = pos.top - this.arrow.offsetHeight + 'px';
      break;
    case 'top-right':
      style.left = pos.left - 3 * this.arrow.offsetWidth + 'px';
      style.top  = pos.top - this.arrow.offsetHeight + 'px';
      break;
    case 'bottom-left':
      style.left = pos.left + 3 * this.arrow.offsetWidth + 'px';
      style.top  = pos.top + this.arrow.offsetHeight + 'px';
      break;
    case 'bottom-right':
      style.left = pos.left - 3 * this.arrow.offsetWidth + 'px';
      style.top  = pos.top + this.arrow.offsetHeight + 'px';
      break;
  }
  this.container.setStyle(style);
}

UI.Tooltip.prototype.setArrowPosition = function(pos)
{
  var style = {};
  switch(pos.position)
  {
    case 'bottom':
      style.top  = -this.arrow.offsetWidth + 'px';
      style.left = (this.container.offsetWidth - this.arrow.offsetWidth) / 2 + 'px';
      break;
    case 'top':
      style.left = (this.container.offsetWidth - this.arrow.offsetWidth) / 2 + 'px';
      break;
    case 'left':
      style.right = -this.arrow.offsetWidth + 'px';
      style.top   = (this.container.offsetHeight - this.arrow.offsetHeight) / 2 + 'px';
      break;
    case 'right':
      style.left = -this.arrow.offsetWidth + 'px';
      style.top  = (this.container.offsetHeight - this.arrow.offsetHeight) / 2 + 'px';
      break;
    
    case 'top-left':
      style.right = 2 * this.arrow.offsetWidth + 'px';
      break;
    case 'top-right':
      style.left  = 2 * this.arrow.offsetWidth + 'px';
      break;
    
    case 'bottom-left':
      style.right = 2 * this.arrow.offsetWidth + 'px';
      style.top   = -this.arrow.offsetHeight + 'px';
      break;
    case 'bottom-right':
      style.left  = 2 * this.arrow.offsetWidth + 'px'
      style.top   = -this.arrow.offsetHeight + 'px';
      break;
  }
  this.arrow.setStyle(style);
}

UI.Tooltip.prototype.setPosition = function()
{
  this.container.setStyle('position', 'absolute');
  this.arrow.setStyle('position', 'absolute');
  
  var pos = UI.Picker.prototype.computePosition.call(this);
  this.container.className += ' ' + pos.position;
  
  this.setContainerPosition(pos);
  this.setArrowPosition(pos);
}

UI.Tooltip.prototype.onClose = UI.Picker.prototype.onClose;
UI.Tooltip.prototype.display = UI.Picker.prototype.display;
UI.Tooltip.prototype.hide    = UI.Picker.prototype.hide;

UI.Tooltip.prototype.destroy = function()
{
  UI.Picker.prototype.destroy.call(this);
  delete this.arrow;
}

UI.Tooltip.prototype.setContent = UI.Picker.prototype.setContent;
UI.Tooltip.prototype.attachToDocument = UI.Window.prototype.attachToDocument;

