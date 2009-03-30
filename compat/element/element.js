
/**
 * Returns attributes as extended elements. Also permits
 * to create pseudo getters in MSIE < 8.
 * 
 * Use only if you want or need compatibility with MSIE < 8. 
 * 
 * elm.get('nextSibling');
 * elm.get('parentNode');
 * elm.get('children');
 * elm.get('nextElementSibling');
 */
Element.prototype.get = function(attribute)
{
  if (this['_kokone_get_' + attribute]) {
    return this['_kokone_get_' + attribute]();
  }
  
  if (this[attribute])
  {
    if (this[attribute].tagName) {
      return kokone.$(this[attribute]);
    }
    return this[attribute];
  }
  
  throw new Error("Unknown attribute: " + attribute);
}

if (!Element.prototype.children)
{
  Element.prototype._kokone_get_children = function()
  {
    var children = [];
    var child = this.firstChild;
    while (child)
    {
      if (child.tagName) {
        children.push(child);
      }
      child = child.nextSibling;
    }
    return kokone.extendElements ? kokone.extendElements(children) : children;
  }

  Element.prototype._kokone_get_childElementCount = function()
  {
    var child = this.firstChild;
    var count = 0;
    while (child)
    {
      if (child.tagName) {
        count += 1;
      }
      child = child.nextSibling;
    }
    return count;
  }

  Element.prototype._kokone_get_firstElementChild = function()
  {
    var child = this.firstChild;
    while (child && !child.tagName) {
      child = child.nextSibling;
    }
    return (child && child.tagName) ? kokone.$(child) : null;
  }

  Element.prototype._kokone_get_lastElementChild = function()
  {
    var child = this.lastChild;
    while (child && !child.tagName) {
      child = child.previousSibling;
    }
    return (child && child.tagName) ? kokone.$(child) : null;
  }

  Element.prototype._kokone_get_nextElementSibling = function()
  {
    var sibling = this.nextSibling;
    while (sibling && !sibling.tagName) {
      sibling = sibling.nextSibling;
    }
    return (sibling && sibling.tagName) ? kokone.$(sibling) : null;
  }

  Element.prototype._kokone_get_previousElementSibling = function()
  {
    var sibling = this.previousSibling;
    while (sibling && !sibling.tagName) {
      sibling = sibling.previousSibling;
    }
    return (sibling && sibling.tagName) ? kokone.$(sibling) : null;
  }
  
  if (Element.prototype.__defineGetter__)
  {
    Element.prototype.__defineGetter__('children', Element.prototype._kokone_get_children);
    Element.prototype.__defineGetter__('childElementCount', Element.prototype._kokone_get_childElementCount);
    Element.prototype.__defineGetter__('firstElementChild', Element.prototype._kokone_get_firstElementChild);
    Element.prototype.__defineGetter__('lastElementChild', Element.prototype._kokone_get_lastElementChild);
    Element.prototype.__defineGetter__('nextElementSibling', Element.prototype._kokone_get_nextElementSibling);
    Element.prototype.__defineGetter__('previousElementSibling', Element.prototype._kokone_get_previousElementSibling);
  }
}

(function()
{
  // makes getAttribute('class') and setAttribute('class') to work in IE < 8.

  var elm = document.createElement('div');
  elm.className = 'something';
  if (elm.getAttribute('class') != 'something')
  {
    kokone._msie_getAttribute = elm.getAttribute;
    Element.prototype.getAttribute = function(attr)
    {
      if (attr == 'class') {
        attr = 'className';
      }
      return this._kokone_getAttribute(attr);
    }
    
    kokone._msie_setAttribute = elm.setAttribute;
    Element.prototype.setAttribute = function(attr, value)
    {
      if (attr == 'class') {
        attr = 'className';
      }
      return this._kokone_setAttribute(attr, value);
    }
  }
})();

