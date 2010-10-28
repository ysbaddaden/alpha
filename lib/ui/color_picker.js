// TODO: Test in all browsers.
// TODO: Propose a display:'replace' option that will display the picker in place of the text input.
// TODO: Colorize input's background (choosing the right color for foreground, either white or black).

Alpha.UI.ColorPicker = function(input, options)
{
  this.options = {
    className: ''
  };
  Alpha.mergeObjects(this.options, options || {});
  
  this.input = Alpha.$(input);
  this.input.addEventListener('click', this.display.bind(this), false);
}

Alpha.UI.ColorPicker.prototype.display = function()
{
  if (!this.picker)
  {
    this.picker = new Alpha.UI.Picker(this.input, {
      className: 'color-picker ' + this.options.className
    });
    this.createWidget(this.picker.getContent());
  }
  
	if (this.input.value != '') {
		this.setColor(this.input.value);
	}
  this.picker.display();
}

// Sets the initial color or forces color.
// Positions the crosshair and slider according to color.
Alpha.UI.ColorPicker.prototype.setColor = function(color)
{
	color = new Color(color);
  
	// positions the crosshair
	var x = Math.round(this.data.gradient_w / 100 * color.s);
	var y = Math.round(this.data.gradient_h / 100 * (100 - color.v));
	this.putCrosshair(x, y);
	
	// positions the slider
	var i = Math.round(this.data.hue_h / 360 * color.h);
	this.putSlider(i);
	
	// base color
  this.setBaseColor(this.getHueColor(i));
  this.applyColor(color);
}

// Sets the base color used by the [H]SV gradient.
Alpha.UI.ColorPicker.prototype.setBaseColor = function(color)
{
  var color = new Color(color);
  this.data.base = color;
	this.gradient.style.backgroundColor = color.toString();
}

// Sets picked color
Alpha.UI.ColorPicker.prototype.applyColor = function(color)
{
	color = new Color(color);
	
	this.preview.style.backgroundColor = color.toString();
  this.input.value = color.toString();
  
	if (this.options && this.options.onChange) {
		this.options.onChange(color);
	}
}

Alpha.UI.ColorPicker.prototype.getGradientColor = function(x, y)
{
	this.data.x = x;
	this.data.y = y;
	
	// checks min & max, then linerizes gradient to full 255 colors.
	x = 255 / (this.data.gradient_w - 1) * Math.max(0, Math.min(x, this.data.gradient_w - 1));
	y = 255 / (this.data.gradient_h - 1) * Math.max(0, Math.min(y, this.data.gradient_h - 1));
	
	// computes color
	var r = Math.round((1 - (1 - (this.data.base.r / 255)) * (x / 255)) * (255 - y));
	var g = Math.round((1 - (1 - (this.data.base.g / 255)) * (x / 255)) * (255 - y));
	var b = Math.round((1 - (1 - (this.data.base.b / 255)) * (x / 255)) * (255 - y));
	
	return new Color([r, g, b]);
}

Alpha.UI.ColorPicker.prototype.getHueColor = function(i)
{
	i -= (this.hue.offsetHeight - this.hue.clientHeight) / 2;
	i = Math.max(0, Math.min(i, this.data.hue_h));
	
	var section = this.data.hue_h / 6; // separates each sections
	var c  = i % this.data.hue_h;      // row
	var cs = i % section;              // row in current group
	var l  = (255 / section) * cs;     // color percentage
	
	var h = 255 - l;
	var r = Math.round(c < section ? 255 : c < section * 2 ? h : c < section * 4 ? 0 : c < section * 5 ? l : 255);
	var g = Math.round(c < section ? l : c < section * 3 ? 255 : c < section * 4 ? h : 0);
	var b = Math.round(c < section * 2 ? 0 : c < section * 3 ? l : c < section * 5 ? 255 : h);
	
	return new Color([r, g, b]);
}

