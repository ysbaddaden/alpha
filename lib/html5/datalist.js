// IMPROVE: do not auto select the first choice, and have a nil selection(?)
// TODO: how to hide the chooser on blur without hiding the chooser box when it's clicked (setTimeout)?

// Only opera supports datalist, and it's kind of limited right now. So let's override it.
//if (!HTML5.checkInputProperty('list'))
//{
  HTML5.Datalist = function(input)
  {
    this.selection = null;
    this.input = input;
    this.input.setAttribute('autocomplete', 'off');
    
    this.input.addEventListener('focus', this.displayChooser.bind(this), false);
    this.input.addEventListener('click', this.displayChooser.bind(this), false);
    
    this.input.addEventListener('keypress', this.onKeyPress.bind(this), false);
    this.input.addEventListener('keyup',    this.onKeyUp.bind(this), false);
    
    this.datalist = document.getElementById(this.input.getAttribute('list'));
    this.datalist.getElementsByTagName('label')[0].style.display = 'none';
    this.datalist.getElementsByTagName('select')[0].style.display = 'none';
  }
  
  HTML5.Datalist.prototype.createChooser = function()
  {
    this.chooser = document.createElement('ul');
    this.chooser.className = 'datalist';
    this.chooser.style.display = 'none';
    
    this.chooser.addEventListener('mouseover', this.hoverSelection.bind(this), false);
    this.chooser.addEventListener('click', this.onChoice.bind(this), false);
    
    this.input.parentNode.appendChild(this.chooser);
  }
  
  HTML5.Datalist.prototype.datalistOptions = function(filter)
  {
    filter = (filter || '').trim()
    
    var options = [];
    Array.prototype.forEach.call(this.datalist.getElementsByTagName('option'), function(option)
    {
      if (filter != '')
      {
        var re = new RegExp('^' + filter.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1'), 'i');
        if (!option.value.match(re)) {
          return;
        }
      }
      options.push(option.value)
    });
    return options;
  }
  
  HTML5.Datalist.prototype.onKeyPress = function(evt)
  {
    switch(evt.keyCode)
    {
      case 38: this.moveSelectionUp();   return; // up
      case 40: this.moveSelectionDown(); return; // down
      case 13: this.chooseSelection(); evt.stopPropagation(); evt.preventDefault(); return; // enter
      case 27: this.hideChooser();     evt.stopPropagation(); evt.preventDefault(); return; // esc
      case 9: // tab
        if (this.displayed)
        {
          this.chooseSelection();
          evt.stopPropagation();
          evt.preventDefault();
        }
    }
    // alert('keyCode:' + evt.keyCode + ' which:' + evt.which + ' charCode:' + evt.charCode);
  }
  
  HTML5.Datalist.prototype.onKeyUp = function(evt)
  {
    switch(evt.keyCode)
    {
      case 38: case 40: case 27: case 9: return;
      default: this.updateChooserProposals();
    }
  }
  
  HTML5.Datalist.prototype.displayChooser = function(evt)
  {
    if (!this.displayed)
    {
      if (!this.chooser) {
        this.createChooser();
      }
      this.updateChooserProposals(1);
    }
  }
  
  HTML5.Datalist.prototype.showChooser = function()
  {
    this.displayed = true;
    this.chooser.style.display = 'block';
    this.chooser.style.position = 'absolute';
    this.chooser.style.top = (this.input.offsetTop + this.input.offsetHeight) + 'px';
    this.chooser.style.left = this.input.offsetLeft + 'px';
    this.chooser.style.minWidth = this.input.clientWidth + 'px';
  }
  
  HTML5.Datalist.prototype.hideChooser = function()
  {
    this.chooser.style.display = 'none';
    this.displayed = false;
  }
  
  HTML5.Datalist.prototype.onChoice = function(evt)
  {
    if (evt.target.tagName.toLowerCase() == 'li')
    {
      this.selection = evt.target;
      this.chooseSelection();
    }
  }
  
  HTML5.Datalist.prototype.fillChooser = function()
  {
    this.datalistOptions(this.input.value).forEach(function(value)
    {
      var li = document.createElement('li');
      li.innerHTML = value;
      this.chooser.appendChild(li);
    }, this);
  }
  
  HTML5.Datalist.prototype.updateChooserProposals = function(minimum)
  {
    minimum = minimum || 0
    
    this.chooser.innerHTML = '';
    this.fillChooser();
    
    if (this.chooser.getElementsByTagName('li').length <= minimum) {
      this.hideChooser();
    }
    else
    {
      this.selectFirstProposal();
      this.showChooser();
    }
  }
  
  HTML5.Datalist.prototype.selectFirstProposal = function()
  {
    this.selection = this.chooser.get('firstElementChild');
    this.selection.addClassName('selected');
    
    var sibling = this.selection;
    while (sibling = sibling.get('nextElementSibling')) {
      sibling.removeClassName('selected');
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
      this.hideChooser();
    }
  }
  
  Array.prototype.forEach.call(document.querySelectorAll('input[list]'), function(input) {
    new HTML5.Datalist(input);
  });
//}
//else {
//  /* Browser supports datalist! */
//}

