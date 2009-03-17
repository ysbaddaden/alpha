/**
 * Original code of getElementsByClassName developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
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
   * TODO: Handle pseudo selectors.
   */
  misago.querySelectorAll = function(cssRules)
  {
    if (typeof cssRules == 'undefined' || !cssRules || cssRules.length == 0) {
      throw new Error("Missing parameter cssRule in querySelectorAll().");
    }
    
    var foundElements = [];
    cssRules = cssRules.split(',');
    cssRules.forEach(function(cssRule)
    {
      cssRule = cssRule.replace(/^\s+|\s+$/, '');
      var newElements = execute(cssRule);
      foundElements   = mergeArrays(foundElements, newElements);
    });
    
    foundElements = misago.extendElements ? misago.extendElements(foundElements) : foundElements;
    return new misago.NodeList(foundElements);
    
    
    function execute(cssRule)
    {
      // search starts at the root of document:
      var foundElements = [document];
      
      // breaks the cssRule in parts (each one separated by an operator)
      var cssParts = parseCssRule(cssRule);
      
      for (var i=0, ilen=cssParts.length; i<ilen; i++)
      {
        var newElements = [];
        
        // breaks the cssPart in smaller parts (eg: tag#id.className.className)
        var cssPart    = cssParts[i];
        var cssFilters = parseCssPart(cssPart.name);
        
        // for each parent: finds childs that match the current cssPart
        foundElements.forEach(function(element)
        {
          var currentElements = searchElements(element, cssFilters, cssPart.operator);
          if (currentElements) {
            mergeArrays(newElements, currentElements);
          }
        });
        
        foundElements = newElements;
        
        // found nothing: skip deeper parts
        if (foundElements.length === 0) {
          break;
        }
      }
      
      return foundElements;
    }
    
    function searchElements(parent, cssFilters, operator)
    {
      var elements = misago.querySelectorAll.operators[operator](parent, cssFilters[0]);
      return Array.prototype.filter.call(elements, function(element)
      {
        for (var i=1, ilen=cssFilters.length; i<ilen; i++)
        {
          if (!misago.querySelectorAll.selectors.filter.call(element, cssFilters[i])) {
            return false;
          }
        }
        return true;
      });
    }
    
    function parseCssRule(cssRule)
    {
      var parts = cssRule.split(/\s+|\s*(\>|\+|\~(?![=]))\s*/);
      var cssParts = [];
      
      for (var i=0, ilen=parts.length; i<ilen; i++)
      {
        var cssPart = {};
        
        switch(parts[i])
        {
          case '': continue;
          case '>': cssPart.operator = 'child';      cssPart.name = parts[++i]; break;
          case '+': cssPart.operator = 'adjacent';   cssPart.name = parts[++i]; break;
//          case '~': cssPart.operator = 'sibling';    cssPart.name = parts[++i]; break;
          case '~': throw new Error('The ~ operator has been disabled for performance reasons.'); break;
          default:  cssPart.operator = 'descendant'; cssPart.name = parts[i];
        }
        cssParts.push(cssPart);
      }
      return cssParts;
    }
    
    function parseCssPart(cssPart)
    {
      var parts = cssPart.replace(/]/g, '').split(/(\#|\.|\[|\:)/);
      var innerParts = [];
      
      for (var i=0, ilen=parts.length; i<ilen; i++)
      {
        switch(parts[i])
        {
          case '': continue;
          
          case '#':
            innerParts.unshift({selector: 'id', name: parts[++i]});
            continue;
          
          case '.':
            innerParts.push({selector: 'className', name: parts[++i]});
            continue;
          
          case '[':
            var part = {
              selector: 'attribute',
              name: parts[++i]
            };
            var match = part.name.match(/^([^~|]+)((?:~|\||)=)(.+)$/);
            if (match)
            {
              part.name     = match[1];
              part.operator = match[2];
              part.value    = match[3];
            }
            innerParts.push(part);
            continue;
          
          case ':':
            innerParts.push({selector: 'pseudoSelector', name: parts[++i]});
            continue;
          
          default:
            innerParts.push({selector: 'tagName', name: parts[i]});
            continue;
        }
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
  
  misago.querySelectorAll.selectors =
  {
    search: function(cssFilter) {
      return misago.querySelectorAll.selectors.searches[cssFilter.selector].call(this, cssFilter.name);
    },
    
    filter: function(cssFilter)
    {
      if (misago.querySelectorAll.selectors.filters[cssFilter.selector]) {
        return misago.querySelectorAll.selectors.filters[cssFilter.selector].call(this, cssFilter);
      }
      throw new Error("Unknown or unsupported CSS selector: " + cssFilter.selector + ".");
    }
  };
  
  misago.querySelectorAll.selectors.searches =
  {
    id: function(id)
    {
      var elm = document.getElementById(id);
      return elm ? [elm] : [];
    },
    
    tagName: function(tagName) {
      return this.getElementsByTagName(tagName);
    },
    
    className: function(className) {
      return this.getElementsByClassName(className);
    },
    
    pseudoSelector: function(pseudoSelector) {
      if (misago.querySelectorAll.pseudoSelectors.searches[pseudoSelector]) {
        return misago.querySelectorAll.pseudoSelectors.searches[pseudoSelector].call(this);
      }
      throw new Error("Unknown or unsupported CSS pseudo-selector: " + pseudoSelector + ".");
    }
  };
  
  misago.querySelectorAll.selectors.filters = {
    id: function(cssFilter) {
      return (this.id == cssFilter.name);
    },
    
    tagName: function(cssFilter) {
      return (this.tagName.toUpperCase() == cssFilter.name.toUpperCase());
    },
    
    className: function(cssFilter)
    {
      var re = new RegExp("(^|\\s)" + cssFilter.name + "(\\s|$)", 'i');
      return re.test(this.className);
    },
    
    attribute: function(cssFilter)
    {
      if (!this.hasAttribute(cssFilter.name)) {
        return false;
      }
      switch (cssFilter.operator)
      {
        case '=':
          return (this.getAttribute(cssFilter.name) == cssFilter.value);
        
        case '~=':
          var re = new RegExp("(^|\\s)" + cssFilter.value + "(\\s|$)", 'i');
          return re.test(this.getAttribute(cssFilter.name));
        
        case '|=':
          var re = new RegExp("(^|-)" + cssFilter.value + "(-|$)", 'i');
          return re.test(this.getAttribute(cssFilter.name));
      }
      return true;
    },
    
    pseudoSelector: function(cssFilter)
    {
      if (misago.querySelectorAll.pseudoSelectors.filters[cssFilter.name]) {
        return misago.querySelectorAll.pseudoSelectors.filters[cssFilter.name].call(this, cssFilter);
      }
      throw new Error("Unknown or unsupported CSS pseudo-selector: " + cssFilter.name + ".");
    }
  };
  
  misago.querySelectorAll.pseudoSelectors = {};
  misago.querySelectorAll.pseudoSelectors.searches = {
    'first-child': function()
    {
      var child = this.firstChild;
      while(child && child.nextSibling) {
        child = child.nextSibling;
      }
      return [child];
    },
    
    'last-child': function()
    {
      var child = this.lastChild;
      while(child && child.previousSibling) {
        child = child.previousSibling;
      }
      return [child];
    }
  };
  
  misago.querySelectorAll.pseudoSelectors.filters = {
    'first-child': function(cssFilter)
    {
      var previousElement = this.previousSibling;
      while (previousElement && !previousElement.tagName) {
        previousElement = previousElement.previousSibling;
      }
      return previousElement ? false : true;
    },
    
    'last-child': function(cssFilter)
    {
      var nextElement = this.nextSibling;
      while (nextElement && !nextElement.tagName) {
        nextElement = nextElement.nextSibling;
      }
      return nextElement ? false : true;
    }
  };
  
  misago.querySelectorAll.operators =
  {
    descendant: function(parent, cssFilter) {
      return misago.querySelectorAll.selectors.search.call(parent, cssFilter);
    },
    
    child: function(parent, cssFilter)
    {
      var elements = misago.querySelectorAll.selectors.search.call(parent, cssFilter);
      return Array.prototype.filter.call(elements, function(element) {
        return element.parentNode == parent;
      });
    },
    
    adjacent: function(previousElement, cssFilter)
    {
      var nextElement = previousElement.get('nextElementSibling');
      if (nextElement
        && misago.querySelectorAll.selectors.filter.call(nextElement, cssFilter))
      {
        return [nextElement];
      }
      return false;
    },
    
    sibling: function(previousElement, cssFilter)
    {
      var nextElement = previousElement;
      var elements    = [];
      
      while (nextElement && (nextElement = nextElement.nextSibling))
      {
        if (nextElement.tagName
          && misago.querySelectorAll.selectors.filter.call(nextElement, cssFilter))
        {
          elements.push(nextElement);
        }
      }
      return elements.length ? elements : false;
    }
  };
  
  
  Element.prototype.querySelectorAll = function(cssRule) {
    return misago.querySelectorAll.apply(this, arguments);
  }
  
  document.querySelectorAll = function(cssRule) {
    return misago.querySelectorAll.apply(document, arguments);
  }
}
