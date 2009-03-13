
Element.prototype.setStyle = function(property, value)
{
  if (typeof property == 'object')
  {
    for (var p in property) {
      this.setStyle(p, property[p]);
    }
  }
  else
  {
    if (this.filters && property == 'opacity')
    {
      this.style.cssText += ';-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (value * 100) + ')";' +
        'filter:alpha(opacity=' + (value * 100) + ');zoom:1';
    }
    else {
      this.style.cssText += ';' + property + ':' + value;
    }
  }
}

// IMPROVE: Linearize returned colors.
Element.prototype.getStyle = function(property)
{
  if (window.getComputedStyle) {
    return document.defaultView.getComputedStyle(this, null).getPropertyValue(property);
  }
  else if (this.currentStyle)
  {
    if (property == 'opacity')
    {
      var alpha = this.filters["DXImageTransform.Microsoft.Alpha"] || this.filters.alpha || {};
      return (alpha.opacity || 100) / 100;
    }
    return this.currentStyle[property.camelize()];
  }
}

