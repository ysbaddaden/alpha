// HTML5 spec:
// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-button-element.html#the-datalist-element
// 
// IMPROVE: use DOMSubtreeModified whenever possible.
// NOTE: Safari doesn't fire the DOMSubtreeModified event properly?
// NOTE: do not auto select the first choice, and have a nil selection instead?
// NOTE: should the list be displayed on focus, or just on click (like a select)?
// 
// Only opera supports datalist, but not with options within a select within
// a datalist. We thus can't rely on it at the moment.
HTML5.Datalist = function(input)
{
  this.input = input;
  
  this.datalist = document.getElementById(this.input.getAttribute('list'));
  this.datalist.getElementsByTagName('label')[0].style.display = 'none';
  this.datalist.getElementsByTagName('select')[0].style.display = 'none';
  
  this.createListPicker();
}

HTML5.Datalist.prototype = {
  createListPicker: function()
  {
    this.picker = new Alpha.UI.ListPicker(this.input, {
      className: 'datalist',
    });
    
    this.picker.onselect   = this.onselect.bind(this);
    this.picker.onactive   = this.onactive.bind(this);
    this.picker.ondeactive = this.ondeactive.bind(this);
    
    this.populateOptions();
  },

  onactive: function(evt) {
    this.startOptionsMonitoring();
  },

  ondeactive: function(evt) {
    this.stopOptionsMonitoring();
  },

  onselect: function(li) {
    this.input.value = li.getAttribute('data-value');
  },

  populateOptions: function()
  {
    var li, items = [],
      options = this.datalist.getElementsByTagName('option');
    
    for (var i=0, len=options.length; i<len; i++)
    {
      li = document.createElement('li');
      li.setAttribute('data-value', options[i].value);
      li.innerHTML = options[i].label == "" ? options[i].value : options[i].label;
      items.push(li);
    }
    
    this.picker.setItems(items);
  },

  // Monitors the datalist options for any changes.
  // 
  // Tries to use DOMSubtreeModified whenever possible, otherwise polls for
  // HTML changes every 100ms.
  startOptionsMonitoring: function()
  {
//    if (HTML5.supportsDOMSubtreeModifiedEvent()) {
//      // the proper way (disabled because of Safari bug)
//      this.tracker = this.populateOptions.bind(this);
//      this.datalist.addEventListener('DOMSubtreeModified', this.tracker, false);
//    }
//    else
//    {
      // the ugly way: polls at regular intervals for subtree changes
      this.optionsPreviousHTML = this.datalist.innerHTML;
      this.tracker = setInterval(this.monitoring.bind(this), 100);
//    }
  },

  stopOptionsMonitoring: function()
  {
//    if (HTML5.supportsDOMSubtreeModifiedEvent()) {
//      this.datalist.removeEventListener('DOMSubtreeModified', this.tracker, false);
//    }
//    else {
      clearInterval(this.tracker);
//    }
  },

  monitoring: function()
  {
    if (this.optionsPreviousHTML != this.datalist.innerHTML)
    {
      this.optionsPreviousHTML = this.datalist.innerHTML;
      this.populateOptions();
    }
  }
}

Array.prototype.forEach.call(document.querySelectorAll('input[list]'), function(input) {
  new HTML5.Datalist(input);
});
