
UI.Overlay = function()
{
  this.element = document.createElement('div');
  this.element.className = 'overlay';
}

UI.Overlay.prototype.display = function()
{
  if (!this.element.parentNode || !this.element.parentNode.tagName) {
    document.body.appendChild(this.element);
  }
  
  var innerWidth  = (window.innerWidth  || document.documentElement.clientWidth);
  var innerHeight = (window.innerHeight || document.documentElement.clientHeight);
  this.element.setStyle({
    display: '',
    position: 'absolute',
    top:  0,
    left: 0,
    width:  ((document.body.clientWidth  > innerWidth)  ? document.body.clientWidth  : innerWidth)  + 'px',
    height: ((document.body.clientHeight > innerHeight) ? document.body.clientHeight : innerHeight) + 'px'
  });
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

