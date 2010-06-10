
// TODO: Change the default position to auto, when Alpha.UI.Picker supports it.
// FIXME: Arrows are broken in IE6? It looks like it doesn't support transparent borders.

Alpha.UI.Tooltip = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = Alpha.$(relativeElement);
  
  this.options = {
    id: null,
    className: '',
    position: 'top right',
    onClose: 'hide',
    closeOnEscape: true,
    closeOnOuterClick: true
  };
  Alpha.mergeObjects(this.options, options || {});
  this.options.className += ' tooltip';
  
  Alpha.UI.Picker.prototype.createPicker.call(this);
  this.createArrow();
}

Alpha.UI.Tooltip.prototype.bounds = {};

Alpha.UI.Tooltip.prototype.createArrow = function()
{
  this.arrow = document.createElement('div');
  this.arrow.className = 'arrow';
  this.container.appendChild(this.arrow);
}

Alpha.UI.Tooltip.prototype.setContainerPosition = function(pos)
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

Alpha.UI.Tooltip.prototype.setArrowPosition = function(pos)
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

Alpha.UI.Tooltip.prototype.setPosition = function()
{
  this.container.setStyle('position', 'absolute');
  this.arrow.setStyle('position', 'absolute');
  
  var pos = Alpha.UI.Picker.prototype.computePosition.call(this);
  this.container.className += ' ' + pos.position;
  
  this.setContainerPosition(pos);
  this.setArrowPosition(pos);
}

Alpha.UI.Tooltip.prototype.onClose = Alpha.UI.Picker.prototype.onClose;
Alpha.UI.Tooltip.prototype.display = Alpha.UI.Picker.prototype.display;
Alpha.UI.Tooltip.prototype.hide    = Alpha.UI.Picker.prototype.hide;

Alpha.UI.Tooltip.prototype.destroy = function()
{
  Alpha.UI.Picker.prototype.destroy.call(this);
  delete this.arrow;
}

Alpha.UI.Tooltip.prototype.setContent = Alpha.UI.Picker.prototype.setContent;

