
// TODO: Test in all browsers.
// TODO: Propose a display:'replace' option that will display the picker in place of the text input.
// TODO: Add support for setting the time.
// IMPROVE: Update calendar when date is manually modified in input (and is valid).
// IMPROVE: Add capping dates (eg: from 2008-01-01 to 2009-12-31) and do not allow to choose dates that are outside this scope.
// IMPROVE: Localize months and days.

Alpha.UI.DatePicker = function(input, options)
{
  this.input = Alpha.$(input);
  
  this.options = {
    className: ''
  }
  Alpha.mergeObjects(this.options, options || {});
  
	this.months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	this.weekdays = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

  this.input.addEventListener('click', this.display.bind(this), false);
}

Alpha.UI.DatePicker.prototype.display = function()
{
  if (!this.picker)
  {
    this.picker = new Alpha.UI.Picker(this.input, {
      className: 'date-picker ' + this.options.className
    });
  }
  
  this.selectedDate = this.parseDate(this.input.value);
  this.setDate(this.selectedDate);
  
  this.picker.display();
}

Alpha.UI.DatePicker.prototype.setDate = function(datetime)
{
	var date = datetime instanceof Date ? datetime : this.parseDate(datetime);
  this.setCalendar(date);
}

Alpha.UI.DatePicker.prototype.setCalendar = function(date)
{
  var today = new Date();
	var first = new Date(date.getFullYear(), date.getMonth(), 1);
	
	this.currentDate = date;
	
  // date picker
  var html = '<table>' +
    '<tr class="date">' +
    '<th class="before">&laquo;</th>' +
    '<th class="now" colspan="5"> ' +
    this.months[date.getMonth()] + ' ' +
    date.getFullYear() +
    ' </th>' +
    '<th class="after">&raquo;</th>' +
    '</tr><tr class="weekdays">';
  for (i=0; i<7; i++)
  {
    html += '<td>' + this.weekdays[i] + '</td>';
  }
  html += '</tr><tr class="days">';

  var wd = 0;
  var nb = this.computeDaysInMonth(first.getFullYear(), first.getMonth() - 1);
  for (var d = nb - first.getDay() + 1; d <= nb; d++)
  {
    html += '<td class="wrong">' + d + '</td>';
    wd++;
  }
  
  for (var d=1; d <= this.computeDaysInMonth(date.getFullYear(), date.getMonth()); d++)
  {
    var classes = '';
    if (today.getFullYear() == date.getFullYear()
      && today.getMonth() == date.getMonth()
      && today.getDate()  == d)
    {
      classes = 'today';
    }
    
    if (date.getFullYear() == this.selectedDate.getFullYear()
      && date.getMonth() == this.selectedDate.getMonth()
      && date.getDate()  == d)
    {
      classes += ' selected ';
    }
    
    html += '<td' + (classes != '' ? ' class="' + classes + '"' : '') + '>' + d + '</td>';
    wd++;
    if (wd == 7)
    {
      wd = 0;
      html += '</tr><tr class="days">';
    }
  }

  if (wd > 0)
  {
    for (var d = 1; d < 8 - wd; d++) {
      html += '<td class="wrong">' + d + '</td>';
    }
  }
  html += '</tr></table>';
  
  this.picker.setContent(html);
  
  var content = this.picker.getContent();
  var table = content.getElementsByTagName('table')[0];
  table.addEventListener('click', this.onClick.bind(this), false);
}

Alpha.UI.DatePicker.prototype.onClick = function(evt)
{
  evt.stopPropagation();

  if (evt.target.className == 'before') {
    this.setPreviousMonth();
  }
  else if (evt.target.className == 'after') {
    this.setNextMonth();
  }
  else
  {
    var td = evt.target;
    while (td && td.tagName && td.tagName.toUpperCase() != 'TD' && td.parentNode) {
      td = td.get('parentNode');
    }
    
    if (td.tagName == 'TD' && td.parentNode.className == 'days')
    {
      var day   = parseInt(td.innerHTML);
      var month = this.currentDate.getMonth() + 1;
      if (td.hasClassName('wrong')) {
        month = month + (day > 15 ? -1 : 1);
      }
      var date = this.formatDate(this.currentDate.getFullYear(), month, day);
      
      this.selectedDate = this.parseDate(date);
      this.input.value = date;
      this.picker.hide();
    }
  }
}

Alpha.UI.DatePicker.prototype.setPreviousMonth = function()
{
  var date = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
	this.setDate(date);
}

Alpha.UI.DatePicker.prototype.setNextMonth = function()
{
  var date = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 2, this.currentDate.getDate());
	this.setDate(date);
}

Alpha.UI.DatePicker.prototype.computeDaysInMonth = function(year, month)
{
  // leap year?
  if (month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) {
   return 29;
  }

  // standard year
  var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

Alpha.UI.DatePicker.prototype.formatDate = function(y, m, d) {
	return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
}


Alpha.UI.DatePicker.prototype.parseDate = function(datetime)
{
  var date = datetime.trim().substring(0, 10).split('-');
  return new Date(date[0], date[1] - 1, date[2]);
}

