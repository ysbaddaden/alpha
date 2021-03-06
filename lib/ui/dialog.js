// TODO: Handle dialog buttons (cancel, ok, and customs).
// TODO: Handle some callbacks.
// TODO: UI.Dialog: Permit to behave like a real popup, or like an iframe, using AJAX to load it's content as well as any further click.

UI.Dialog = function(options)
{
  this.options = Alpha.mergeObjects({
    id:            '',
    className:     '',
    titlebar:      true,
    title:         '',
    position:      'center',
    onClose:       'destroy',
    modal:         false,
    closeOnEscape: true
  }, options || {});
  
  this.bounds = {};
  
  UI.Window.prototype.createContainer.call(this);
  this.container.className = 'dialog ' + this.options.className;
  
  if (this.options.titlebar) {
    this.createTitlebar();
  }
  UI.Window.prototype.createContent.call(this);
  
  if (this.options.modal)
  {
    this.overlay = new UI.Overlay();
    this.overlay.display();
  }
}

UI.Dialog.prototype = new UI.Window();

UI.Dialog.prototype.createTitlebar = function()
{
  this.title = document.createElement('span');
  this.title.className = 'title';
  this.title.innerHTML = this.options.title;
  
  var close = document.createElement('a');
  close.innerHTML = '<span>X</span>';
  
  close.addEventListener('click', this.onClose.bind(this), false);
  
  this.titlebar = document.createElement('div');
  this.titlebar.className = 'titlebar';
  this.titlebar.appendChild(this.title);
  this.titlebar.appendChild(close);
  
  this.container.insertBefore(this.titlebar, this.container.firstChild);
}

UI.Dialog.prototype.setPosition = function()
{
  var position = {top: false, right: false, bottom: false, left: false};
  if (this.options.position.forEach)
  {
    this.options.position.forEach(function(pos) {
      position[pos] = true;
    });
  }
  else {
    position[this.options.position] = true;
  }
  
  this.container.setStyle({position: 'absolute'});
  var style = {};
  
  if (position.top) {
    style.top = 0;
  }
  else if (position.bottom) {
    style.bottom = 0;
  }
  else
  {
    style.top = parseInt(Math.max(0, (window.innerHeight || document.documentElement.clientHeight) - this.container.offsetHeight) / 2
      + (document.documentElement ? document.documentElement.scrollTop : window.pageYOffset)) + 'px';
  }
  
  if (position.left) {
    style.left = 0;
  }
  else if (position.right) {
    style.right = 0;
  }
  else
  {
    style.left = parseInt(Math.max(0, (window.innerWidth || document.documentElement.clientWidth) - this.container.offsetWidth) / 2
      + (document.documentElement ? document.documentElement.scrollLeft : window.pageXOffset)) + 'px';
  }
  
  UI.Window.prototype.setPosition.call(this, style);
}

UI.Dialog.prototype.display = function()
{
  if (this.options.modal) {
    this.overlay.display();
  }
  UI.Window.prototype.display.call(this);
}

UI.Dialog.prototype.destroy = function()
{
  if (this.options.modal) {
    this.overlay.destroy();
  }
  delete this.title;
  delete this.titlebar;
  
  UI.Window.prototype.destroy.call(this);
}

UI.Dialog.prototype.setTitle = function(title) {
  this.title.innerHTML = title;
}

