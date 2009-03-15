
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

