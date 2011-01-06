//UI.Sortable = function(list, options)
//{
//  this.list = list;
//  
//  this.options = options || {};
//  this.options.items = (this.options.items || 'li').toLowerCase();
//  
//  this.bound_drag = this.drag.bind(this);
//  this.bound_stop = this.stop.bind(this);
//  this.list.addEventListener('mousedown', this.start.bind(this), false);
//}

//UI.Sortable.prototype =
//{
//  ondragstart: function(item) {},
//  ondragend:   function(item) {},
//  
//  start: function(evt)
//  {
//    evt.preventDefault();
//    
//    if (!this.draggedItem)
//    {
//      this.draggedItem = evt.target;
//      
//      while (this.draggedItem.nodeName.toLowerCase() != this.options.items) {
//        this.draggedItem = $(this.draggedItem.parentNode);
//      }
//      
//      this.draggedItem.addClassName('dragged');
//      
//      this.items = this.list.getElementsByTagName(this.options.items);
//      
//      document.body.addEventListener('mousemove', this.bound_drag, false);
//      document.body.addEventListener('mouseup',   this.bound_stop, false);
//      
//      this.ondragstart(this.draggedItem);
//    }
//  },

//  drag: function(evt)
//  {
//    evt.preventDefault(); // prevents text selection on MSIE
//    
//    var item, pos;
//    
//    var first = this.items[0];
//    var last  = this.items[this.items.length - 1];
//    
//    if (evt.clientY <= this._pos(first)[0]) {
//      first.parentNode.insertBefore(this.draggedItem, first);
//    }
//    else if (evt.clientY >= this._pos(last)[1]) {
//      last.parentNode.appendChild(this.draggedItem);
//    }
//    else
//    {
//      for (var i=0, len=this.items.length; i<len; i++)
//      {
//        item = this.items[i];
//        
//        if (item == this.draggedItem) continue;
//        
//        pos = this._pos(item);
//        
//        if (evt.clientY >= pos[0] && evt.clientY <= pos[1])
//        {
//          $(item.parentNode).insertAfter(this.draggedItem, item);
//          break;
//        }
//      }
//    }
//  },

//  stop: function(evt)
//  {
//    this.ondragend(this.draggedItem);
//    
//    document.body.removeEventListener('mousemove', this.bound_drag, false);
//    document.body.removeEventListener('mouseup',   this.bound_stop, false);
//    
//    this.draggedItem.removeClassName('dragged');
//    this.draggedItem = undefined;
//  },

//  _pos: function(elm)
//  {
//    var pos = [elm.offsetTop, elm.offsetTop + elm.offsetHeight];
//    
//    while (elm.offsetParent)
//    {
//      elm = elm.offsetParent;
//      pos[0] += elm.offsetTop;
//      pos[1] += elm.offsetTop;
//    }
//    
//    pos[0] -= document.body.scrollTop;
//    pos[1] -= document.body.scrollTop;
//    
//    return pos;
//  }
//}

UI.Sortable = function(list, options)
{
  this.list = list;
  
  this.options = options || {};
  this.options.items  = (this.options.items || 'li').toLowerCase();
  
  this.bound_drag = this.drag.bind(this);
  this.bound_stop = this.stop.bind(this);
  this.list.addEventListener('mousedown', this.start.bind(this), false);
}

UI.Sortable.prototype =
{
  // Passes the dragged item on drag start. It must return the dragged item,
  // otherwise nothing will be dragged.
  ondragstart: function(draggedItem) { return draggedItem; },

  // Passes the dragged item when it has been moved.
  ondragend: function(item) {},

  start: function(evt)
  {
    if (!this.draggedItem)
    {
      var draggedItem = evt.target;
      var items = this._items();
      
      // selects the actual item (event target may be a child)
      find_item:
      for (var i=0; i<items.length; i++)
      {
        if (draggedItem == items[i]) {
          break find_item;
        }
        else
        {
          var children = items[i].getElementsByTagName('*');
          
          for (var j=0; j<children.length; j++)
          {
            if (children[j] == draggedItem)
            {
              draggedItem = items[i];
              break find_item;
            }
          }
        }
      }
      
      // passes the dragged item to callback validation
      this.draggedItem = this.ondragstart(draggedItem);
      
      if (this.draggedItem)
      {
        evt.preventDefault();
        
        this.draggedItem.addClassName('dragged');
//        this.items = items;
        
        document.body.addEventListener('mousemove', this.bound_drag, false);
        document.body.addEventListener('mouseup',   this.bound_stop, false);
      }
    }
  },

  drag: function(evt)
  {
    evt.preventDefault(); // prevents text selection on MSIE
    
    var item, pos;
    var items = this._items();
    var first = items[0];
    var last  = items[items.length - 1];
    
    if (evt.clientY <= this._pos(first)[0]) {
      first.parentNode.insertBefore(this.draggedItem, first);
    }
    else if (evt.clientY >= this._pos(last)[1]) {
      $(last.parentNode).insertAfter(this.draggedItem, last);
    }
    else
    {
      for (var i=0, len=items.length; i<len; i++)
      {
        item = items[i];
        
        if (item == this.draggedItem) {
          continue;
        }
        
        pos = this._pos(item);
        
        if (evt.clientY >= pos[0] && evt.clientY <= pos[1])
        {
          $(item.parentNode).insertAfter(this.draggedItem, item);
          break;
        }
      }
    }
  },

  stop: function(evt)
  {
    this.ondragend(this.draggedItem);
    
    document.body.removeEventListener('mousemove', this.bound_drag, false);
    document.body.removeEventListener('mouseup',   this.bound_stop, false);
    
    this.draggedItem.removeClassName('dragged');
    this.draggedItem = undefined;
  },

  _items: function() {
    return this.list.querySelectorAll(this.options.items);
  },

  _pos: function(elm)
  {
    var pos = [elm.offsetTop, elm.offsetTop + elm.offsetHeight];
    
    while (elm.offsetParent)
    {
      elm = elm.offsetParent;
      pos[0] += elm.offsetTop;
      pos[1] += elm.offsetTop;
    }
    
    pos[0] -= document.body.scrollTop;
    pos[1] -= document.body.scrollTop;
    
    return pos;
  }
}

