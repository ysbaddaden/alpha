/**
 * http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array
 */

// JavaScript 1.6

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len  = this.length;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len;
		}
		for (; from < len; from++)
		{
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}

if (!Array.prototype.lastIndexOf)
{
	Array.prototype.lastIndexOf = function(elt /*, from*/)
	{
		var len  = this.length;
		var from = Number(arguments[1]);
		if (isNaN(from)) {
			from = len - 1;
		}
		else
		{
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			}
			else if (from >= len) {
				from = len - 1;
			}
		}
		for (; from > -1; from--)
		{
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}

if (!Array.prototype.every)
{
	Array.prototype.every = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this && !fn.call(self, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
}

if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var res  = new Array();
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this)
			{
				var val = this[i]; // in case fn mutates this
				if (fn.call(self, val, i, this)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}

if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function(fn)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this) {
				fn.call(self, this[i], i, this);
			}
		}
	}
}

if (!Array.prototype.map)
{
	Array.prototype.map = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var res  = new Array(len);
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this) {
				res[i] = fn.call(self, this[i], i, this);
			}
		}
		return res;
	};
}

if (!Array.prototype.some)
{
	Array.prototype.some = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this && fn.call(self, this[i], i, this))
			return true;
		}
		return false;
	};
}


// JavaScript 1.8

if (!Array.prototype.reduce)
{
	Array.prototype.reduce = function(fn /*, initial*/)
	{
		var len = this.length;
		if (typeof fn != "function") {
			throw new TypeError();
		}

		// no value to return if no initial value and an empty array
		if (len == 0 && arguments.length == 1) {
			throw new TypeError();
		}

		var i = 0;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		}
		else
		{
			do
			{
				if (i in this)
				{
					rv = this[i++];
					break;
				}

				// if array contains no values, no initial value to return
				if (++i >= len) {
					throw new TypeError();
				}
			}
			while (true);
		}

		for (; i < len; i++)
		{
			if (i in this) {
				rv = fn.call(null, rv, this[i], i, this);
			}
		}

		return rv;
	};
}

if (!Array.prototype.reduceRight)
{
	Array.prototype.reduceRight = function(fn /*, initial*/)
	{
		var len = this.length;
		if (typeof fn != "function") {
			throw new TypeError();
		}

		// no value to return if no initial value, empty array
		if (len == 0 && arguments.length == 1) {
			throw new TypeError();
		}

		var i = len - 1;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		}
		else
		{
			do
			{
				if (i in this)
				{
					rv = this[i--];
					break;
				}

				// if array contains no values, no initial value to return
				if (--i < 0) {
					throw new TypeError();
				}
			}
			while (true);
		}

		for (; i >= 0; i--)
		{
			if (i in this) {
				rv = fn.call(null, rv, this[i], i, this);
			}
		}

		return rv;
	};
}
