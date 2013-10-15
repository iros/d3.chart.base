# d3.chart.base

The `BaseChart` is a very small chart from which one can extend to build
other d3.chart based charts. The purpose of the d3.chart.base is to provide
common functionality that may be repetitive, such as creating height/width
getters/setters. By default, `BaseChart` doesn't actually render anything
itself and it has no layers.

## Dimensions

The base includes the following getters/setters:

* `height`
* `width`

They take care of:

* Returning the value when no new value is provided
* Saving the new value
* Updating the chart base height/width
* Redrawing the chart if the chart has data saved in a `.data` property
* Broadcast a `change:width` or `change:height` events when the width/height changes

## Modes

To support rendering a chart with different views at different screen/browser sizes, we've 
introduced a concept known as `modes` to the base chart. In practice, when defining
a chart that extends off of the base chart, you can define `modes` that your chart
can be in. For example, using the [`Modernizr`](http://modernizr.com) library, we can
define several modes that are based on different screen sizes (for which we test with
media queries). Mode specification requires a name for the mode as well as a boolean function that returns true/false as to whether the chart is in said mode. 
A chart can only be
in one mode at a time.

```javascript
d3.chart("BaseChart").extend("RectChart", {
    
    modes: {
      mobile : function() {
        return Modernizr.mq("only all and (max-width: 480px)");
      },
      tablet: function() {
        return Modernizr.mq("only all and (min-width: 481px) and (max-width: 768px)");
      },
      web: function() {
        return Modernizr.mq("only all and (min-width: 769px)");
      }
    },
```

The Base chart will take care of switching modes when the screen sizes change (as well
as when the orientation of the devices changes, if a mode needs switching.)

The chart will then be redrawn if it was already drawn once before (aka, has data attached
to it.) Note that the chart will be redrawn on screen resize or device orientation regardless
of a mode change.

Mode changes also trigger an event you can bind to: `"change:mode"` will fire with one
parameter - the current mode name.

Additionally, certain layers can be made to work only in certain modes, for example 
the following boxes layer will only be visible in the web/tablet modes but not in our
`web` mode as defined above.

```javascript
// add a boxes layer
this.layer("boxes", this.base.append("g"), {
  modes : ["web", "tablet"], {...}
});
```

You can always ask the chart which mode you're in by calling `chart.mode()` - note that this is not
a setter. There is no manual way to change the mode a chart is in.

## Other features

We expect the base functionality to grow as we see more common pattenrs. Please
submit issues when you have suggestions!

## Sample Use

See a sample chart in the `examples` folder.
Here is a brief example:

```javascript
d3.chart("BaseChart").extend("MyChart", {
  initialize: function() {
    // ...
  }
});

var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart")
  .height(100)
  .width(200);
```

### API

Sample API Documentation:

#### `<instance>.height(newheight)`

**Description:**

Changes the height of the chart if `newHeight` is provided. Otherwise returns the
current chart height.

**Parameters:**

* `newHeight` - number. Optional. The new height to set.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart")
  .height(200);
```

#### `<instance>.width(newWidth)`

**Description:**

Changes the width of the chart if `newWidth` is provided. Otherwise returns the
current chart width.

**Parameters:**

* `newWidth` - number. Optional. The new width to set.

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart")
  .width(120);
```

#### `<instance>.mode()`

**Description:**

Returns the name of the mode a chart is presently in

**Parameters:**

None

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart")
  .width(120);

chart.mode() // returns "someMode"
```

#### `<instance>.recomputeMode()`

**Description:**

Manually reconputes the current mode

**Parameters:**

None

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart")
  .width(120);

var changed = chart.recomputeMode() // returns true|false
```

### Events

Sample Event Documentation:

#### `change:width`

**Description:**

Broadcast when the chart width changes

**Arguments:**

* `newWidth` - The new width
* `oldWidth` - The old width

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart");

chart.on("change:width", function(newWidth, oldWidth) {
  // handle event...
});
```

#### `change:height`

**Description:**

Broadcast when the chart height changes

**Arguments:**

* `newHeight` - The new height
* `oldHeight` - The old height

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart");

chart.on("change:height", function(newHeight, oldHeight) {
  // handle event...
});
```

#### `change:mode`

**Description:**

Broadcast when the chart mode changes

**Arguments:**

* `newMode` - The new mode

**Uses:**

Example:

```javascript
var chart = d3.select("#vis")
  .append("svg")
  .chart("MyChart");

chart.on("change:mode", function(newMode) {
  // handle event...
});
```

## Changelog

* 2013/10/15 - 0.4.0 - added `recomputeMode()` method to force mode recomputation. It returns true if mode changed, false otherwise.
* 2013/10/10 - adding testing infrastructure and some basic tests.
* 2013/10/08 - 0.3.2 - height/width now set using .style, not .attr to support both svg & dom element use.
* 2013/10/08 - 0.3.1 - made it so that chart is redrawn on resize/device orientation change, not just mode change.
* 2013/10/07 - 0.3.0 - added mode support