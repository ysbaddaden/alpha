
// IMPROVE: Cap textarea's height using minHeight and maxHeight styles.

UI.Autoresize = function(textarea, callback)
{
  this.textarea = textarea;
  this.textarea.addEventListener('keyup', this.resize.bind(this), false);
}

UI.Autoresize.prototype.resize = function()
{
  if (!this.fake) {
    this.createFake();
  }
  this.fake.value  = this.textarea.value + "\n";
  this.textarea.style.height = this.fake.scrollHeight + 'px';
}

UI.Autoresize.prototype.createFake = function(evt)
{
  this.fake = document.createElement('textarea');
  
  var s = this.textarea.currentStyle ? this.textarea.currentStyle :
    ((document.defaultView && document.defaultView.getComputedStyle) ? document.defaultView.getComputedStyle(this.textarea, "") : this.textarea.style);
  
  this.fake.style.overflow          = 'hidden';
  this.fake.style.visibility        = 'hidden';
  this.fake.style.position          = 'absolute';
  this.fake.style.zIndex            = -1;
  
  this.fake.style.fontFamily        = s.fontFamily;
  this.fake.style.fontWeight        = s.fontWeight;
  this.fake.style.fontStyle         = s.fontStyle;
  this.fake.style.fontSize          = s.fontSize;
  this.fake.style.lineHeight        = s.lineHeight;
  
  this.fake.style.paddingTop        = s.paddingTop;
  this.fake.style.paddingBottom     = s.paddingBottom;
  this.fake.style.paddingLeft       = s.paddingLeft;
  this.fake.style.paddingRight      = s.paddingRight;
  
  this.fake.style.borderTopWidth    = s.borderTopWidth;
  this.fake.style.borderBottomWidth = s.borderBottomWidth;
  this.fake.style.borderLeftWidth   = s.borderLeftWidth;
  this.fake.style.borderRightWidth  = s.borderRightWidth;
  
  this.textarea.style.overflowY  = 'hidden';
  this.textarea.style.resize     = 'none';
  this.textarea.parentNode.insertBefore(this.fake, this.textarea);
  this.fake.style.width = s.width;
}

