/*
 * Library agnostic RAILS UJS.
 * 
 * TODO: [data-remote] add support for non GET requests [data-method].
 * TODO: [data-remote] on ajax:after reenable disabled inputs [data-disable-with].
 * 
 * Non standard browsers (like IE < 9) do require the following:
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
      
      nodeName = target.nodeName.toLowerCase();
      if (nodeName == 'a')
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
      else if (nodeName == 'input' && target.type == 'submit')
      {
        if (target.hasAttribute('data-disable-with'))
        {
          target.disabled = true;
          target.setAttribute('data-original-value', target.value);
          target.value = target.getAttribute('data-disable-with');
        }
      }
      target = target.get ? target.get('parentNode') : target.parentNode;
    }
    while(target.parentNode && target != this)
  }, false);

  document.body.addEventListener('submit', function(event)
  {
    var target = event.target;
    do
    {
      if (target.nodeName.toLowerCase() == 'form'
        && target.getAttribute('data-remote') == 'true')
      {
        event.preventDefault();
        callRemote(target);
        break;
      }
      target = target.get ? target.get('parentNode') : target.parentNode;
    }
    while(target.parentNode && target != this)
  }, false);

  function callRemote(element)
  {
    var method = element.method || element.getAttribute('data-method') || 'GET';
    var url = element.action || element.href;
    
    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function()
    {
      switch (this.readyState)
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
          dispatchAjaxEvent('after', element, this);
        break;
      }
    }
    dispatchAjaxEvent('before', element, this);
    xhr.send();
  }

  function dispatchAjaxEvent(type, element, memo)
  {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('ajax:' + type, true, true);
    event.memo = memo;
    element.dispatchEvent(event);
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
})();
