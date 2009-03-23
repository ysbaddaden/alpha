
UI.Notification = function(options)
{
  this.options = {
    autoHide: 1000,
    position: ['top', 'right']
  };
  this.options.merge(options || {});
  
  this.container = document.createElement('div');
  this.container.className = 'notification ' + this.options.className;
  
  this.background = document.createElement('div');
  this.background.className = 'background';
  this.container.appendChild(this.background);
  
  this.content = document.createElement('div');
  this.content.className = 'content';
  this.container.appendChild(this.content);
}

UI.Notification.prototype.setPosition = function()
{
  if (misago.browser.ie6)
  {
    this.container.setStyle({
      position: 'absolute',
      top:  this.container.getStyle('top')  + document.body.scrollTop  + 'px',
      left: this.container.getStyle('left') + document.body.scrollLeft + 'px'
    });
  }
  this.background.setStyle({
    position: 'absolute',
    top:  0,
    left: 0,
    width:  this.container.offsetWidth,
    height: this.container.offsetHeight
  });
}

UI.Notification.prototype.display = function()
{
  if (!this.container.parentNode) {
    document.body.appendChild(this.container);
  }
  this.setPosition.call(this);
  this.container.setStyle('display', 'block');
  
  if (this.options.autoHide > 0) {
    this.hide.delay(this.options.autoHide, this);
  }
}

UI.Notification.prototype.hide = function()
{
  this.container.setStyle('display', 'none');
}

UI.Notification.prototype.destroy = function()
{
  this.container.removeNode();
  delete this.container;
  delete this.background;
  delete this.content;
}

UI.Notification.prototype.setMessage = function(msg)
{
  this.content.innerHTML = msg;
  this.display();
}

