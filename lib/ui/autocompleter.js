// Autocompletes within the options of a fixed datalist.
// 
// TODO: Alpha.UI.RemoteAutocompleter, which would request data through XMLHttpRequest.
Alpha.UI.LocalAutocompleter = function(input)
{
  this.input = input;
  this.datalist = document.getElementById(input.getAttribute('list'));
  this.select = this.datalist.getElementsByTagName('select')[0];
  
  this.parseDatalistOptions();
  this.previous_value = '';
  
  this.input.addEventListener('keyup', this.onType.bind(this), false);
}

// IMPROVE: find a better cross-browser method to update the select list.
Alpha.UI.LocalAutocompleter.prototype.onType = function(evt)
{
  var value = this.input.value.trim();
  if (value != this.previous_value)
  {
//    var fragment = Alpha.browser.ie ? document.createDocumentFragment() : document.createElement('div');
    var fragment = document.createElement('div');
    
    var re = new RegExp('^' + value.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1'), 'i');
    this.options.forEach(function(opt)
    {
      if (opt.html.match(re))
      {
        var option = document.createElement('option');
        option.value = opt.value;
        option.innerHTML = opt.html;
        fragment.appendChild(option);
      }
    }, this);
    
//    if (Alpha.browser.ie)
//    {
//      this.select.innerHTML = '';
//      (this.select || this.datalist).appendChild(fragment);
//    }
//    else {
      this.select.innerHTML = fragment.innerHTML;
//    }
    
    this.previous_value = value;
  }
}

Alpha.UI.LocalAutocompleter.prototype.parseDatalistOptions = function()
{
  this.options = [];
  Array.prototype.forEach.call(this.datalist.getElementsByTagName('option'), function(option) {
    this.options.push({value: option.value, html: option.innerHTML});
  }, this);
}

/*
// FIXME: use XMLHttpRequest instead of Alpha.Ajax
// FIXME: use elm.get ? elm.get('xxx') : elm.xxx

Alpha.UI.LocalAutocompleter = function(input, url, options) {
  this.initialize(input, url, options);
}

Alpha.UI.LocalAutocompleter.prototype.initialize = function(input, url, options)
{
  if (typeof input == 'undefined') {
    throw new Error("Alpha.UI.LocalAutocompleter: missing parameter 'input'.");
  }
  if (typeof url == 'undefined') {
    throw new Error("Alpha.UI.LocalAutocompleter: missing parameter 'url'.");
  }
  
  this.options = {
    method:   'get',
    param:    'token',
    minChars: 1,
    multipleTokens: false,
    tokenSeparator: ',',
    className: '',
    onSelection: function(selection, token) {}
  };
  Alpha.mergeObjects(this.options, options || {});
  
  this.list = document.createElement('ul');
  this.list.addEventListener('click',     this.onChoice.bind(this),       false);
  this.list.addEventListener('mouseover', this.hoverSelection.bind(this), false);
  
  this.input = Alpha.$(input);
  this.input.addEventListener('keypress', this.onInput.bind(this), false);
  
  this.ajax = new Alpha.Ajax({
    url: url,
    onSuccess: this.updateList.bind(this)
  });
  this.debouncedRequest = this.request.debounce(500, this);
  this.picker = new Alpha.UI.Picker(this.input, {
    className: 'autocompleter ' + this.options.className
  });
  
  this.selection = null;
}

Alpha.UI.LocalAutocompleter.prototype.setUrl = function(url) {
  this.ajax.options.url = url;
}

Alpha.UI.LocalAutocompleter.prototype.getToken = function()
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

Alpha.UI.LocalAutocompleter.prototype.setToken = function(token)
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

// IMPROVE: If multipleTokens & left/right keyCode: cancel if we changed from one token to another.
Alpha.UI.LocalAutocompleter.prototype.onInput = function(evt)
{
  switch(evt.keyCode)
  {
    case 8: case 37: case 39: case 46: return; // backspace, left, right, delete
    case 38: this.moveSelectionUp();   return; // up
    case 40: this.moveSelectionDown(); return; // down
    case 13: this.chooseSelection(); evt.stopPropagation(); evt.preventDefault(); return; // enter
    case 27: this.cancel(); evt.stopPropagation(); evt.preventDefault(); return; // esc
    default:
      if (this.options.multipleTokens
        && String.fromCharCode(evt.which) == this.options.tokenSeparator)
      {
        this.cancel();
        return;
      }
  }
  this.debouncedRequest();
}

Alpha.UI.LocalAutocompleter.prototype.request = function()
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

Alpha.UI.LocalAutocompleter.prototype.updateList = function(html)
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

Alpha.UI.LocalAutocompleter.prototype.onChoice = function(evt)
{
  if (evt.target.tagName.toUpperCase() == 'LI')
  {
    this.selection = evt.target;
    this.chooseSelection();
  }
}

Alpha.UI.LocalAutocompleter.prototype.markSelection = function(selection)
{
  if (this.selection) {
    this.selection.removeClassName('selected');
  }
  this.selection = selection;
  this.selection.addClassName('selected');
}

Alpha.UI.LocalAutocompleter.prototype.hoverSelection = function(evt)
{
  if (evt.target.tagName.toUpperCase() == 'LI') {
    this.markSelection(evt.target);
  }
}

Alpha.UI.LocalAutocompleter.prototype.moveSelectionUp = function()
{
  if (this.selection)
  {
    var previousElementSibling = this.selection.get('previousElementSibling');
    if (previousElementSibling) {
      this.markSelection(previousElementSibling)
    }
  }
}

Alpha.UI.LocalAutocompleter.prototype.moveSelectionDown = function()
{
  if (this.selection)
  {
    var nextElementSibling = this.selection.get('nextElementSibling');
    if (nextElementSibling) {
      this.markSelection(nextElementSibling)
    }
  }
}

Alpha.UI.LocalAutocompleter.prototype.chooseSelection = function()
{
  if (this.selection)
  {
    var token = this.selection.textContent;
    this.setToken(token);
    this.options.onSelection(this.selection, token);
    this.cancel();
  }
}

Alpha.UI.LocalAutocompleter.prototype.cancel = function()
{
  this.picker.hide();
  this.list.innerHTML = '';
  this.selection = null;
}
*/
