UI.Window = function() {}
UI.Window.prototype.bounds = {};

UI.Window.prototype.createContainer = function()
{
  this.container = document.createElement('div');
  if (this.options.id) {
    this.container.id = this.options.id;
  }
  
  if (this.options.closeOnEscape)
  {
    this.bounds.closeOnEscape = this.onClose.bind(this);
    window.addEventListener('keyup', this.bounds.closeOnEscape, false);
  }
}

UI.Window.prototype.createContent = function()
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

UI.Window.prototype.destroy = function()
{
  this.container.parentNode.removeChild(this.container);
  
  if (this.bounds.closeOnEscape) {
    window.removeEventListener('keyup', this.bounds.closeOnEscape, false);
  }
  delete this.content;
  delete this.container;
}

UI.Window.prototype.onClose = function(evt)
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

UI.Window.prototype.setContent = function(content)
{
  if (content.tagName) {
    this.content.appendChild(content);
  }
  else {
    this.content.innerHTML = content;
  }
}

UI.Window.prototype.getContent = function(content) {
  return this.content;
}

UI.Window.prototype.display = function()
{
  if (!this.container.parentNode || !this.container.parentNode.tagName)
  {
    this.container.style.visibility = 'hidden';
    this.attachToDocument();
    this.setPosition();
    this.container.style.visibility = 'visible';
  }
  this.container.style.display = 'block';
}

UI.Window.prototype.attachToDocument = function() {
  document.body.appendChild(this.container);
}

UI.Window.prototype.hide = function()
{
  this.container.style.display = 'none';
  if (this.options.modal) {
    this.overlay.hide();
  }
}

UI.Window.prototype.displayed = function() {
  return this.container.style.display != 'none';
}

UI.Window.prototype.setPosition = function(position) {
  this.container.setStyle(position);
}

