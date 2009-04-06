
// TODO: Autofill the from value (get current's value).

var Fx = function(self, styles, duration, transition)
{
  var interval = 40;
  var occurences = duration / interval, n = 0, nextStyles = {};
  if (!transition) {
    transition = 'linear';
  }
  
  setInitialState();
  run();
  
  function run()
  {
    self.setStyle(nextStyles);
    
    if (++n < occurences)
    {
      setTimeout(run, interval);
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
        styles[s]     = [v, styles[s]];
        nextStyles[s] = [v, styles[s]];
      }
    }
  }
  
  function computeNextIncrement(i)
  {
    for (var s in styles) {
      nextStyles[s] = Fx.transitions[transition](styles[s][0], styles[s][1], occurences, i);
    }
  }
}

Fx.transitions = {};
Fx.transitions.linear = function(from, to, occurences, n)
{
  if (from instanceof Color)
  {
    var r = Math.round(Fx.transitions.linear(from.r, to.r, occurences, n));
    var g = Math.round(Fx.transitions.linear(from.g, to.g, occurences, n));
    var b = Math.round(Fx.transitions.linear(from.b, to.b, occurences, n));
    var a = Math.round(Fx.transitions.linear(from.a, to.a, occurences, n));
    return new Color([r, g, b, a]);
  }
  
  if (from == to) {
    return from;
  }
  var v = ((to - from) / occurences * n);
  return (from > to) ? from + v : v;
}

Element.prototype.fx = function(styles, duration, transition) {
  new Fx(this, styles, duration, transition);
}

