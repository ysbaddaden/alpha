
if (!Element.prototype.get)
{
  /**
   * elm.get('nextSibling');
   * elm.get('parentNode');
   * elm.get('children');
   * elm.get('nextElementSibling');
   * 
   * Warning: contrary to gecko's implementations, lists aren't live!
   */
  Element.prototype.get = function(attribute)
  {
    // attribute exists
    if (this[attribute])
    {
      if (this[attribute].tagName) {
        return misago.$(this[attribute]);
      }
      return this[attribute];
    }
    
    // attribute doesn't exists
    switch(attribute)
    {
      case 'children':
        var children = [];
        var child = this.firstChild;
        while (child)
        {
          if (child.tagName) {
            children.push(child);
          }
          child = child.nextSibling;
        }
        return misago.extendElements ? misago.extendElements(children) : children;
      break;
      
      case 'childElementCount':
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
      break;
      
      case 'firstElementChild':
        var child = this.firstChild;
        while (child && !child.tagName) {
          child = child.nextSibling;
        }
        return child.tagName ? misago.$(child) : null;
      break;
      
      case 'lastElementChild':
        var child = this.lastChild;
        while (child && !child.tagName) {
          child = child.previousSibling;
        }
        return child.tagName ? misago.$(child) : null;
      break;
      
      case 'nextElementSibling':
        var sibling = this.nextSibling;
        while (sibling && !sibling.tagName) {
          sibling = sibling.nextSibling;
        }
        return (sibling && sibling.tagName) ? misago.$(sibling) : null;
      break;
      
      case 'previousElementSibling':
        var sibling = this.previousSibling;
        while (sibling && !sibling.tagName) {
          sibling = sibling.previousSibling;
        }
        return (sibling && sibling.tagName) ? misago.$(sibling) : null;
      break;
      
      case 'default':
        throw new Error("Unknown attribute: " + attribute);
    }
  }
}

if (!Element.prototype.removeNode)
{
	Element.prototype.removeNode = function()
	{
		var parent = this.parentNode;
		parent.removeChild(this);
	}
}

if (!Element.prototype.insertAfter)
{
  Element.prototype.insertAfter = function(newElement, referenceElement)
  {
    if (!referenceElement) {
      this.appendChild(newElement);
    }
    else
    {
      var nextSibling = referenceElement.nextSibling;
      this.insertBefore(newElement, nextSibling);
    }
    return newElement;
  }
}

