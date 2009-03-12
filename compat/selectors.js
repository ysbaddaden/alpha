/**
 * Developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
 * 
 * TODO: Use querySelectorAll() if available (ie. for MSIE 8).
 * TODO: Emulate querySelectorAll() when missing.
 * TODO: Write some tests.
 */

if (!document.getElementsByClassName)
{
	if (document.evaluate)
	{
		// XPATH (eg: Firefox 2)
		misago.getElementsByClassName = function(parent, className)
		{
			var classes = className.split(" "),
				classesToCheck = "",
				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace) ? xhtmlNamespace : null,
				returnElements = [],
				elements,
				node;
			for (var j=0, jl = classes.length; j<jl; j+=1) {
				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
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
			return returnElements;
		};
	}
	else
	{
		// DOM PARSING (eg: MSIE)
		misago.getElementsByClassName = function(parent, className)
		{
			var classes = className.split(" "),
				classesToCheck = [],
				elements = (parent.all) ? parent.all : parent.getElementsByTagName('*'),
				current,
				returnElements = [],
				match;
			
			for (var k=0, kl=classes.length; k<kl; k+=1) {
				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)", 'i'));
			}
			
			for (var l=0, ll=elements.length; l<ll; l+=1)
			{
				current = elements[l];
				match   = false;
				
				for(var m=0, ml=classesToCheck.length; m<ml; m+=1)
				{
					match = classesToCheck[m].test(current.className);
					if (!match) {
						break;
					}
				}
				
				if (match) {
					returnElements.push(current);
				}
			}
			return returnElements;
		};
	}
	
	Element.prototype.getElementsByClassName = function(className) {
		return misago.getElementsByClassName(this, className);
	};
	
	document.getElementsByClassName = function(className) {
		return misago.getElementsByClassName(document, className);
	};
}

