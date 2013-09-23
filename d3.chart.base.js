/*! d3.chart.base - v0.1.0
 *  License: MIT Expat
 *  Date: 2013-05-28
 */
d3.chart("BaseChart", {
  initialize: function() {

    // setup some reasonable defaults
    this._height = 200;
    this.base.attr('height', this._height);

    this._width = 200;
    this.base.attr('width', this._width);

  },

  width: function(newWidth) {
    if (arguments.length === 0) {
      return this._width;
    }

    var oldWidth = this._width;

    this._width = newWidth;

    // only if the width actually changed:
    if (this._width !== oldWidth) {

      // set higher container width
      this.base.attr("width", this._width);

      // trigger a change event
      this.trigger("change:width", this._width, oldWidth);

      // redraw if we saved the data on the chart
      if (this.data) {
        this.draw(this.data);
      }
    }

    // always return the chart, for chaining magic.
    return this;
  },

  height: function(newHeight) {
    if (arguments.length === 0) {
      return this._height;
    }

    var oldHeight = this._height;

    this._height = newHeight;

    if (this._height !== oldHeight) {

      this.base.attr("height", this._height);

      this.trigger("change:height", this._height, oldHeight);

      if (this.data) {
        this.draw(this.data);
      }
    }

    return this;
  }
});