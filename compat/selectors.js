/**
 * Originaly developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
 * 
 * TODO: Implement querySelectorAll() when missing.
 */

if (!document.getElementsByClassName)
{
  if (document.querySelectorAll)
  {
    // querySelectorAll (MSIE 8)
		misago.getElementsByClassName = function(parent, className)
		{
		  var classes = className.split(" ");
		  var cssRule = "";
		  
			for (var i=0, ilen = classes.length; i<ilen; i++) {
			  cssRule += "." + classes[i];
			}
		  return parent.querySelectorAll(cssRule);
		}
  }
	else if (document.evaluate)
	{
		// XPATH (Firefox 2, etc.)
		misago.getElementsByClassName = function(parent, className)
		{
			var classes = className.split(" ");
			var classesToCheck = "";
			var xhtmlNamespace = "http://www.w3.org/1999/xhtml";
			var namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace) ? xhtmlNamespace : null;
			var returnElements = [];
			var elements;
			var node;
			
			for (var i=0, ilen = classes.length; i<ilen; i++) {
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[i] + " ')]";
			}
			
			try	{
				elements = document.evaluate(".//*" + classesToCheck, parent, namespaceResolver, 0, null);
			}
			catch (e) {
				elements = document.evaluate(".//*" + classesToCheck, parent, null, 0, null);
			}
			
			while ((node = elements.iterateNext())) {
				returnElements.push(node);
			}
			return new misago.NodeList(returnElements);
		}
	}
	else
	{
		// DOM PARSING (IE6, IE7, etc.)
		misago.getElementsByClassName = function(parent, className)
		{
			var classes = className.split(" ");
			var classesToCheck = [];
			var elements = (parent.all) ? parent.all : parent.getElementsByTagName('*');
			var current;
			var returnElements = [];
			var match;
			
			for (var i=0, ilen=classes.length; i<ilen; i++) {
				classesToCheck.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)", 'i'));
			}
			
			for (var i=0, ilen=elements.length; i<ilen; i++)
			{
				current = elements[i];
				match   = false;
				
				for (var j=0, jlen=classesToCheck.length; j<jlen; j++)
				{
					match = classesToCheck[j].test(current.className);
					if (!match) {
						break;
					}
				}
				
				if (match) {
					returnElements.push(current);
				}
			}
			
			returnElements = misago.extendElements ? misago.extendElements(returnElements) : returnElements;
			return new misago.NodeList(returnElements);
		}
	}
	
	Element.prototype.getElementsByClassName = function(className) {
		return misago.getElementsByClassName(this, className);
	}
	
	document.getElementsByClassName = function(className) {
		return misago.getElementsByClassName(document, className);
	}
}

if (!Element.prototype.querySelectorAll)
{
  /**
   * NOTE: querySelectorAll is currently limited to the descendant operator.
   */
  misago.querySelectorAll = function(cssRule)
  {
    if (typeof cssRule == 'undefined' || !cssRule || cssRule.length == 0) {
      throw new Error("Missing parameter cssRule in querySelectorAll().");
    }
    
    // search starts at the root of document:
    var foundElements = [document];
    
    // breaks the cssRule in parts (each one separated by an operator)
    var cssParts = parseCssRule(cssRule);
    
    for (var i=0, ilen=cssParts.length; i<ilen; i++)
    {
      var newElements = [];
      
      // breaks the cssPart in smaller parts (eg: tag#id.className.className)
      var cssPart    = cssParts[i];
      var innerParts = parseCssPart(cssPart);
      
      // for each parent: finds childs that match the current cssPart
      foundElements.forEach(function(element)
      {
        var currentElements = [element];
        
        // remember: the css part itself is separated in smaller parts (which act as filters)
        for (var j=0, jlen=innerParts.length; j<jlen; j++)
        {
          var innerPart = innerParts[j];
          currentElements = misago.querySelectorAll.selectors[innerPart.selector].call(element, innerPart.name);
          
          // found nothing: skip next filters
          if (currentElements.length === 0) {
            break;
          }
        }
        
        mergeArrays(newElements, currentElements);
      });
      
      foundElements = newElements;
      
      // found nothing: skip deeper parts
      if (foundElements.length === 0) {
        break;
      }
    }
    
		foundElements = misago.extendElements ? misago.extendElements(foundElements) : foundElements;
		return new misago.NodeList(foundElements);
		
		
		function parseCssRule(cssRule)
		{
      var cssParts = cssRule.split(/\s+/);
		  return cssParts;
		}
		
		function parseCssPart(cssPart)
		{
      var parts = cssPart.split(/(\#|\.)/);
      var innerParts = [];
      
      for (var i=0, ilen=parts.length; i<ilen; i++)
      {
        var innerPart = {};
        
        switch(parts[i])
        {
          case '': continue;
          case '#': innerPart.selector = 'id';        innerPart.name = parts[++i]; break;
          case '.': innerPart.selector = 'className'; innerPart.name = parts[++i]; break;
          default:  innerPart.selector = 'tagName';   innerPart.name = parts[i];
        }
        innerParts.push(innerPart);
      }
      return innerParts;
		}
		
    function mergeArrays(ary, newAry)
    {
      Array.prototype.forEach.call(newAry, function(elm)
      {
        if (ary.indexOf(elm) == -1) {
          ary.push(elm);
        }
      });
      return ary;
    }
  }
  
  
  misago.querySelectorAll.selectors = {};
  misago.querySelectorAll.selectors.id = function(id)
  {
    var elm = document.getElementById(id);
    return elm ? [elm] : [];
  }
  misago.querySelectorAll.selectors.tagName = function(tagName) {
    return this.getElementsByTagName(tagName);
  }
  misago.querySelectorAll.selectors.className = function(className) {
    return this.getElementsByClassName(className);
  }
  
  
  misago.querySelectorAll.operators = {};
  misago.querySelectorAll.operators.descendant = function(cssPart)
  {
    
  }
  
  
  Element.prototype.querySelectorAll = function(cssRule) {
    return misago.querySelectorAll.apply(this, arguments);
  }
  
  document.querySelectorAll = function(cssRule) {
    return misago.querySelectorAll.apply(document, arguments);
  }
}

