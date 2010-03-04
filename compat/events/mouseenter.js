(function()
{
  function __kokone_mouseenter_check(evt)
  {
    var related = evt.relatedTarget;
    while(related && related.parentNode)
    {
      if (related.parentNode == evt.target) return false;
      related = related.parentNode;
    }
    return true;
  }
  
  document.body.addEventListener('mouseover', function(evt)
  {
    if (!__kokone_mouseenter_check(evt)) return;
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('mouseenter', false, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
    evt.target.dispatchEvent(e);
  }, false);
  
  document.body.addEventListener('mouseout', function(evt)
  {
    if (!__kokone_mouseenter_check(evt)) return;
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('mouseleave', false, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
    evt.target.dispatchEvent(e);
  }, false);
})();
