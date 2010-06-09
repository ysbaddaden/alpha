// TODO: Check for native browser support!
// TODO: WAI-ARIA.

HTML5.details = function(detail)
{
  var opened  = false;
  var summary = detail.getElementsByTagName('summary');
  
  if (summary.length > 0) {
    summary = summary[0];
  }
  else {
    summary = document.createElement('summary');
    summary.innerHTML = 'details';
    if (detail.firstChild) {
      detail.insertBefore(summary, detail.firstChild);
    }
    else {
      detail.appendChild(summary);
    }
  }
  close();
  
  summary.addEventListener('click', function() {
    opened ? close() : open();
  }, false);
  
  function open()  { opened = true;  set('display:;visibility:'); }
  function close() { opened = false; set('display:none;visibility:hidden'); }
  function set(css)
  {
    Array.prototype.forEach.call(detail.get('children'), function(child)
    {
      if (child != summary) {
        child.style.cssText = css;
      }
    });
  }
}

Array.prototype.forEach.call(document.getElementsByTagName('details'),
  function(detail)
{
  new HTML5.details(detail);
});

