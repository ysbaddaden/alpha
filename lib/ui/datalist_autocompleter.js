// Autocompletes within the options of a fixed datalist.
Alpha.UI.LocalDatalistAutocompleter = function(input)
{
  this.input    = input;
  this.datalist = document.getElementById(input.getAttribute('list'));
  this.select   = this.datalist.getElementsByTagName('select')[0];
  
  this.parseDatalistOptions();
  this.previous_value = '';
  
  this.input.addEventListener('keyup', this.onType.bind(this), false);
}

Alpha.UI.LocalDatalistAutocompleter.prototype.onType = function(evt)
{
  var value = this.input.value.trim();
  if (value != this.previous_value)
  {
//    var fragment = Alpha.browser.ie ? document.createDocumentFragment() : document.createElement('div');
    var fragment = document.createDocumentFragment();
    
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
      this.select.innerHTML = '';
      (this.select || this.datalist).appendChild(fragment);
//    }
//    else {
//      this.select.innerHTML = fragment.innerHTML;
//    }
    
    this.previous_value = value;
  }
}

Alpha.UI.LocalDatalistAutocompleter.prototype.parseDatalistOptions = function()
{
  this.options = [];
  var options = this.datalist.getElementsByTagName('option');
  
  Array.prototype.forEach.call(options, function(option) {
    this.options.push({value: option.value, html: option.innerHTML});
  }, this);
}

// Updates a datalist through remote HTTP calls like:
// 
//   GET /users/autocomplete?q=ju
// 
// Options:
// 
// - url   - (required)
// - param - (defaults to +input.name+)
// 
// Server is supposed to return an HTML fragment like:
// 
//   <option>Jules</option>
//   <option>Julien</option>
// 
Alpha.UI.RemoteDatalistAutocompleter = function(input, options)
{
  this.url      = options.url;
  this.param    = options.param || input.name;
  this.minChars = options.minChars || 2;
  
  this.input    = input;
  this.datalist = document.getElementById(input.getAttribute('list'));
  this.select   = this.datalist.getElementsByTagName('select')[0];
  
  this.input.addEventListener('keyup', this.onType.bind(this), false);
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.onType = function(event)
{
  if (this.input.value.length >= this.minChars) {
    this.callRemote();
  }
  else {
    this.resetDatalistOptions();
  }
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.requestURL = function()
{
  var data = encodeURIComponent(this.param) + '=' + encodeURIComponent(this.input.value.trim());
  return this.url + ((this.url.indexOf('?') == -1) ? '?' : '&') + data;
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.callRemote = function()
{
  if (this.xhr) {
    this.xhr.abort
  }
  this.xhr = new XMLHttpRequest();
  this.xhr.open('GET', this.requestURL(), true);
  this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  this.xhr.onreadystatechange = this.callback.bind(this);
  this.xhr.send('');
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.callback = function(html)
{
  if (this.xhr.readyState == 4 && this.xhr.status == 200) {
    this.setDatalistOptions(this.xhr.responseText);
  }
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.setDatalistOptions = function(html) {
  (this.select || this.datalist).innerHTML = html;
}

Alpha.UI.RemoteDatalistAutocompleter.prototype.resetDatalistOptions = function() {
  this.setDatalistOptions('');
}