Alpha.UI.ColorPicker.prototype.createWidget = function(container)
{
  function new_canvas(className, width, height)
  {
    var c = document.createElement('canvas');
    c.className = className;
    c.setAttribute('width',  width);
    c.setAttribute('height', height);
    return c;
  }
  
  this.gradient  = new_canvas('gradient', 150, 150);
  this.crosshair = new_canvas('crosshair', 15, 15);
  this.hue       = new_canvas('hue', 15, 150);
  this.slider    = new_canvas('slider', 25, 5);
  
  this.preview = document.createElement('div');
  this.preview.className = 'preview';
  
  var gradient_wrapper = document.createElement('div');
  gradient_wrapper.className = 'gradient-wrapper';
  gradient_wrapper.appendChild(this.gradient);
  gradient_wrapper.appendChild(this.crosshair);

  var hue_wrapper = document.createElement('div');
  hue_wrapper.className = 'hue-wrapper';
  hue_wrapper.appendChild(this.hue);
  hue_wrapper.appendChild(this.slider);
  
  container.appendChild(gradient_wrapper);
  container.appendChild(hue_wrapper);
  container.appendChild(this.preview);
  
  
  // values
  // TODO: Move data to options.
  this.data = {
	  x: this.gradient.getAttribute('width'),
	  y: this.gradient.getAttribute('height'),
	  base: {
	    r: 255,
	    g: 0,
	    b: 0
    },
	  gradient_w: this.gradient.getAttribute('width'),
	  gradient_h: this.gradient.getAttribute('height'),
	  hue_w: this.hue.getAttribute('width'),
	  hue_h: this.hue.getAttribute('height')
  };

  // the big gradient
  var ctx = this.gradient.getContext('2d');

  var grad_white = ctx.createLinearGradient(0, 0, this.data.gradient_w, 0);
  grad_white.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad_white.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad_white;
  ctx.fillRect(0, 0, this.data.gradient_w, this.data.gradient_h);

  var grad_black = ctx.createLinearGradient(0, 0, 0, this.data.gradient_h);
  grad_black.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
  grad_black.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad_black;
  ctx.fillRect(0, 0, this.data.gradient_w, this.data.gradient_h);

  // the small gradient
  var ctx = this.hue.getContext('2d');

  var grad = ctx.createLinearGradient(0, 0, 0, this.data.hue_h);
  var section = 1.0 / 6;
  grad.addColorStop(0.0,         'rgba(255,   0,   0, 1.0)');
  grad.addColorStop(section * 1, 'rgba(255, 255,   0, 1.0)');
  grad.addColorStop(section * 2, 'rgba(0,   255,   0, 1.0)');
  grad.addColorStop(section * 3, 'rgba(0,   255, 255, 1.0)');
  grad.addColorStop(section * 4, 'rgba(0,     0, 255, 1.0)');
  grad.addColorStop(section * 5, 'rgba(255,   0, 255, 1.0)');
  grad.addColorStop(1.0,         'rgba(255,   0,   0, 1.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, this.data.hue_w, this.data.hue_h);

  // the crosshair
  var ctx         = this.crosshair.getContext('2d');
  ctx.lineWidth   = 1;
  ctx.lineCap     = 'butt';
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(7.5, 0); ctx.lineTo(7.5, 7); ctx.moveTo(7.5, 8); ctx.lineTo(7.5, 15);
  ctx.moveTo(0, 7.5); ctx.lineTo(7, 7.5); ctx.moveTo(8, 7.5); ctx.lineTo(15, 7.5);
  ctx.stroke();

  // the slider
  var ctx       = this.slider.getContext('2d');
  ctx.lineWidth = 1;
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(0, 0);  ctx.lineTo(5, 2.5);  ctx.lineTo(0, 5);  ctx.lineTo(0, 0);
  ctx.moveTo(25, 0); ctx.lineTo(20, 2.5); ctx.lineTo(25, 5); ctx.lineTo(25, 0);
  ctx.fill();
  
  new Alpha.UI.ColorPicker.Crosshair(this);
  new Alpha.UI.ColorPicker.Slider(this);
}

Alpha.UI.ColorPicker.prototype.putCrosshair = function(x, y)
{
	this.crosshair.style.left = x - Math.floor(this.crosshair.getAttribute('width')  / 2) + 'px';
	this.crosshair.style.top  = y - Math.floor(this.crosshair.getAttribute('height') / 2) + 'px';
}

Alpha.UI.ColorPicker.prototype.putSlider = function(pos) {
	this.slider.style.top = pos - Math.floor(this.slider.getAttribute('height') / 2) + 'px';
}

// handles the slider
Alpha.UI.ColorPicker.Slider = function(picker)
{
	var dragging = false;
	
	function getPosition(evt)
	{
		var pos = picker.hue.getPosition();
		return Math.min(picker.data.hue_h - 1, Math.max(0, evt.pageY - pos.y));
	}
	
  function getCrosshairPosition()
  {
	  var pos   = picker.crosshair.getPosition();
	  var g_pos = picker.gradient.getPosition();
	  pos.x -= g_pos.x;
	  pos.y -= g_pos.y;
    return pos;
  }

	function start(evt)
	{
		dragging = true;
		picker.hue.addEventListener('mousemove', move, null);
		window.addEventListener('mouseup', stop, null);
		move(evt);
	}
	
	function stop(evt)
	{
		dragging = false;
		picker.hue.removeEventListener('mousemove', move, null);
		window.removeEventListener('mouseup', stop, null);
	}
	
	function move(evt)
	{
		if (dragging)
		{
			evt.preventDefault();
			
			var s_pos = getPosition(evt);
			var c_pos = getCrosshairPosition();
			
			picker.putSlider(s_pos);
			picker.setBaseColor(picker.getHueColor(s_pos));
			picker.applyColor(picker.getGradientColor(c_pos.x, c_pos.y));
		}
	}
	
	picker.hue.addEventListener('mousedown', start, null);
	picker.slider.addEventListener('mousedown', start, null);
}

Alpha.UI.ColorPicker.Crosshair = function(picker)
{
  var dragging = false;
  
  function getPosition(evt)
  {
    var pos = picker.gradient.getPosition();
    var x = Math.min(picker.data.gradient_w - 1, Math.max(0, evt.pageX - pos.x));
    var y = Math.min(picker.data.gradient_h - 1, Math.max(0, evt.pageY - pos.y));
    return {x: x, y: y};
  }
  
  function start(evt)
  {
  	dragging = true;
    picker.gradient.addEventListener('mousemove', move, false);
    window.addEventListener('mouseup', stop, false);
    move(evt);
  }
  
  function stop(evt)
  {
    dragging = false;
    picker.gradient.removeEventListener('mousemove', move, false);
    window.removeEventListener('mouseup', stop, false);
  }
  
  function move(evt)
  {
    if (dragging)
    {
	    evt.preventDefault();
		
	    var pos = getPosition(evt);
	    picker.putCrosshair(pos.x, pos.y);
	    picker.applyColor(picker.getGradientColor(pos.x, pos.y));
    }
  }
  
  picker.gradient.addEventListener('mousedown', start, false);
  picker.crosshair.addEventListener('mousedown', start, false);
}

