
HTML5.Placeholder = function(element)
{
  /*@cc_on if (element.type == 'password') { return; } @*/
  
  this.element = element;
  this.elementType = this.element.type;
  
  this.element.addEventListener('focus', this.removePlaceholder.bind(this), false);
  this.element.addEventListener('blur',  this.setPlaceholder.bind(this),  false);
  
  this.setPlaceholder();
}

HTML5.Placeholder.prototype.removePlaceholder = function()
{
  if (this.element.value == this.element.getAttribute('placeholder')) {
    this.element.value = '';
  }
  if (this.elementType == 'password') {
    this.element.type = 'password';
  }
  this.element.removeClassName('placeholder');
}

HTML5.Placeholder.prototype.setPlaceholder = function()
{
  if (/^[\s]*$/.test(this.element.value))
  {
    if (this.elementType == 'password') {
      this.element.type = 'text';
    }
    this.element.addClassName('placeholder');
    this.element.value = this.element.getAttribute('placeholder');
  }
}

window.addEventListener('load', function()
{
  var elements = document.querySelectorAll('[placeholder]');
  Array.prototype.forEach.call(elements, function(element) {
    new HTML5.Placeholder(element);
  });
}, false);

