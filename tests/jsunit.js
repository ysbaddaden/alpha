/**
 * JavaScript Unit Testing framework.
 */

var jsUnit   = {};
jsUnit.tests = [];

jsUnit.add = function(test, fn)
{
  jsUnit.tests.push({
    test: test,
    fn:   fn,
  });
}

jsUnit.run = function()
{
  for (var i=0, len=jsUnit.tests.length; i<len; i++)
  {
    jsUnit.runningTest = jsUnit.tests[i].test;
    jsUnit.tests[i].fn();
  }
}

jsUnit.displayResult = function(result)
{
  if (!jsUnit.results)
  {
    jsUnit.results    = document.createElement('table');
    jsUnit.results.id = 'jsUnit';
    document.body.appendChild(jsUnit.results);

    var header   = document.createElement('tr');
    var h_test   = document.createElement('th');
    var h_result = document.createElement('th');
    h_test.appendChild(document.createTextNode("Running Test"));
    h_result.appendChild(document.createTextNode("Passed?"));
    header.appendChild(h_test);
    header.appendChild(h_result);
    jsUnit.results.appendChild(header);

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(
      "#jsUnit        { border-collapse: collapse; padding: 0; font: normal 100%/1.5 sans-serif; border: 1px solid #CCC; } " +
      "#jsUnit tr     { padding: 0; margin: 0; } " +
      "#jsUnit .even  { background: #EEE; } " +
      "#jsUnit th     { padding: 2px 5px; margin: 0; background: #CCC; text-align: left; } " +
      "#jsUnit td     { padding: 2px 5px; margin: 0; } " +
      "#jsUnit span   { display: block; width: 100%; color: white; font-size: .833em; text-align: center; } " +
      "#jsUnit .green { background: #0D0; } " +
      "#jsUnit .red   { background: #D00; } " +
      ""
    ));
    document.getElementsByTagName('head')[0].appendChild(style);

    jsUnit.resultsCount = 1;
  }

  var row  = document.createElement('tr');
  var test = document.createElement('td');
  var pass = document.createElement('td');
  var span = document.createElement('span');

  row.className += (jsUnit.resultsCount % 2 === 0) ? ' even' : ' odd';
  test.appendChild(document.createTextNode(jsUnit.runningTest));
  test.className = 'test';
  span.className = (result === true) ? 'green' : 'red';

  span.appendChild(document.createTextNode((result === true) ? 'yes' : 'no'));

  pass.appendChild(span)
  row.appendChild(test);
  row.appendChild(pass);
  jsUnit.results.appendChild(row);

  jsUnit.resultsCount++;
}

jsUnit.assertTrue = function(value) {
  jsUnit.displayResult(value === true);
}

jsUnit.assertFalse = function(value) {
  jsUnit.displayResult(value === false);
}

jsUnit.assertEquals = function()
{
  var value = arguments[0];
  for (var i=1, len=arguments.length; i<len; i++)
  {
    if (value !== arguments[i])
    {
      jsUnit.displayResult(false);
      return;
    }
  }
  jsUnit.displayResult(true);
}

jsUnit.assertNotEquals = function()
{
  var value = arguments[0];
  for (var i=1, len=arguments.length; i<len; i++)
  {
    if (value !== arguments[i])
    {
      jsUnit.displayResult(true);
      return;
    }
  }
  jsUnit.displayResult(false);
}

jsUnit.assertNull = function(arg) {
  jsUnit.assertTrue(arg === null);
}

jsUnit.assertNotNull = function(arg) {
  jsUnit.assertFalse(arg === null);
}

jsUnit.assertNaN = function(arg) {
  jsUnit.displayResult(isNaN(NaN));
}

jsUnit.assertNotNaN = function(arg) {
  jsUnit.assertFalse(arg === NaN);
}

jsUnit.assertType = function(arg, type) {
  jsUnit.displayResult(typeof arg == type);
}

jsUnit.assertNotType = function(arg, type) {
  jsUnit.displayResult(typeof arg != type);
}

jsUnit.assertFunction = function(fn) {
  jsUnit.assertType(fn, 'function');
}

jsUnit.assertNotFunction = function(fn) {
  jsUnit.assertNotType(fn, 'function');
}

jsUnit.assertObject = function(arg) {
  jsUnit.assertType(arg, 'object');
}

jsUnit.assertNotObject = function(arg) {
  jsUnit.assertNotType(arg, 'object');
}

jsUnit.assertUndefined = function(arg) {
  jsUnit.assertType(arg, 'undefined');
}

jsUnit.assertNotUndefined = function(arg) {
  jsUnit.assertNotType(arg, 'undefined');
}
