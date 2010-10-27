// TODO: Implement a position:auto case, where the tooltip is displayed at the best place in the visible area (starting from top-right).

Alpha.UI.Picker = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = Alpha.$(relativeElement);
  
  this.options = {
    id: null,
    className: '',
    position: null,
    onClose: 'hide',
    closeOnEscape: true,
    closeOnOuterClick: true
  };
  this.options = Alpha.mergeObjects(this.options, options || {});
  
  this.createPicker();
}

Alpha.UI.Picker.prototype = new Alpha.UI.Window();

Alpha.UI.Picker.prototype.createPicker = function()
{
  Alpha.UI.Window.prototype.createContainer.call(this);
  this.container.className = 'picker ' + this.options.className;
  if (this.options.id) {
    this.container.id = this.options.id;
  }
  
  Alpha.UI.Window.prototype.createContent.call(this);
  
  if (this.options.closeOnOuterClick)
  {
    this.bounds.closeOnOuterClick = function(evt)
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
    }.bind(this);
//    var elm = document.documentElement ? document.documentElement : window;
//    elm.addEventListener('click', function(evt)
    window.addEventListener('click', this.bounds.closeOnOuterClick, false);
  }
}

Alpha.UI.Picker.prototype.computePosition = function()
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

Alpha.UI.Picker.prototype.setPosition = function()
{
  this.container.style.position = 'absolute';
  
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

Alpha.UI.Picker.prototype.destroy = function()
{
  window.removeEventListener('click', this.bounds.closeOnOuterClick, false);
  Alpha.UI.Window.prototype.destroy.call(this);
}

