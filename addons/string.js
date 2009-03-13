
String.prototype.camelize = function(index)
{
  var parts = this.split(/[-_]/);
  var str = '';
  if (typeof index == 'undefined') {
    index = 1;
  }
  for (var i=0; i<index; i++) {
    str += parts[i];
  }
  for (var i=index; i<parts.length; i++)
  {
    str += parts[i].substr(0, 1).toUpperCase();
    str += parts[i].substr(1);
  }
  return str;
}

String.prototype.hyphenize = function()
{
  var parts = this.split(/([A-Z].+)/);
  var str = '';
  for (var i=0; i<parts.length; i++)
  {
    if (parts[i] != '') {
      str += parts[i].toLowerCase() + '-';
    }
  }
  return str.replace(/[-]+$/, '');
}

