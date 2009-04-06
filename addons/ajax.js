
var Ajax = function(options)
{
  this.options = {
    url:        null,
    async:      true,
    onComplete: function() {},
    onSuccess:  function() {},
    onFailure:  function() {}
  };
  Object.merge(this.options, options || {});
  
  this.headers = [];
  
  this.xhr = new XMLHttpRequest();
}

Ajax.prototype.setRequestHeader = function(header, value)
{
  this.headers[header] = value;
}

Ajax.prototype.onreadystatechange = function()
{
  if (this.xhr.readyState == 4)
  {
    if (this.options.update)
    {
      var elm = kokone.$(this.options.update);
      elm.innerHTML = this.xhr.responseText;
    }
    this.options.onComplete(this.xhr.responseText, this.xhr.responseXML);
    
    if (this.xhr.status >= 400) {
      this.options.onFailure(this.xhr.status);
    }
    else if (this.xhr.status >= 200) {
      this.options.onSuccess(this.xhr.responseText, this.xhr.responseXML, this.xhr.status);
    }
  }
}

Ajax.prototype.parseData = function(data)
{
  if (typeof data == 'object')
  {
    var str = [];
    if (data instanceof Array)
    {
      data.forEach(function(key) {
        str.push(key + '=' + data[key]);
      });
    }
    else
    {
      for (var key in data) {
        str.push(key + '=' + data[key]);
      }
    }
    data = str.join('&');
  }
  return data;
}

Ajax.prototype.prepareRequest = function(method, url)
{
  this.xhr.open(method.toUpperCase(), url, this.options.async);
  this.headers.forEach(function(header) {
    this.xhr.setRequestHeader(header, this.headers[value]);
  }, this);
  this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
}

Ajax.prototype.send = function(method, url, data)
{
  if (typeof url == 'object')
  {
    data = url;
    url  = null;
  }
  url = url || this.options.url;
  data = this.parseData(data);
  
  this.xhr.onreadystatechange = this.onreadystatechange.bind(this);
  this.prepareRequest(method, url);
  this.xhr.send(data);
}

/*
Ajax.prototype.get = function(url, data) {
  this.send('GET', url, data);
}

Ajax.prototype.post = function(url, data) {
  this.send('POST', url, data);
}

Ajax.prototype.put = function(url, data) {
  this.send('PUT', url, data);
}

Ajax.prototype.delete = function(url, data) {
  this.send('DELETE', url, data);
}
*/

Ajax.prototype.abort = function() {
  this.xhr.abort();
}

