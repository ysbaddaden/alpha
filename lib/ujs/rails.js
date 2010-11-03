/*
 * Library agnostic RAILS UJS.
 * 
 * Based on prototype-ujs http://github.com/rails/prototype-ujs/
 * 
 * requires: addons/serializer.js
 * 
 * Non standard browsers (ie. Internet Explorer < 9) also require:
 * 
 * requires: alpha/core.js
 * requires: alpha/dom/dom.js
 * requires: alpha/dom/element.js
 * requires: alpha/dom/event.js
 * requires: alpha/selectors/sly.js
 * requires: alpha/xmlhttprequest.js
 * 
 * FIXME: [data-remote] forms with GET method: are params passed?
 */

(function()
{
  var csrf_token = rails_read_meta_content('csrf-token'),
    csrf_param = rails_read_meta_content('csrf-param'),
    div = document.createElement('div');

  document.body.addEventListener('click', rails_onclick, false);
  document.body.addEventListener('ajax:complete', rails_ajax_complete, false);

  if (typeof div['onsubmit'] != 'undefined') {
    document.body.addEventListener('submit', rails_onsubmit, false);
  }
  else
  {
    // submit events don't bubble in IE6, we thus listen for focus (which bubble) to attach one
    document.body.addEventListener('focusin', function(event)
    {
      var tagName = event.target.tagName.toUpperCase();

      if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA' || tagName == 'FORM')
      {
        var form = event.target;
        
        while (form && form.tagName && form.tagName.toUpperCase() != 'FORM') {
          form = form.parentNode;
        }
        
        form = Alpha.$(form);
        
        if (form && !form.hasAttribute('data-rails-onsubmit'))
        {
          form.setAttribute('data-rails-onsubmit', '1');
          form.addEventListener('submit', rails_onsubmit, false);
        }
      }
    }, false);
  }

  function rails_onclick(event)
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
          rails_call_remote(target);
          break;
        }
        else if (target.hasAttribute('data-method'))
        {
          event.preventDefault();
          rails_call_with_method(target)
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
  }

  function rails_onsubmit(event)
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
      rails_call_remote(form);
    }
  }

  function rails_ajax_complete(event)
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
  }

  function rails_call_remote(element)
  {
    if (!rails_dispatch_ajax_event('before', element)) {
      return false;
    }
    
    var method, url, params = new Alpha.Serializer();
    
    if (element.nodeName.toLowerCase() == 'form')
    {
      method = (element.method || 'post').toLowerCase();
      url = element.action;
      params.serialize(element);
    }
    else
    {
      method = (element.getAttribute('data-method') || 'get').toLowerCase();
      url = element.href;
    }
    if (method != 'get' && method != 'post')
    {
      params.append('_method', method);
      method = 'post';
    }
    
    if (method == 'get')
    {
      var s = url.split('#', 2);
      url = s[0];
      url += (s[0].indexOf('?') == -1) ? '?' : '&';
      url += params.toString();
      
      if (s.length == 2) {
        url += '#' + s[1];
      }
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//    if (method == 'POST') {
//      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    }
    xhr.onreadystatechange = function()
    {
      if (xhr.readyState == 4)
      {
        rails_dispatch_ajax_event('complete', element, xhr);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          rails_dispatch_ajax_event('success', element, xhr);
        }
        else {
          rails_dispatch_ajax_event('failure', element, xhr);
        }
      }
    }
    xhr.send(method == 'post' ? params.toString() : '')
    
    rails_dispatch_ajax_event('after', element);
  }

  function rails_dispatch_ajax_event(type, element, memo)
  {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('ajax:' + type, true, true);
    if (memo) {
      event.memo = memo;
    }
    return element.dispatchEvent(event);
  }

  function rails_call_with_method(element)
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

  function rails_read_meta_content(name)
  {
    var meta = document.querySelectorAll("meta[name=" + name + "]");
    return (meta.length > 0) ? meta[0].getAttribute('content') : null;
  }
})();
