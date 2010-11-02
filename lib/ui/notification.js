/*
   new UI.Notification({autoHide: 5000}, 'my custom message');
   
   var n = new UI.Notification({autoHide: 2500});
   n.setMessage(document.getElementById('notification-message').innerHTML);
   
   Check http://leaverou.me/2009/02/bulletproof-cross-browser-rgba-backgrounds/
 */
UI.Notification = function(options, mesg)
{
  this.options = Alpha.mergeObjects({
    autoHide: 1000,
    position: ['top', 'right'],
    className: ''
  }, options || {});
  
  this.container = document.createElement('div');
  this.container.className = 'notification ' + this.options.className;
  
  if (mesg) {
    this.setMessage(mesg);
  }
}

UI.Notification.prototype.setPosition = function()
{
  if (Alpha.browser.ie6)
  {
    this.container.setStyle({
      position: 'absolute',
      top:  this.container.getStyle('top')  + document.documentElement.scrollTop  + 'px',
      left: this.container.getStyle('left') + document.documentElement.scrollLeft + 'px'
    });
  }
}

UI.Notification.prototype.display = function()
{
  if (!this.container.parentNode || !this.container.parentNode.tagName) {
    document.body.appendChild(this.container);
  }
  
  this.setPosition();
  this.container.style.display = 'block';
  
  if (this.options.autoHide > 0) {
    setTimeout(this.hide.bind(this), this.options.autoHide);
  }
}

UI.Notification.prototype.hide = function()
{
  if (this.container.fx && !Alpha.browser.ie)
  {
    var onComplete = function() {
      this.container.style.display = 'none';
    }
    this.container.fx({opacity: [1.0, 0.0]}, {onComplete: onComplete.bind(this)});
  }
  else {
    this.container.style.display = 'none';
  }
}

UI.Notification.prototype.destroy = function()
{
  this.container.parentNode.removeChild(this.container);
  delete this.container;
}

UI.Notification.prototype.setMessage = function(msg)
{
  this.container.innerHTML = msg;
  this.display();
}

