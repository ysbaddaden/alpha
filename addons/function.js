
/**
 * Creates an anonymous function, binded to a particular scope.
 */
Function.prototype.bind = function(bind)
{
  var self = this;
  return function() {
	  self.apply(bind, arguments);
  }
}

/**
 * Creates an anonymous function, that will be called with
 * some arguments.
 */
Function.prototype.pass = function(args, bind)
{
	var self = this;
	return function() {
		self.apply(bind || self, args);
	}
}

/**
 * Delays the execution of a function.
 */
Function.prototype.delay = function(delay, bind, args)
{
	var self = this;
	return setTimeout(function() {
		self.apply(bind || self, args);
	}, delay);
}

/**
 * Bufferizes a call to a function.
 * 
 * The buffered function will be called once, and only once,
 * when the delay expires. Just buffer it again to delay the
 * execution again and again.
 * 
 * Eg: you want to run function once the user stops to write
 * something.
 */
Function.prototype.debounce = function(delay, bind, args)
{
	var self = this;
	var timer;
	return function()
	{
		clearTimeout(timer);
		timer = self.delay(delay, bind, args);
	}
}

