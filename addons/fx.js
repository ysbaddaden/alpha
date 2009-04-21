
// IMPROVE: Transparently handle dimension (em, px, %, etc)?

var Fx = function(self, styles, duration, transition)
{
  var interval = 40;
  var occurences = duration / 1000 * interval, n = 0, nextStyles = {};
  transition = transition || 'linear';
  
  setInitialState();
  run();
  
  function run()
  {
    self.setStyle(nextStyles);
    
    if (++n < occurences)
    {
      setTimeout(run, 1000 / interval);
      computeNextIncrement(n);
    }
  }
  
  function setInitialState()
  {
    var nextStyles = [];
    for (var s in styles)
    {
      if (!(styles[s] instanceof Array))
      {
        var v = self.getStyle(s).replace('px', '');
//        var v = getStyle(s);
        styles[s]     = [v, styles[s]];
        nextStyles[s] = [v, styles[s]];
      }
    }
  }
  /*
  function getStyle(s)
  {
    switch(s)
    {
      case 'width':  return self.clientWidth;
      case 'height': return self.clientHeight;
      default: return self.getStyle(s);
    }
  }
  */
  function computeNextIncrement(i)
  {
    for (var s in styles)
    {
      if (styles[s][0] instanceof Color)
      {
        var r = Math.round(Fx.transitions[transition](styles[s][0].r, styles[s][1].r, occurences, n));
        var g = Math.round(Fx.transitions[transition](styles[s][0].g, styles[s][1].g, occurences, n));
        var b = Math.round(Fx.transitions[transition](styles[s][0].b, styles[s][1].b, occurences, n));
        var a = Math.round(Fx.transitions[transition](styles[s][0].a, styles[s][1].a, occurences, n));
        nextStyles[s] = new Color([r, g, b, a]);
      }
      else {
        nextStyles[s] = Fx.transitions[transition](styles[s][0], styles[s][1], occurences, i);
      }
    }
  }
}

Fx.transitions = {};
Fx.transitions.linear = function(from, to, occurences, n)
{
  if (from == to) {
    return from;
  }
  var v = ((to - from) / occurences * n);
  return (from > to) ? from + v : v;
}

Element.prototype.fx = function(styles, duration, transition) {
  new Fx(this, styles, duration, transition);
}

