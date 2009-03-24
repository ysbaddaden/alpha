
UI.Overlay = function()
{
  this.element = document.createElement('div');
  this.element.className = 'overlay';
}

UI.Overlay.prototype.display = function()
{
  if (!this.element.parentNode || !this.element.parentNode.tagName)
  {
    this.element.setStyle({
      position: 'absolute',
      top:  0,
      left: 0,
      width:  (window.innerWidth  || document.documentElement.clientWidth)  + document.body.scrollLeft + 'px',
      height: (window.innerHeight || document.documentElement.clientHeight) + document.body.scrollTop  + 'px'
    });
    document.body.appendChild(this.element);
  }
  this.element.setStyle('display', '');
}

UI.Overlay.prototype.hide = function() {
  this.element.setStyle('display', 'none');
}

UI.Overlay.prototype.destroy = function()
{
  this.hide(); // fix for IE: hide before removing
  this.element.parentNode.removeChild(this.element);
  delete this.element;
}

