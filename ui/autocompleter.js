
UI.Autocompleter = function(input, url, options) {
  this.initialize(input, url, options);
}

UI.Autocompleter.prototype.initialize = function(input, url, options)
{
  if (typeof input == 'undefined') {
    throw new Error("UI.Autocompleter: missing parameter 'input'.");
  }
  if (typeof url == 'undefined') {
    throw new Error("UI.Autocompleter: missing parameter 'url'.");
  }
  
  this.options = {
    method:   'get',
    param:    'token',
    minChars: 1
  };
  this.options.merge(options || {});
  
  this.list = document.createElement('ul');
  this.list.addEventListener('click',     this.onChoice.bind(this),       false);
  this.list.addEventListener('mouseover', this.hoverSelection.bind(this), false);
  
  this.input = misago.$(input);
  this.input.addEventListener('keyup', this.onInput.bind(this), false);
  
  this.ajax = new Ajax({
    url: url,
    onSuccess: this.updateList.bind(this)
  });
  this.debouncedRequest = this.request.debounce(500, this);
  this.picker = new UI.Picker(this.input, {className: 'autocompleter'});
  
  this.selection = null;
}

UI.Autocompleter.prototype.getToken = function() {
  return this.input.value;
}

UI.Autocompleter.prototype.setToken = function(token) {
  return this.input.value = token;
}

UI.Autocompleter.prototype.onInput = function(evt)
{
  switch(evt.keyCode)
  {
    case 8: case 37: case 39: case 46: return; // backspace, left, right, delete
    case 38: this.moveSelectionUp();   return; // up
    case 40: this.moveSelectionDown(); return; // down
    case 13: this.chooseSelection();   return; // enter
    case 27: this.cancel();            return; // esc
  }
  this.debouncedRequest();
}

UI.Autocompleter.prototype.request = function()
{
  this.ajax.abort();
  
  var token = this.getToken();
  if (token.length >= this.options.minChars)
  {
    var data = {};
    data[this.options.param] = token;
    this.ajax[this.options.method](data);
  }
}

UI.Autocompleter.prototype.updateList = function(html)
{
  this.list.innerHTML = html;
  
  var elements = this.list.getElementsByTagName('li');
  if (elements.length > 0)
  {
    this.markSelection(elements[0]);
    this.picker.setContent(this.list);
    this.picker.display();
  }
  else {
    this.cancel();
  }
}

UI.Autocompleter.prototype.onChoice = function(evt)
{
  if (evt.target.tagName.toUpperCase() == 'LI')
  {
    this.selection = evt.target;
    this.chooseSelection();
  }
}

UI.Autocompleter.prototype.markSelection = function(selection)
{
  if (this.selection) {
    this.selection.removeClassName('selected');
  }
  
  this.selection = selection;
  this.selection.addClassName('selected');
}

UI.Autocompleter.prototype.hoverSelection = function(evt)
{
  if (evt.target.tagName.toUpperCase() == 'LI') {
    this.markSelection(evt.target);
  }
}

UI.Autocompleter.prototype.moveSelectionUp = function()
{
  if (this.selection)
  {
    var previousElementSibling = this.selection.get('previousElementSibling');
    if (previousElementSibling) {
      this.markSelection(previousElementSibling)
    }
  }
}

UI.Autocompleter.prototype.moveSelectionDown = function()
{
  if (this.selection)
  {
    var nextElementSibling = this.selection.get('nextElementSibling');
    if (nextElementSibling) {
      this.markSelection(nextElementSibling)
    }
  }
}

UI.Autocompleter.prototype.chooseSelection = function()
{
  if (this.selection)
  {
    var token = this.selection.innerHTML;
    this.setToken(token);
    this.cancel();
  }
}

UI.Autocompleter.prototype.cancel = function()
{
  this.picker.hide();
  this.list.innerHTML = '';
  this.selection = null;
}

