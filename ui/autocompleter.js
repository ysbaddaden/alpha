
// TODO: UI.Autocompleter: Add support for multiple tokens.
// TODO: UI.Autocompleter: Inherit font properties from input (family, size).

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
    minChars: 1,
    multipleTokens: true,
    tokenSeparator: ',',
    className: '',
    onSelection: function(selection, token) {}
  };
  Object.merge(this.options, options || {});
  
  this.list = document.createElement('ul');
  this.list.addEventListener('click',     this.onChoice.bind(this),       false);
  this.list.addEventListener('mouseover', this.hoverSelection.bind(this), false);
  
  this.input = kokone.$(input);
  this.input.addEventListener('keypress', this.onInput.bind(this), false);
  
  this.ajax = new Ajax({
    url: url,
    onSuccess: this.updateList.bind(this)
  });
  this.debouncedRequest = this.request.debounce(500, this);
  this.picker = new UI.Picker(this.input, {className: 'autocompleter ' + this.options.className});
  
  this.selection = null;
}

UI.Autocompleter.prototype.setUrl = function(url)
{
  this.ajax.options.url = url;
}

UI.Autocompleter.prototype.getToken = function()
{
  var token;
  
	if (this.options.multipleTokens &&
	  this.input.value.indexOf(this.options.tokenSeparator) > -1)
	{
		// gets caret position
		var caretPosition = this.input.value.length;
		if (document.selection)
		{
			// IE
			this.input.focus();
			var sel = document.selection.createRange();
			sel.moveStart('character', -this.input.value.length);
			caretPosition = sel.text.length;
		}
		else if (this.input.selectionStart || this.input.selectionStart == '0') {
			caretPosition = this.input.selectionStart;
		}
		
		// gets currently edited token
		this.tokenIndex = this.input.value.substr(0, caretPosition).split(this.options.tokenSeparator).length - 1;
		token = this.input.value.split(this.options.tokenSeparator)[this.tokenIndex];
	}
	else {
	  token = this.input.value;
	}
  return token.trim();
}

UI.Autocompleter.prototype.setToken = function(token)
{
	if (this.options.multipleTokens &&
	  this.input.value.indexOf(this.options.tokenSeparator) > -1)
	{
		// updates edited token
		var tokens = this.input.value.split(this.options.tokenSeparator);
		tokens[this.tokenIndex] = token;
		
		// updates input
	  var separator = this.options.tokenSeparator + ' ';
		var value = '';
		for (var i = 0; i < tokens.length; i++)
		{
			tokens[i] = tokens[i].trim();
			if (tokens[i] != '') {
				value += tokens[i] + separator;
			}
		}
		this.input.value = value;
	}
	else {
    return this.input.value = token;
  }
}

// TODO: If multipleTokens & keyCode is tokenSeparator: do cancel, since we are now editing another token.
// TODO: If multipleTokens & left/right keyCode: cancel if we changed from one token to another.
UI.Autocompleter.prototype.onInput = function(evt)
{
  switch(evt.keyCode)
  {
    case 8: case 37: case 39: case 46: return; // backspace, left, right, delete
    case 38: this.moveSelectionUp();   return; // up
    case 40: this.moveSelectionDown(); return; // down
    case 13: this.chooseSelection(); evt.stopPropagation(); evt.preventDefault(); return; // enter
    case 27: this.cancel(); evt.stopPropagation(); evt.preventDefault(); return; // esc
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
    this.ajax.send(this.options.method, data);
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
    this.options.onSelection(this.selection, token);
    this.cancel();
  }
}

UI.Autocompleter.prototype.cancel = function()
{
  this.picker.hide();
  this.list.innerHTML = '';
  this.selection = null;
}

