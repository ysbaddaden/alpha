
UI.Overlay = function()
{
  this.element = document.createElement('div');
  
  if (!kokone.browser.ie6) {
    this.element.className = 'overlay';
  }
  else
  {
    // iframe tricks IE6, which places select inputs over positionned divs :/
    var iframe = document.createElement('iframe');
    iframe.src = "javascript:'<html></html>';";
    iframe.style.cssText += ';position:absolute;border:0;' +
      'top:0;left:0;width:100%;height:100%;overflow:hidden;filter:alpha(opacity=0);';
    this.element.appendChild(iframe);
    
    var div = document.createElement('div');
    div.className = 'overlay';
    div.style.cssText += ';position:absolute;border:0;top:0;left:0;width:100%;height:100%;';
    this.element.appendChild(div);
  }
}

UI.Overlay.prototype.display = function()
{
  if (!this.element.parentNode || !this.element.parentNode.tagName) {
    document.body.appendChild(this.element);
  }
  
  var innerWidth  = (window.innerWidth  || document.documentElement.clientWidth);
  var innerHeight = (window.innerHeight || document.documentElement.clientHeight);
  
  var width  = ((document.body.clientWidth  > innerWidth)  ? document.body.clientWidth  : innerWidth);
  var height = ((document.body.clientHeight > innerHeight) ? document.body.clientHeight : innerHeight);
  
  this.element.setStyle({display: '', position: 'absolute',
    top:  0, left: 0, width: width  + 'px', height: height + 'px'});
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

