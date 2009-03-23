
UI.Window = function() {
  throw new Error("UI.Window can't be instanciated.");  
}

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
}

UI.Window.prototype.destroy = function()
{
  this.container.removeNode();
  
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

UI.Window.prototype.display = function()
{
  if (!this.container.parentNode)
  {
    this.container.setStyle('visibility', 'hidden');
    document.body.appendChild(this.container);
    this.setPosition();
    this.container.setStyle('visibility', 'visible');
  }
  this.container.setStyle('display', 'block');
}

UI.Window.prototype.hide = function()
{
  this.container.setStyle('display', 'none');
  if (this.options.modal) {
    this.overlay.hide();
  }
}

