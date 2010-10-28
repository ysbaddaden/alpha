var HTML5 = {};

HTML5.checkInputProperty = function(property)
{
  var i = document.createElement('input');
  return property in i;
}

HTML5.supportsDOMSubtreeModifiedEvent = function()
{
  var div = document.createElement('div'), test = false;
  div.addEventListener('DOMSubtreeModified', function() { test = true }, false);
  div.appendChild(document.createElement('div'));
  return test;
}

