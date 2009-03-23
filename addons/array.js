
Array.prototype.merge = function()
{
  for (var a=0, alen=arguments.length; a<alen; a++)
  {
    Array.prototype.forEach.call(arguments[a], function(elm)
    {
      if (this.indexOf(elm) == -1) {
        this.push(elm);
      }
    }, this);
  }
  return this;
}

