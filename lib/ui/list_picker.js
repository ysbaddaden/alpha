/*
A ListPicker is an abstract widget that allows the selection of an
entry within a list.

It's similar to the HTML5 Datalist element, and actually serves as
a basis for Alpha's emulation of the Datalist element. But it's not
limited to a combobox widget, you can use it for advanced auto-
completion like:

- populating a +city_id+ hidden input, while using a +city+ text
  input for autocompeting the name,
- displaying a clickable list of articles results, while the user
  types in a search input,
- etc.
*/
Alpha.UI.ListPicker = function(input, options)
{
  this.input = input;
  this.input.setAttribute('autocomplete', 'off');
  this.createList(options);
  this.attachEvents();
}

Alpha.UI.ListPicker.prototype = {

  // public

  items: function() {
    return this.list.getElementsByTagName('li');
  },

  hasItems: function() {
    return this.items().length > 0;
  },

  // +list+ must be an Array, HTMLCollection or HTML string of LI elements.
  setItems: function(items)
  {
    if (typeof items == 'string') {
      this.list.innerHTML = items;
    }
    else
    {
      this.list.innerHTML = '';
      
      for (var i=0, len=items.length; i<len; i++) {
        this.list.appendChild(items[i]);
      }
    }
    this.unmarkSelection();
  },

  show: function() {
    this.picker.display();
  },

  hide: function() {
    this.picker.hide();
  },

  showOrHide: function()
  {
    if (this.hasItems()) {
      this.show();
    }
    else {
      this.hide();
    }
  },

  // Callback to overwrite to receive the selected item. This is required.
  onselect: function(item) {
    throw new Error("you must overwrite the onselect(item) method.");
  },

  onactivate:   function() {},
  ondeactivate: function() {},

  // protected

  createList: function(options)
  {
    this.list = document.createElement('ul');
    this.list.addEventListener('click', this.onchoice.bind(this), false);
    
    this.picker = new Alpha.UI.Picker(this.input, {
      onClose: 'hide',
      closeOnEscape: true,
      closeOnOuterClick: true,
      className: 'list-picker ' + options.className
    });
    this.picker.setContent(this.list);
  },

  attachEvents: function()
  {
    this.input.addEventListener('focus',    this.activate.bind(this),   false);
    this.input.addEventListener('click',    this.activate.bind(this),   false);
    this.input.addEventListener('blur',     this.deactivate.bind(this), false);
    this.input.addEventListener('keypress', this.onkeypress.bind(this), false);
    this.input.addEventListener('keyup',    this.onkeyup.bind(this),    false);
  },

  activate: function(evt)
  {
    if (this.hasItems()) {
      this.show();
    }
    this.onactivate();
  },

  deactivate: function(evt) {
    this.ondeactivate();
  },

  onkeypress: function(evt)
  {
    switch(evt.keyCode)
    {
      case 13: this.onenter(evt);  return; // enter
      case 27: this.onescape(evt); return; // esc
    }
  },

  onkeyup: function(evt)
  {
    switch(evt.keyCode)
    {
      case 38: this.moveSelectionUp();   return; // up
      case 40: this.moveSelectionDown(); return; // down
      case 13: return;                           // enter
      case 27: this.onescape(evt); return;       // esc
    }
    this.showOrHide();
  },

  onenter: function(evt)
  {
    if (this.picker.displayed())
    {
      this.selectSelection();
      evt.stopPropagation();
      evt.preventDefault();
    }
  },

  onescape: function(evt)
  {
    this.hide();
    evt.stopPropagation();
    evt.preventDefault();
  },

  onchoice: function(evt)
  {
    // IMPROVE: search for a parent LI if target isn't an LI.
    
    if (evt.target.tagName.toLowerCase() == 'li')
    {
      this.selection = evt.target;
      this.selectSelection();
    }
  },

  markSelection: function(item)
  {
    if (item)
    {
      if (this.selection) {
        this.selection.removeClassName('selected');
      }
      this.selection = item;
      this.selection.addClassName('selected');
    }
  },

  unmarkSelection: function()
  {
    if (this.selection)
    {
      this.selection.removeClassName('selected');
      this.selection = null;
    }
  },

  moveSelectionUp: function()
  {
    var item;
    
    if (this.selection)
    {
      item = this.selection.get ?
        this.selection.get('previousElementSibling') :
        this.selection.previousElementSibling;
    }
    else if (this.hasItems()) {
      item = this.items()[this.items().length - 1];
    }
    
    this.markSelection(item)
  },

  moveSelectionDown: function()
  {
    var item;
    
    if (this.selection)
    {
      item = this.selection.get ?
        this.selection.get('nextElementSibling') :
        this.selection.nextElementSibling;
    }
    else if (this.hasItems()) {
      item = this.items()[0];
    }
    
    this.markSelection(item)
  },

  selectSelection: function()
  {
    this.hide();
    
    if (this.selection)
    {
      this.onselect(this.selection);
      this.unmarkSelection();
    }
  }
}
