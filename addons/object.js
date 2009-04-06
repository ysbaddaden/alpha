
Object.merge = function(obj)
{
  for (var a=1, alen=arguments.length; a<alen; a++)
  {
    for (var i in arguments[a]) {
      obj[i] = arguments[a][i];
    }
  }
  return obj;
}

