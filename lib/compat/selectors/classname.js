/**
 * Original code developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
 */

if (!document.getElementsByClassName)
{
  /*if (document.querySelectorAll)
  {
    // querySelectorAll (MSIE 8)
    // deactivated, because we will overwrite querySelectorAll (and there is no way to call/apply a native function).
    Element.prototype._msie_querySelectorAll = Element.prototype.querySelectorAll;
    kokone.getElementsByClassName = function(parent, className)
    {
      var classes = className.split(" ");
      var cssRule = "";

      for (var i=0, ilen = classes.length; i<ilen; i++) {
        cssRule += (classes[i][0] == '.') ? classes[i] : '.' + classes[i];
      }
      return Element.prototype._msie_querySelectorAll.apply(this, cssRule);
//      return this.querySelectorAll(cssRule);
    }
  }
  else*/ if (document.evaluate)
  {
    // XPATH (Firefox 2, etc.)
    kokone.getElementsByClassName = function(parent, className)
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
      return new kokone.NodeList(returnElements);
    }
  }
  else
  {
    // DOM PARSING (IE6, IE7, etc.)
    kokone.getElementsByClassName = function(parent, className)
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

      returnElements = kokone.extendElements ? kokone.extendElements(returnElements) : returnElements;
      return new kokone.NodeList(returnElements);
    }
  }

  Element.prototype.getElementsByClassName = function(className) {
    return kokone.getElementsByClassName(this, className);
  }

  document.getElementsByClassName = function(className) {
    return kokone.getElementsByClassName(document, className);
  }
}

