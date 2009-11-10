
var HTML5 = {};

HTML5.checkInputProperty = function(property)
{
  var i = document.createElement('input');
  return property in i;
}

