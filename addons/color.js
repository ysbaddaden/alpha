/**
 * Linearizes a color, whatever it's input format (hex or RGB).
 * 
 * new Color('#FFF');
 * new Color('#0000FA');
 * new Color('rgb(128, 78, 34)');
 * new Color('rgba(128, 78, 34, 0.5)');
 * new Color([0, 0, 0])
 * new Color([0, 0, 0, 1.0])
 * new Color([r: 0, g: 0, b: 0])
 * new Color([r: 0, g: 0, b: 0, a: 1.0])
 *
 * new Color('#FFF').toRGB() // 'rgb(255, 255, 255)'
 * new Color('#FFF').toRGBA(.75) // 'rgb(255, 255, 255, 0.75)'
 * new Color([r: 0, g: 0, b: 0, a: 1.0]).toRGBA() // 'rgb(0, 0, 0, 1.0)'
 * new Color('#FFF').toHex() // '#FFFFFF'
 */
function Color(color)
{
  if (color instanceof Color) {
    return color;
  }
  else if (typeof color == 'string')
  {
    color = color.trim();
    if (color.indexOf('#') > -1)
    {
      if (color.length == '4')
      {
        // #FFF
        this.r = parseInt(color[1] + color[1], 16);
        this.g = parseInt(color[2] + color[2], 16);
        this.b = parseInt(color[3] + color[3], 16);
      }
      else if (color.length == '7')
      {
        // #0000FA
        this.r = parseInt(color.substr(1, 2), 16);
        this.g = parseInt(color.substr(3, 2), 16);
        this.b = parseInt(color.substr(5, 2), 16);
      }
    }
    else 
    {
      var parts = color.match(/rgb[a]?\(([\d\s]+),([\d\s]+),([\d\s]+)(?:,([\d\s\.]+))?\)/i);
      console.log(parts);
      
      if (parts)
      {
        // rgb(0, 0, 0) or rgba(0, 0, 0, .5)
        this.r = parseInt(parts[1].trim(), 10);
        this.g = parseInt(parts[2].trim(), 10);
        this.b = parseInt(parts[3].trim(), 10);
        this.a = parts[4] ? parseFloat(parts[4].trim(), 10) : null;
      }
      else {
        throw new Error("Not a color: " + color);
      }
    }
  }
  else if (typeof (color) == 'object' && color.r && color.g && color.b)
  {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }
  else if (color instanceof Array && color.length >= 3)
  {
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    this.a = color[3];
  }
  else {
    throw new Error("Not a color: " + color);
  }

  // RGB to HSV (HSB)
	var max   = Math.max(this.r, this.g, this.b);
	var min   = Math.min(this.r, this.g, this.b);
	var delta = (max - min);
	
	this.v = max;
	this.s = (max != 0) ? 255 * delta / max : 0;
	if (this.s != 0)
	{
		if (max == this.r) {
			this.h = (this.g - this.b) / delta;
		}
		else if (max == this.g) {
			this.h = 2.0 + (this.b - this.r) / delta;
		}
		else if (max == this.b) {
			this.h = 4.0 + (this.r - this.g) / delta;
		}
	}
	else {
		this.h = 0;
	}
	this.h *= 60;
	if (this.h < 0) {
		this.h += 360;
	}
	this.h = Math.round(this.h);
	this.s = Math.round(this.s * 100 / 255);
	this.v = Math.round(this.v * 100 / 255);
}

Color.prototype.a = 1.0;

Color.prototype.r = 1.0;
Color.prototype.g = 1.0;
Color.prototype.b = 1.0;

Color.prototype.h = 1.0;
Color.prototype.s = 1.0;
Color.prototype.v = 1.0;

Color.prototype.toRGB = function() {
  return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
}

Color.prototype.toRGBA = function(a) {
  return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + (a || this.a) + ')';
}

Color.prototype.toHex = function()
{
  var r = this.r.toString(16).toUpperCase();
  var g = this.g.toString(16).toUpperCase();
  var b = this.b.toString(16).toUpperCase();
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  return '#' + r + g + b;
}

Color.prototype.toString = function() {
  return this.toHex();
}

