
UI.InPlaceEditor = function(element, callback)
{
  this.element      = element;
  this.callback     = callback;
  this.text_wrapper = this.element.getElementsByClassName('text-wrapper')[0];
  this.edit_link    = this.element.getElementsByClassName('edit-link')[0];
  this.edit_link.addEventListener('click', this.start.bind(this), false);
}

UI.InPlaceEditor.prototype.start = function(evt)
{
  evt.preventDefault();
  
  if (!this.textarea)
  {
    this.textarea = document.createElement('textarea');
    this.textarea.addEventListener('blur', this.stop.bind(this), false);
    new UI.Autoresize(this.textarea);
  }
  
  this.originaltext = this.textarea.value = this.text_wrapper.innerHTML;
  
  this.textarea.style.cssText     += ';visibility:visible;display:block;';
  this.textarea.style.cssText     += ';min-height:' + this.text_wrapper.offsetHeight + 'px;';
  
  this.text_wrapper.style.cssText += ';visibility:hidden;display:none;';
  this.element.className           = 'editable editing';
  this.element.insertBefore(this.textarea, this.text_wrapper);
  this.textarea.focus();
}

UI.InPlaceEditor.prototype.stop = function()
{
  if (this.textarea.value != this.originaltext)
  {
    this.callback(this.textarea.value);
    this.text_wrapper.innerHTML = this.textarea.value;
  }
  
  this.element.className           = 'editable';
  this.text_wrapper.style.cssText += ';visibility:visible;display:block;';
  this.textarea.style.cssText     += ';visibility:hidden;display:none;';
}

