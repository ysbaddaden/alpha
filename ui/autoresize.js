
UI.Autoresize = function(textarea, callback)
{
  this.textarea = textarea;
  this.textarea.addEventListener('keyup', this.check.bind(this), false);
  this.check();
}

UI.Autoresize.prototype.check = function(evt)
{
  if (!this.fake) {
    this.createFakeTextarea();
  }
  var text = this.textarea.value.replace(new RegExp("\n", 'g'), '<br/>') + '<br/>';
  this.fake.innerHTML = text;
  this.textarea.style.height = this.fake.offsetHeight + 10 + 'px';
}

UI.Autoresize.prototype.createFakeTextarea = function(evt)
{
  this.fake = document.createElement('div');
  
  var s = this.textarea.currentStyle ? this.textarea.currentStyle :
    ((document.defaultView && document.defaultView.getComputedStyle) ? document.defaultView.getComputedStyle(this.textarea, "") : this.textarea.style);

  this.fake.style.width             = s.width;
//  this.fake.style.visibility        = 'hidden';
//  this.fake.style.position          = 'absolute';
//  this.fake.style.zIndex            = -1;
  this.fake.style.float            = 'left';
  
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
  this.fake.style.borderTopStyle    = s.borderTopStyle;
  this.fake.style.borderBottomStyle = s.borderBottomStyle;
  this.fake.style.borderLeftStyle   = s.borderLeftStyle;
  this.fake.style.borderRightStyle  = s.borderRightStyle;
  
  this.textarea.style.overflow  = 'hidden';
  this.textarea.parentNode.insertBefore(this.fake, this.textarea);
}

