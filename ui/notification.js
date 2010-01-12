/*
   new UI.Notification({autoHide: 5000}, 'my custom message');
   
   var n = new UI.Notification({autoHide: 2500});
   n.setMessage(document.getElementById('notification-message').innerHTML);
 */
UI.Notification = function(options, mesg)
{
  this.options = {
    autoHide: 1000,
    position: ['top', 'right'],
    className: ''
  };
  Object.merge(this.options, options || {});
  
  this.container = document.createElement('div');
  this.container.className = 'notification ' + this.options.className;
  /*
  this.background = document.createElement('div');
  this.background.className = 'background';
  this.container.appendChild(this.background);
  
  this.content = document.createElement('div');
  this.content.className = 'content';
  this.container.appendChild(this.content);
  */
  if (mesg) {
    this.setMessage(mesg);
  }
}

UI.Notification.prototype.setPosition = function()
{
  if (kokone.browser.ie6)
  {
    this.container.setStyle({
      position: 'absolute',
      top:  this.container.getStyle('top')  + document.documentElement.scrollTop  + 'px',
      left: this.container.getStyle('left') + document.documentElement.scrollLeft + 'px'
    });
  }
  /*
  this.background.setStyle({
    position: 'absolute',
    top:  0,
    left: 0,
    width:  this.container.offsetWidth + 'px',
    height: this.container.offsetHeight + 'px'
  });
  */
}

UI.Notification.prototype.display = function()
{
  if (!this.container.parentNode || !this.container.parentNode.tagName) {
    document.body.appendChild(this.container);
  }
  
  this.setPosition();
  this.container.setStyle('display', 'block');
  
  if (this.options.autoHide > 0) {
    this.hide.delay(this.options.autoHide, this);
  }
}

UI.Notification.prototype.hide = function()
{
  if (this.container.fx && !kokone.browser.ie)
  {
    var onComplete = function() {
      this.container.setStyle('display', 'none');
    }
    this.container.fx({opacity: [1.0, 0.0]}, {onComplete: onComplete.bind(this)});
  }
  else {
    this.container.setStyle('display', 'none');
  }
//  this.background.setStyle('display', 'none'); // fix for IE
}

UI.Notification.prototype.destroy = function()
{
  this.container.parentNode.removeChild(this.container);
  delete this.container;
//  delete this.background;
//  delete this.content;
}

UI.Notification.prototype.setMessage = function(msg)
{
//  this.content.innerHTML = msg;
  this.container.innerHTML = msg;
  this.display();
}

