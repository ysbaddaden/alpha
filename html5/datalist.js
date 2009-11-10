
if (!HTML5.checkInputProperty('list'))
{
  // TODO: Hide list on blur (ie. when clicking outside the input/list elements).
  // TODO: Use option's value instead of option's label.
  HTML5.Datalist = function(input)
  {
    this.selection = null;
    
    this.input = input;
    this.input.addEventListener('focus',    this.displayList.bind(this), false);
    //this.input.addEventListener('blur',     this.hideList.bind(this),    false);
    this.input.addEventListener('keypress', this.onInput.bind(this),     false);
    
    this.list = document.getElementById(this.input.getAttribute('list'));
    this.list.addEventListener('mouseover', this.hoverSelection.bind(this), false);
    this.list.addEventListener('click',     this.onChoice.bind(this),       false);
  }
  
  HTML5.Datalist.prototype.onInput = function(evt)
  {
    switch(evt.keyCode)
    {
      case 38: this.moveSelectionUp();   return; // up
      case 40: this.moveSelectionDown(); return; // down
      case 13: this.chooseSelection(); evt.stopPropagation(); evt.preventDefault(); return; // enter
      case 27: this.hideList(); evt.stopPropagation(); evt.preventDefault(); return; // esc
    }
  }
  
  HTML5.Datalist.prototype.displayList = function(evt)
  {
    this.selection = this.list.get('firstElementChild');
    this.selection.addClassName('selected');
    
    sibling = this.selection;
    while(sibling = sibling.get('nextElementSibling')) {
      sibling.removeClassName('selected');
    }
    
    this.list.setStyle('width', this.input.clientWidth + 'px');
    this.list.setStyle({display: 'block', visibility: 'visible'});
  }
  
  HTML5.Datalist.prototype.hideList = function()
  {
    this.list.setStyle({display: 'none', visibility: 'hidden'});
  }
  
  HTML5.Datalist.prototype.onChoice = function(evt)
  {
    var tagName = evt.target.tagName.toUpperCase();
    if (tagName == 'OPTION' || tagName == 'SPAN')
    {
      this.selection = evt.target;
      this.chooseSelection();
    }
  }
  
  HTML5.Datalist.prototype.markSelection = function(selection)
  {
    if (this.selection) {
      this.selection.removeClassName('selected');
    }
    this.selection = selection;
    this.selection.addClassName('selected');
  }
  
  HTML5.Datalist.prototype.hoverSelection = function(evt)
  {
    var tagName = evt.target.tagName.toUpperCase();
    if (tagName == 'OPTION' || tagName == 'SPAN') {
      this.markSelection(evt.target);
    }
  }
  
  HTML5.Datalist.prototype.moveSelectionUp = function()
  {
    if (this.selection)
    {
      var previousElementSibling = this.selection.get('previousElementSibling');
      if (previousElementSibling) {
        this.markSelection(previousElementSibling)
      }
    }
  }
  
  HTML5.Datalist.prototype.moveSelectionDown = function()
  {
    if (this.selection)
    {
      var nextElementSibling = this.selection.get('nextElementSibling');
      if (nextElementSibling) {
        this.markSelection(nextElementSibling)
      }
    }
  }
  
  HTML5.Datalist.prototype.chooseSelection = function()
  {
    if (this.selection)
    {
      this.input.value = this.selection.innerHTML;
      this.input.removeClassName('placeholder');
      this.hideList();
    }
  }
  
  var inputs = document.querySelectorAll('input[list]');
  Array.prototype.forEach.call(inputs, function(input) {
    new HTML5.Datalist(input);
  });
}

