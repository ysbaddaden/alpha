
// This file is DEPRECATED.

if (!Element.prototype.querySelectorAll)
{
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
            
            var match = part.name.match(/^([^~|^$*]+)((?:~|\||\^|\$|\*|)=)(.+)$/);
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
    
    filter: function(cssFilter) {
      return misago.querySelectorAll.selectors.filters[cssFilter.selector].call(this, cssFilter);
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
        
        case '^=':
          return (this.getAttribute(cssFilter.name).indexOf(cssFilter.value) === 0);
        
        case '$=':
          var re = new RegExp(cssFilter.value + "$", 'i');
          return re.test(this.getAttribute(cssFilter.name));
        
        case '*=':
          return (this.getAttribute(cssFilter.name).indexOf(cssFilter.value) > -1);
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
      var elements = (this.all) ? this.all : this.getElementsByTagName('*');
      var foundElements = [];
      for (var i=0, ilen=elements.length; i<ilen; i++)
      {
        var child = elements[i].get('firstElementChild');
        if (child) {
          foundElements.push(child);
        }
      }
      return foundElements;
    },
    
    'last-child': function()
    {
      var elements = (this.all) ? this.all : this.getElementsByTagName('*');
      var foundElements = [];
      for (var i=0, ilen=elements.length; i<ilen; i++)
      {
        var child = elements[i].get('lastElementChild');
        if (child) {
          foundElements.push(child);
        }
      }
      return foundElements;
    },
    
    'only-child': function()
    {
      var elements = (this.all) ? this.all : this.getElementsByTagName('*');
      var foundElements = [];
      for (var i=0, ilen=elements.length; i<ilen; i++)
      {
        var firstChild = elements[i].get('firstElementChild');
        var lastChild  = elements[i].get('lastElementChild');
        if (firstChild == lastChild) {
          foundElements.push(firstChild);
        }
      }
      return foundElements;
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
//      return (this.get('parentNode').get('firstElementChild') == this);
    },
    
    'last-child': function(cssFilter)
    {
      var nextElement = this.nextSibling;
      while (nextElement && !nextElement.tagName) {
        nextElement = nextElement.nextSibling;
      }
      return nextElement ? false : true;
//      return (this.get('parentNode').get('lastElementChild') == this);
    },
    
    'only-child': function(cssFilter)
    {
      return (misago.querySelectorAll.pseudoSelectors.filters['first-child'].call(this)
        && misago.querySelectorAll.pseudoSelectors.filters['last-child'].call(this));
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

