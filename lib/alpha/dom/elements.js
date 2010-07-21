
(function()
{
  var elm = document.createElement('div');
  
  if (typeof elm.textContent == 'undefined')
  {
    Element.prototype._Alpha_get_textContent = function ()
    {
      if (typeof this.innerText == 'undefined') {
        return this.innerText;
      }
      var r = this.ownerDocument.createRange();
      r.selectNodeContents(this);
      return r.toString();
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'textContent', {
        get: Element.prototype._Alpha_get_textContent});
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('textContent',
        Element.prototype._Alpha_get_textContent);
    }
  }
  
  if (typeof elm.children == 'undefined')
  {
    Element.prototype._Alpha_get_children = function()
    {
      var children = [];
      var child = this.firstChild;
      while (child)
      {
        if (child.nodeType == 1) {
          children.push(child);
        }
        child = child.nextSibling;
      }
      return Alpha.extendElements ? Alpha.extendElements(children) : children;
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'children', {
        get: Element.prototype._Alpha_get_children});
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('children',
        Element.prototype._Alpha_get_children);
    }
  }

  if (typeof elm.childElementCount == 'undefined')
  {
    Element.prototype._Alpha_get_childElementCount = function() {
      return this.children.length;
    }

    Element.prototype._Alpha_get_firstElementChild = function()
    {
      var child = this.firstChild;
      while (child && child.nodeType != 1) {
        child = child.nextSibling;
      }
      return (child && child.nodeType == 1) ? Alpha.$(child) : null;
    }

    Element.prototype._Alpha_get_lastElementChild = function()
    {
      var child = this.lastChild;
      while (child && child.nodeType != 1) {
        child = child.previousSibling;
      }
      return (child && child.nodeType == 1) ? Alpha.$(child) : null;
    }

    Element.prototype._Alpha_get_nextElementSibling = function()
    {
      var sibling = this.nextSibling;
      while (sibling && sibling.nodeType != 1) {
        sibling = sibling.nextSibling;
      }
      return (sibling && sibling.nodeType == 1) ? Alpha.$(sibling) : null;
    }

    Element.prototype._Alpha_get_previousElementSibling = function()
    {
      var sibling = this.previousSibling;
      while (sibling && sibling.nodeType != 1) {
        sibling = sibling.previousSibling;
      }
      return (sibling && sibling.nodeType == 1) ? Alpha.$(sibling) : null;
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'childElementCount',      {get: Element.prototype._Alpha_get_childElementCount});
      Object.defineProperty(Element.prototype, 'firstElementChild',      {get: Element.prototype._Alpha_get_firstElementChild});
      Object.defineProperty(Element.prototype, 'lastElementChild',       {get: Element.prototype._Alpha_get_lastElementChild});
      Object.defineProperty(Element.prototype, 'nextElementSibling',     {get: Element.prototype._Alpha_get_nextElementSibling});
      Object.defineProperty(Element.prototype, 'previousElementSibling', {get: Element.prototype._Alpha_get_previousElementSibling});
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('childElementCount',      Element.prototype._Alpha_get_childElementCount);
      Element.prototype.__defineGetter__('firstElementChild',      Element.prototype._Alpha_get_firstElementChild);
      Element.prototype.__defineGetter__('lastElementChild',       Element.prototype._Alpha_get_lastElementChild);
      Element.prototype.__defineGetter__('nextElementSibling',     Element.prototype._Alpha_get_nextElementSibling);
      Element.prototype.__defineGetter__('previousElementSibling', Element.prototype._Alpha_get_previousElementSibling);
    }
  }
  
  // makes getAttribute('class') and setAttribute('class') to work in IE < 8
  elm.className = 'something';
  
  if (elm.getAttribute('class') != 'something')
  {
    Element.prototype.getAttribute = function(attr)
    {
      if (attr.toLowerCase() == 'class') {
        attr = 'className';
      }
      return this._Alpha_getAttribute(attr);
    }
    
    Element.prototype.setAttribute = function(attr, value)
    {
      if (attr.toLowerCase() == 'class') {
        attr = 'className';
      }
      return this._Alpha_setAttribute(attr, value);
    }
  }

  // elm.hasAttribute(name) is missing in IE < 8
  if (typeof elm.hasAttribute == 'undefined')
  {
    Element.prototype.hasAttribute = function(attr) {
      return (typeof this.getAttribute(attr) == 'undefined') ? false : true;
    }
  }
})();

/**
 * Returns attributes as extended elements. Also permits
 * to create pseudo getters in MSIE < 8.
 * 
 * Use only if you want or need compatibility with MSIE < 8.
 * 
 *   elm.get('nextSibling');
 *   elm.get('parentNode');
 *   elm.get('children');
 *   elm.get('nextElementSibling');
 * 
 * You may also use the following syntax, in order to restricy loading of this
 * file only to Internet Explorer 6 and 7:
 * 
 *   elm.get ? elm.get('nextSibling') : elm.nextSibling
 */
Element.prototype.get = function(attribute)
{
  if (this['_Alpha_get_' + attribute]) {
    return this['_Alpha_get_' + attribute]();
  }
  
  if (typeof this[attribute] != 'undefined')
  {
    if (this[attribute] && this[attribute].nodeType == 1) {
      return Alpha.$(this[attribute]);
    }
    return this[attribute];
  }
}

