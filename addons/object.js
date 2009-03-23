
Object.prototype.merge = function()
{
  for (var a=0, alen=arguments.length; a<alen; a++)
  {
    for (var i in arguments[a]) {
      this[i] = arguments[a][i];
    }
  }
  return this;
}

