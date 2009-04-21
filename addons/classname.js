
if (!Element.prototype.hasClassName)
{
  Element.prototype.hasClassName = function(className)
  {
	  var re = new RegExp("(^|\\s)" + className + "(\\s|$)", 'i');
	  return re.test(this.className);
  }
}

if (!Element.prototype.addClassName)
{
  Element.prototype.addClassName = function(className)
  {
	  if (!this.hasClassName(className))
	  {
		  this.className += ' ' + className;
		  this.className = this.className.replace(/\s+/g, ' ');
	  }
  }
}

if (!Element.prototype.removeClassName)
{
  Element.prototype.removeClassName = function(className)
  {
	  var re = new RegExp("(^|\\s)" + className + "(\\s|$)", 'i');
	  this.className = this.className.replace(re, ' ').replace(/\s+/g, ' ');
  }
}

