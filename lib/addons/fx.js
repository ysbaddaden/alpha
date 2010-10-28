Alpha.FX = function(element, styles, options)
{
  this.element = element;
  this.styles  = styles;
  this.options = Alpha.mergeObjects(this.options, options);
  
  this.occurences = this.options.duration / 1000 * this.options.interval;
  this.transition = Alpha.FX.transitions[this.options.transition];
}

Alpha.FX.prototype.options = {
  duration: 500,
  transition: 'linear',
  interval: 40,
  onComplete: function() {}
};

Alpha.FX.prototype.run = function()
{
  this.element.setStyle(this.nextStyles);
  
  if (++this.frame < this.occurences)
  {
    setTimeout(this.run.bind(this), 1000 / this.options.interval);
    this.computeNextIncrement(this.frame);
  }
  else {
    this.options.onComplete();
  }
}

Alpha.FX.prototype.setInitialState = function()
{
  this.nextStyles = [];
  for (var s in this.styles)
  {
    if (!(this.styles[s] instanceof Array))
    {
      var v = this.element.getStyle(s).replace('px', '');
      this.styles[s]     = [v, this.styles[s]];
      this.nextStyles[s] = [v, this.styles[s]];
    }
  }
  this.frame = 0;
}

Alpha.FX.prototype.computeNextIncrement = function(i)
{
  for (var s in this.styles)
  {
    if (this.styles[s][0] instanceof Alpha.Color)
    {
      var r = Math.round(this.transition(this.styles[s][0].r, this.styles[s][1].r, this.occurences, i));
      var g = Math.round(this.transition(this.styles[s][0].g, this.styles[s][1].g, this.occurences, i));
      var b = Math.round(this.transition(this.styles[s][0].b, this.styles[s][1].b, this.occurences, i));
      var a = Math.round(this.transition(this.styles[s][0].a, this.styles[s][1].a, this.occurences, i));
      this.nextStyles[s] = new Alpha.Color([r, g, b, a]);
    }
    else {
      this.nextStyles[s] = this.transition(this.styles[s][0], this.styles[s][1], this.occurences, i);
    }
  }
}

Alpha.FX.transitions = {};
Alpha.FX.transitions.linear = function(a, b, occurences, i)
{
  if (a == b) {
    return a;
  }
  var v = ((b - a) / occurences * i);
  return (a > b) ? a + v : v;
}

Element.prototype.fx = function(styles, options)
{
  var f = new Alpha.FX(this, styles, options);
  f.setInitialState();
  f.run();
}

