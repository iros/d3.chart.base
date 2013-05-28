# d3.chart.base

The `BaseChart` is a very small chart from which one can extend to build
other d3.chart based charts. The purpose of the d3.chart.base is to provide
common functionality that may be repetitive, such as creating height/width
getters/setters. By default, `BaseChart` doesn't actually render anything
itself and it has no layers.

These are the only two getters/setters available in the base.
They take care of:

* Returning the value when no new value is provided
* Saving the new value
* Updating the chart base height/width
* Redrawing the chart if the chart has data saved in a `.data` property
* Broadcast a `change:width` or `change:height` events when the width/height changes

We expect the base functionality to grow as we see more common pattenrs. Please
submit issues when you have suggestions!

### Sample Use

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