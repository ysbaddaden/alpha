/*
 * Library agnostic RAILS UJS.
 * 
 * Based on prototype-ujs http://github.com/rails/prototype-ujs/
 * 
 * Non standard browsers (ie. Internet Explorer < 9) do require the following:
 * 
 * requires: compat/core.js
 * requires: compat/element/dom.js
 * requires: compat/element/element.js
 * requires: compat/element/event.js
 * requires: compat/xmlhttprequest.js
 */

(function()
{
  var csrf_token = readMetaContent('csrf-token');
  var csrf_param = readMetaContent('csrf-param');

  document.body.addEventListener('click', function(event)
  {
    var target = event.target, nodeName;
    do
    {
      if (target.hasAttribute('data-confirm')
        && !confirm(target.getAttribute('data-confirm')))
      {
        event.preventDefault();
        event.stopPropagation();
        break;
      }
      
      if (target.nodeName.toLowerCase() == 'a')
      {
        if (target.getAttribute('data-remote') == 'true')
        {
          event.preventDefault();
          callRemote(target);
          break;
        }
        else if (target.hasAttribute('data-method'))
        {
          event.preventDefault();
          callWithMethod(target)
          break;
        }
      }
      else if (target.nodeName.toLowerCase() == 'input'
        && target.type == 'submit')
      {
        target.setAttribute('submitted', true);
      }
      
      target = target.get ? target.get('parentNode') : target.parentNode;
    }
    while(target.parentNode && target != this)
  }, false);

  document.body.addEventListener('submit', function(event)
  {
    var form = event.target;
    
    var inputs = form.querySelectorAll('input[type=submit][data-disable-with]');
    Array.prototype.forEach.call(inputs, function(input)
    {
      input.disabled = true;
      input.setAttribute('data-original-value', input.value);
      input.value = input.getAttribute('data-disable-with');
    });
    
    if (form.getAttribute('data-remote') == 'true')
    {
      event.preventDefault();
      callRemote(form);
    }
  }, false);

  document.addEventListener('ajax:after', function(event)
  {
    var inputs = event.target.querySelectorAll('input[type=submit]');
    Array.prototype.forEach.call(inputs, function(input) {
      input.removeAttribute('submitted');
    });
    
    var inputs = event.target.querySelectorAll('input[type=submit][data-disable-with]');
    Array.prototype.forEach.call(inputs, function(input)
    {
      if (!input.disabled) return;
      input.value = input.getAttribute('data-original-value');
      input.removeAttribute('data-original-value');
      input.disabled = false;
    });
  }, false);

  function callRemote(element)
  {
    if (!dispatchAjaxEvent('before', element)) {
      return false;
    }
    
    var method, url, params = new Serializer();
    
    if (element.nodeName.toLowerCase() == 'form')
    {
      method = element.method || 'POST';
      url = element.action;
      params.serialize(element);
    }
    else
    {
      method = element.getAttribute('data-method') || 'GET';
      url = element.href;
    }
    if (method != 'GET' && method != 'POST')
    {
      params.append('_method', method);
      method = 'POST';
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function()
    {
      switch (xhr.readyState)
      {
        case 1: dispatchAjaxEvent('loading', element, this); break;
        case 2: dispatchAjaxEvent('loaded', element, this); break;
        case 3: dispatchAjaxEvent('interactive', element, this); break;
        case 4:
          dispatchAjaxEvent('complete', element, this);
          
          if (this.status >= 200 && this.status < 300) {
            dispatchAjaxEvent('success', element, this);
          }
          else {
            dispatchAjaxEvent('failure', element, this);
          }
          
          dispatchAjaxEvent('after', element);
        break;
      }
    }
    if (method == 'POST')
    {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(params.toString())
    }
    else {
      xhr.send()
    }
  }

  function dispatchAjaxEvent(type, element, memo)
  {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('ajax:' + type, true, true);
    if (memo) {
      event.memo = memo;
    }
    return element.dispatchEvent(event);
  }

  function callWithMethod(element)
  {
    var form = document.createElement('form');
    form.action = element.href;
    form.method = 'POST';
    form.style.cssText += ';display:none;';
    
    var html = '<input type="hidden" name="_method" value="' + element.getAttribute('data-method') + '"/>';
    if (csrf_param && csrf_token) {
      html += '<input type="hidden" name="'+ csrf_param +'" value="' + csrf_token + '"/>';
    }
    form.innerHTML = html;
    
    element.parentNode.appendChild(form);
    form.submit();
  }

  function readMetaContent(name)
  {
    var meta = document.querySelectorAll("meta[name=csrf-token]");
    return (meta.length > 0) ? meta[0].getAttribute('content') : null;
  }

  function Serializer() {
    this.data = '';
  }
  Serializer.prototype.serialize = function(form)
  {
    var inputs = form.querySelectorAll('input, select, textarea');
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
        var options = input.getElementsByTagName('option');
        Array.prototype.forEach.call(options, function(option)
        {
          if (option.selected) {
            this.append(input.name, option.value);
          }
        });
      }
      else {
        this.append(input.name, input.value);
      }
    }, this);
  }
  Serializer.prototype.append = function(key, value)
  {
    if (value !== null) {
      this.data += (this.data ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
  }
  Serializer.prototype.toString = function() {
    return this.data;
  }
})();
