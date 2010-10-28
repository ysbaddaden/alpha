// window dimensions are undefined in IE
if (typeof window.innerWidth == 'undefined')
{
  if (Object.defineProperty)
  {
    // IE 8
    Object.defineProperty(window, 'innerWidth', {get: function() {
      return document.documentElement.clientWidth;
    }});
    Object.defineProperty(window, 'innerHeight', {get: function() {
      return document.documentElement.clientHeight;
    }});
    Object.defineProperty(window, 'pageXOffset', {get: function() {
      return document.documentElement.scrollWidth;
    }});
    Object.defineProperty(window, 'pageYOffset', {get: function() {
      return document.documentElement.scrollHeight;
    }});
  }
  else
  {
    // IE 6-7
    Alpha.__msie_onresize = function()
    {
      window.innerWidth  = document.documentElement.clientWidth;
      window.innerHeight = document.documentElement.clientHeight;
      window.pageXOffset = document.documentElement.scrollWidth;
      window.pageYOffset = document.documentElement.scrollHeight;
    }
    Alpha.__msie_onresize();
    window.attachEvent('onresize', Alpha.__msie_onresize);
  }
}

