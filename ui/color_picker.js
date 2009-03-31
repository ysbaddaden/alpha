
UI.ColorPicker = function(input, options)
{
  var gradient, crosshair, hue, slider, color_preview, data;
  
  this.options = {
    className: ''
  }
  this.options.merge(options || {});
  
  
  this.display = function()
  {
    if (!this.picker) {
      this.createPicker();
    }
  	if (input.value != '') {
  		this.setColor(input.value);
  	}
    this.picker.display();
  }
  
  input = kokone.$(input);
  input.addEventListener('click', this.display.bind(this), false);
  
  
	// positions the crosshair and slider, depending on given color.
	this.setColor = function(color)
	{
		color = new Color(color);
    
		// positions the crosshair
		var x = Math.round(data.gradient_w / 100 * color.s);
		var y = Math.round(data.gradient_h / 100 * (100 - color.v));
		putCrosshair(x, y);
		
		// positions the slider
		var i = Math.round(data.hue_h / 360 * color.h);
		putSlider(i);
		
		// the base color
    setBaseColor(getHueColor(i));
		setColor(color);
	}
	
  function new_canvas(className, width, height)
  {
    var c = document.createElement('canvas');
    c.className = className;
    c.setAttribute('width',  width);
    c.setAttribute('height', height);
    return c;
  }

  
	// Sets the base color used by the [H]SV gradient.
	function setBaseColor(color)
	{
	  data.base = new Color(color);
		gradient.style.backgroundColor = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
	}
	
	// Sets the color from position of crosshair on [H]SV gradient.
	function setColor(color)
	{
	  color = new Color(color);
	  
		color_preview.style.backgroundColor = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
    input.value = color.toString();
		
		if (options && options.onChange) {
			options.onChange(color.toString());
		}
	}
	
	function getGradientColor(x, y)
	{
		data.x = x;
		data.y = y;
		
		// checks min & max, then linerizes gradient to full 255 colors.
		x = 255 / (data.gradient_w - 1) * Math.max(0, Math.min(x, data.gradient_w - 1));
		y = 255 / (data.gradient_h - 1) * Math.max(0, Math.min(y, data.gradient_h - 1));
		
		// computes color
		var r = Math.round((1 - (1 - (data.base.r / 255)) * (x / 255)) * (255 - y));
		var g = Math.round((1 - (1 - (data.base.g / 255)) * (x / 255)) * (255 - y));
		var b = Math.round((1 - (1 - (data.base.b / 255)) * (x / 255)) * (255 - y));
		
		return new Color([r, g, b]);
	}
	
	function getHueColor(i)
	{
		i -= (hue.offsetHeight - hue.clientHeight) / 2;
		i = Math.max(0, Math.min(i, data.hue_h));
		
		var section = data.hue_h / 6;   // separates each sections
		var c  = i % data.hue_h;        // row
		var cs = i % section;           // row in current group
		var l = (255 / section) * cs;   // color percentage
		
		var h = 255 - l;
		var r = Math.round(c < section ? 255 : c < section * 2 ? h : c < section * 4 ? 0 : c < section * 5 ? l : 255);
		var g = Math.round(c < section ? l : c < section * 3 ? 255 : c < section * 4 ? h : 0);
		var b = Math.round(c < section * 2 ? 0 : c < section * 3 ? l : c < section * 5 ? 255 : h);
		
		return new Color([r, g, b]);
	}
	
  this.createPicker = function()
  {
    this.picker = new UI.Picker(input, {
      className: 'color-picker ' + this.options.className
    });
    
    gradient  = new_canvas('gradient', 150, 150);
    crosshair = new_canvas('crosshair', 15, 15);
    hue       = new_canvas('hue', 15, 150);
    slider    = new_canvas('slider', 25, 5);
    
    color_preview = document.createElement('div');
    color_preview.className = 'color';
    
    var gradient_wrapper = document.createElement('div');
    gradient_wrapper.className = 'gradient-wrapper';
    gradient_wrapper.appendChild(gradient);
    gradient_wrapper.appendChild(crosshair);

    var hue_wrapper = document.createElement('div');
    hue_wrapper.className = 'hue-wrapper';
    hue_wrapper.appendChild(hue);
    hue_wrapper.appendChild(slider);
    
	  // values
	  data = {
		  x: gradient.getAttribute('width'),
		  y: gradient.getAttribute('height'),
		  base: {r: 255, g: 0, b: 0},
		
		  gradient_w: gradient.getAttribute('width'),
		  gradient_h: gradient.getAttribute('height'),
		
		  hue_w: hue.getAttribute('width'),
		  hue_h: hue.getAttribute('height')
	  };

	  // the big gradient
	  var ctx = gradient.getContext('2d');

	  var grad_white = ctx.createLinearGradient(0, 0, data.gradient_w, 0);
	  grad_white.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
	  grad_white.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
	  ctx.fillStyle = grad_white;
	  ctx.fillRect(0, 0, data.gradient_w, data.gradient_h);

	  var grad_black = ctx.createLinearGradient(0, 0, 0, data.gradient_h);
	  grad_black.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
	  grad_black.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
	  ctx.fillStyle = grad_black;
	  ctx.fillRect(0, 0, data.gradient_w, data.gradient_h);
	
	  // the small gradient
	  var ctx = hue.getContext('2d');

	  var grad = ctx.createLinearGradient(0, 0, 0, data.hue_h);
	  var section = 1.0 / 6;
	  grad.addColorStop(0.0,         'rgba(255,   0,   0, 1.0)');
	  grad.addColorStop(section * 1, 'rgba(255, 255,   0, 1.0)');
	  grad.addColorStop(section * 2, 'rgba(0,   255,   0, 1.0)');
	  grad.addColorStop(section * 3, 'rgba(0,   255, 255, 1.0)');
	  grad.addColorStop(section * 4, 'rgba(0,     0, 255, 1.0)');
	  grad.addColorStop(section * 5, 'rgba(255,   0, 255, 1.0)');
	  grad.addColorStop(1.0,         'rgba(255,   0,   0, 1.0)');
	  ctx.fillStyle = grad;
	  ctx.fillRect(0, 0, data.hue_w, data.hue_h);
	
	  // the crosshair
	  var ctx         = crosshair.getContext('2d');
	  ctx.lineWidth   = 1;
	  ctx.lineCap     = 'butt';
	  ctx.strokeStyle = '#000';
	  ctx.beginPath();
	  ctx.moveTo(7.5, 0); ctx.lineTo(7.5, 7); ctx.moveTo(7.5, 8); ctx.lineTo(7.5, 15);
	  ctx.moveTo(0, 7.5); ctx.lineTo(7, 7.5); ctx.moveTo(8, 7.5); ctx.lineTo(15, 7.5);
	  ctx.stroke();
	
	  // the slider
	  var ctx         = slider.getContext('2d');
	  ctx.lineWidth   = 1;
	  ctx.lineCap     = 'round';
	  ctx.lineJoin    = 'round';
	  ctx.fillStyle   = '#333';
	  ctx.beginPath();
	  ctx.moveTo(0, 0); ctx.lineTo(5, 2.5); ctx.lineTo(0, 5); ctx.lineTo(0, 0);
	  ctx.moveTo(25, 0); ctx.lineTo(20, 2.5); ctx.lineTo(25, 5); ctx.lineTo(25, 0);
	  ctx.fill();
    
    // picker's content
    var content = document.createElement('div');
    content.appendChild(gradient_wrapper);
    content.appendChild(hue_wrapper);
    content.appendChild(color_preview);
    this.picker.setContent(content);
    
    new Crosshair();
    new Slider();
  }
  
  
	function putCrosshair(x, y)
	{
		crosshair.style.left = x - Math.floor(crosshair.getAttribute('width')  / 2) + 'px';
		crosshair.style.top  = y - Math.floor(crosshair.getAttribute('height') / 2) + 'px';
	}
	
	function putSlider(pos) {
		slider.style.top = pos - Math.floor(slider.getAttribute('height') / 2) + 'px';
	}
  
  function getCrosshairPosition()
  {
		var c_pos = crosshair.getPosition();
		var g_pos = gradient.getPosition();
		c_pos.x -= g_pos.x;
		c_pos.y -= g_pos.y;
    return c_pos;
  }
  
	// handles the slider
	function Slider()
	{
		var dragging = false;
		
		function getPosition(evt)
		{
			var pos = hue.getPosition();
			return Math.min(data.hue_h - 1, Math.max(0, evt.pageY - pos.y));
		}
		
		function start(evt)
		{
			dragging = true;
			hue.addEventListener('mousemove', move, null);
			window.addEventListener('mouseup', stop, null);
			move(evt);
		}
		
		function stop(evt)
		{
			dragging = false;
			hue.removeEventListener('mousemove', move, null);
			window.removeEventListener('mouseup', stop, null);
		}
		
		function move(evt)
		{
			if (dragging)
			{
				evt.preventDefault();
				
				var pos = getPosition(evt);
				putSlider(pos);
				
				setBaseColor(getHueColor(pos));
				pos = getCrosshairPosition();
				setColor(getGradientColor(pos.x, pos.y));
			}
		}
		
		hue.addEventListener('mousedown', start, null);
		slider.addEventListener('mousedown', start, null);
	}
	
  function Crosshair()
  {
    var dragging = false;
    
    function getPosition(evt)
    {
	    var pos = gradient.getPosition();
	    var x = Math.min(data.gradient_w - 1, Math.max(0, evt.pageX - pos.x));
	    var y = Math.min(data.gradient_h - 1, Math.max(0, evt.pageY - pos.y));
	    return {x: x, y: y};
    }
    
    function start(evt)
    {
    	dragging = true;
	    gradient.addEventListener('mousemove', move, false);
	    window.addEventListener('mouseup', stop, false);
	    move(evt);
    }
    
    function stop(evt)
    {
	    dragging = false;
	    gradient.removeEventListener('mousemove', move, false);
	    window.removeEventListener('mouseup', stop, false);
    }
    
    function move(evt)
    {
	    if (dragging)
	    {
		    evt.preventDefault();
			
		    var pos = getPosition(evt);
		    putCrosshair(pos.x, pos.y);
		    setColor(getGradientColor(pos.x, pos.y));
	    }
    }
    
    gradient.addEventListener('mousedown', start, false);
    crosshair.addEventListener('mousedown', start, false);
  }
}
