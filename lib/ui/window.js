
Alpha.UI.Window = function() {}
Alpha.UI.Window.prototype.bounds = {};

Alpha.UI.Window.prototype.createContainer = function()
{
  this.container = document.createElement('div');
  if (this.options.id) {
    this.container.id = this.options.id;
  }
  
  if (this.options.closeOnEscape)
  {
    this.bounds.closeOnEscape = function() {
      this.onClose();
    }.bind(this);
    
    window.addEventListener('keyup', this.bounds.closeOnEscape, false);
  }
}

Alpha.UI.Window.prototype.createContent = function()
{
  this.content = document.createElement('div');
  this.content.className = 'content';
  this.container.appendChild(this.content);
  /*
  if (Alpha.browser.ie6)
  {
    // iframe tricks IE6, which places select inputs over positionned divs :/
    var iframe = document.createElement('iframe');
    iframe.src = "javascript:'<html></html>';";
    iframe.style.cssText += ';position:absolute;border:0;' +
      'top:0;left:0;width:100%;height:100%;overflow:hidden;';
    
    this.container.firstChild ?
      this.container.insertBefore(iframe, this.container.firstChild) :
      this.container.appendChild(iframe);
  }
  */
}

Alpha.UI.Window.prototype.destroy = function()
{
  this.container.parentNode.removeChild(this.container);
  
  if (this.bounds.closeOnEscape) {
    window.removeEventListener('keyup', this.bounds.closeOnEscape, false);
  }
  delete this.content;
  delete this.container;
}

Alpha.UI.Window.prototype.onClose = function(evt)
{
  if (evt
    && evt.type == 'keyup'
    && evt.keyCode != 27)
  {
    return;
  }
  
  switch(this.options.onClose)
  {
    case 'hide':    this.hide();    break;
    case 'destroy': this.destroy(); break;
    default: throw new Error("Unknown onClose option: " + this.options.onClose);
  }
}

Alpha.UI.Window.prototype.setContent = function(content)
{
  if (content.tagName) {
    this.content.appendChild(content);
  }
  else {
    this.content.innerHTML = content;
  }
}

Alpha.UI.Window.prototype.getContent = function(content) {
  return this.content;
}

Alpha.UI.Window.prototype.display = function()
{
  if (!this.container.parentNode || !this.container.parentNode.tagName)
  {
    this.container.setStyle('visibility', 'hidden');
    document.body.appendChild(this.container);
    this.setPosition();
    this.container.setStyle('visibility', 'visible');
  }
  this.container.setStyle('display', 'block');
}

Alpha.UI.Window.prototype.hide = function()
{
  this.container.setStyle('display', 'none');
  if (this.options.modal) {
    this.overlay.hide();
  }
}

Alpha.UI.Window.prototype.setPosition = function(position) {
  this.container.setStyle(position);
}

