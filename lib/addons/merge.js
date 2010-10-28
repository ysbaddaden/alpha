Alpha.mergeObjects = function()
{
  var obj = [];
  for (var i=0, len=arguments.length; i<len; i++)
  {
    for (var key in arguments[i]) {
      obj[key] = arguments[i][key];
    }
  }
  return obj;
}

Alpha.mergeArrays = function()
{
  var ary = [];
  var i = arguments.length;
  while (i--)
  {
    Array.prototype.forEach.call(arguments[i], function(member)
    {
      if (ary.indexOf(member) == -1) {
        ary.push(member);
      }
    });
  }
  return ary;
}

