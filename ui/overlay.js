
UI.Overlay = function()
{
  this.element = document.createElement('div');
  this.element.className = 'overlay';
}

UI.Overlay.prototype.display = function()
{
  if (!this.element.parentNode)
  {
    this.element.setStyle({
      position: 'absolute',
      top:  0,
      left: 0,
      width:  (window.innerWidth  || window.clientWidth)  + document.body.scrollLeft,
      height: (window.innerHeight || window.clientHeight) + document.body.scrollTop
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
  this.element.removeNode();
  delete this.element;
}

