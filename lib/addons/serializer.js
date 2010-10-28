/**
 * Serializes an HTML form into an application/x-www-form-urlencoded string.
 * 
 * Example:
 * 
 *   var form = document.getElementById('update_product_1');
 *   
 *   var params = new Serializer();
 *   params.serialize(form);
 *   params.append('_method', 'put');
 *   
 *   var xhr = new XMLHttpRequest();
 *   xhr.open('POST', form);
 *   xhr.send(params.toString());
 * 
 * IMPROVE: use selectedOptions for <select multiple/>
 */

Alpha.Serializer = function() {
  this.data = '';
}

Alpha.Serializer.prototype.serialize = function(form)
{
  var inputs = form.querySelectorAll('input,select,textarea');
  Array.prototype.forEach.call(inputs, function(input)
  {
    if (!input.name
      || input.disabled
      || input.type == 'file'
      || (input.type == 'checkbox' && !input.checked)
      || (input.type == 'submit' && !input.hasAttribute('submitted')))
    {
      return;
    }
    if (input.type == 'select' && input.multiple)
    {
      for (var i=0, len=this.selectedOptions.length; i<len; i++) {
        this.append(input.name, this.selectedOptions[i].value);
      }
    }
    else {
      this.append(input.name, input.value);
    }
  }, this);
}

Alpha.Serializer.prototype.append = function(key, value)
{
  if (value !== null) {
    this.data += (this.data ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
}

Alpha.Serializer.prototype.toString = function() {
  return this.data;
}

