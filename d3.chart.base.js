/*! d3.chart.base - v0.1.1
 *  License: MIT Expat
 *  Date: 2013-09-23
 */
(function(d3) {

  // helper attribute setter 
  function _initAttr(internalName, d3Name, defaultValue) {
    if (!this.base.attr(d3Name)) {
      this[internalName] = defaultValue;
      this.base.attr(d3Name, defaultValue);
    } else {
      this[internalName] = this.base.attr(d3Name);
    }
  }

  d3.chart("BaseChart", {
    initialize: function() {

      var chart = this;

      // setup some reasonable defaults
      chart._width  = chart.base.attr("width") || 200;
      chart._height = chart.base.attr("height") || 200;

      // make sure container height and width are set.
      _initAttr.call(this, "_width", "width", 200);
      _initAttr.call(this, "_height", "height", 200);
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
}(window.d3));