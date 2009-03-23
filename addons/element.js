
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

Element.prototype.getPosition = function(parent)
{
  var position = {x: 0, y: 0};
  if (this.offsetParent)
  {
    var obj = this;
    do
    {
      position.x += obj.offsetLeft;
      position.y += obj.offsetTop;
    }
    while (obj = obj.offsetParent)
  }
  return position;
}

