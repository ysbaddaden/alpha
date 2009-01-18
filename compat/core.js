
var misago = {};

// browser sniffing (might come handy)
misago.browser = {};
(function()
{
	var ua = navigator.userAgent.toLowerCase();
	misago.browser.ie    = (window.VBArray) ? true : false;
	misago.browser.ie6   = (misago.browser.ie && document.implementation) ? true : false;
	misago.browser.ie7   = (misago.browser.ie && window.XMLHttpRequest) ? true : false;
	misago.browser.opera = (window.opera) ? true : false;
	misago.browser.gecko = (window.netscape && !misago.browser.opera) ? true : false;
	misago.browser.khtml = (ua.indexOf("safari") + 1 || ua.indexOf("konqueror") + 1) ? true : false;
})();

if (!Element)
{	
	// Garbage Collector, to prevent memory leaks in MSIE
	misago.garbage = [window, document.body];
	misago.garbageCollector = function()
	{
		for (var i=0, len=misago.garbage.length; i<len; i++)
		{
			var element = this.garbage[i];
			
			if (element.clearAttributes) {
				element.clearAttributes();
			}
			if (element.clearEvents) {
				element.clearEvents();
			}
			delete element;
			delete this.garbage[i];
		}
		delete misago.garbage;
	}
	window.attachEvent('onunload', misago.garbageCollector);
	
	// Emulates an Object Prototype
	misago.prototypeEmulator = function()
	{
		var Obj       = {};
		Obj.prototype = {};
		
		Obj.$extend = function(o)
		{
			if (!o.$extended)
			{
				misago.garbage.push(o);
				
				for (var method in Obj.prototype) {
					o[method] = Obj.prototype[method];
				}
				o.$extended = true;
			}
			return o;
		}
		return Obj;
	};
	
	// Emulates the Element DOM prototype
	var Element = new misago.prototypeEmulator();
	
	// Manually extends an element
	misago.extendElement = function(elm) {
		return Element.$extend(elm);
	}
	
	// Manually extends many elements
	misago.extendElements = function(elms)
	{
		var rs = [];
		for (var i=0, len=elms.length; i<len; i++) {
			rs[i] = Element.$extend(elms[i]);
		}
		return misago.nodeListEmulator(rs);
	}
	
	// Emulates a NodeList
	misago.nodeListEmulator = function(nodes)
	{
		this.length = nodes.length;
		this.item = function(i) {
			return nodes[i];
		}
	}
	
	// Makes document.createElement to extend the newly created element
	misago._MSIE_createElement = document.createElement;
	document.createElement = function(tagName)
	{
		var elm = misago._MSIE_createElement(tagName);
		return misago.extendElement(elm);
	}
	
	// Makes document.getElementById to return an extended element
	misago._MSIE_getElementById = document.getElementById;
	document.getElementById = function(id)
	{
		var elm = misago._MSIE_getElementById(id);
		return elm ? misago.extendElement(elm) : elm;
	}
	
	// Makes document.getElementsByTagName to return extended elements
	misago._MSIE_getElementsByTagName = document.getElementsByTagName;
	document.getElementsByTagName = function(id)
	{
		var elms = misago._MSIE_getElementsByTagName.call(this, id);
		if (elms.length) {
			return misago.extendElements(elms);
		}
		return elms;
	}
	
	// Makes elm.getElementsByTagName to return extended elements
	Element.prototype.getElementsByTagName = document.getElementsByTagName;
}
else
{
	// Compatibility layer for Standards Compliant Browsers
	misago.extendElement = function(elm) {
		return elm;
	}
}

// Shortcut for document.getElementsById, and will auto-extend the element in MSIE < 8.
misago.$ = function(element)
{
	if (typeof element == 'string') {
		element = document.getElementById(element)
	}
	return misago.extendElement(element);
}

// Shortcut: $ => misago.$
if (!window.$) {
	window.$ = misago.$;
}

