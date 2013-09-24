(function(d3) {

  // obtains element computed style
  // context is chart
  function _style(attr) {
    var style,
      element = this.base[0][0];
    if (window.getComputedStyle) {
      style = window.getComputedStyle(element);
    } else if (element.currentStyle) {
      style = element.currentStyle;
    }

    if (!attr) {
      return style;
    } else {
      return style[attr];
    }
  }

  // converts pixel values
  var _toNumFromPx = (function() {
    var rx = /px$/;
    return function(value) {
      if (rx.test(value)) {
        return +(value.replace(rx, ""));
      } else {
        return value;
      }
    };
  }());


  // helper attribute setter on chart base.
  // context is chart
  function _initAttr(internalName, d3Name, defaultValue) {
    var current = _toNumFromPx(_style.call(this, d3Name));

    if (current === null || current === 0 || current === "") {
      this[internalName] = defaultValue;
      this.base.attr(d3Name, defaultValue);
    } else {
      this[internalName] = _toNumFromPx(_style.call(this, d3Name));
    }
  }

  // debounces function
  function _throttle(func, wait, options) {
    // var timeoutId = -1;
    // return function() {
    //   if (timeoutId > -1) {
    //     window.clearTimeout(timeoutId);
    //   }
    //   timeoutId = window.setTimeout(fn, timeout);
    // };

    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  function _determineMode() {
    var oldMode = this._currentMode;
    this._currentMode = null;

    // go over existing modes and determine which we are in
    if ("modes" in this) {
      var result = false;
      for (var mode in this._modes) {
        result = this._modes[mode].call(this);
        if (result) {
          this._currentMode = mode;
          break;
        }
      }
    }

    return oldMode !== this._currentMode;
  }

  var BaseChart = d3.chart("BaseChart", {
    initialize: function() {

      var chart = this;
      // layer structures container - for layers that are
      // created on initialize but do not actually need to 
      // be rendered in the detected mode, we need to save the
      // actual arguments so that we can construct it later.
      this._layersArguments = {};

      // save mode functions
      this._modes = this.modes || {};
      delete this.modes;

      // store layers referenced per mode
      this._modeLayers = {};

      // determine current mode on initialization
      _determineMode.call(this);

      // setup some reasonable defaults
      chart._width  = _toNumFromPx(_style.call(chart, "width")) || 200;
      chart._height = _toNumFromPx(_style.call(chart, "height")) || 200;

      // make sure container height and width are set.
      _initAttr.call(this, "_width", "width", 200);
      _initAttr.call(this, "_height", "height", 200);

      // capture resize start so that we can
      // capture the difference in height/width change
      // and then determine the mode appropriatly
      var initResize = function() {
        chart.trigger("_resize:start");
        window.removeEventListener("resize", initResize);
      };
      window.addEventListener("resize", initResize);

      var oldWidth, oldHeight;

      // on window resize start, capture height and width
      chart.on("_resize:start", function() {
        oldWidth = chart._width;
        oldHeight = chart._height;
      });

      // bind to winow resize end
      window.addEventListener("resize", _throttle(function() {

        chart.trigger("_resize:end");

        // update current mode
        var changed = _determineMode.call(chart);
        if (changed) {
          chart.trigger("mode:change", this._currentMode);
        }

        // rebind capturing size on beginning
        window.addEventListener("resize", initResize);
      }, 60));

      // on mode change, update height and width, and redraw
      // the chart
      chart.on("mode:change", function() {
        // re-render chart
        chart._width  = _toNumFromPx(_style.call(chart, "width"));
        chart._height = _toNumFromPx(_style.call(chart, "height"));

        // only redraw if there is data
        if (chart.data) {
          chart.draw(chart.data);
        }
      });
    },

    // returns current mode
    mode : function() {
      return this._currentMode;
    },

    width: function(newWidth) {
      if (arguments.length === 0) {
        return _toNumFromPx(_style.call(this, "width"));
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
        return _toNumFromPx(_style.call(this, "height"));
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
  
  var oldLayer = BaseChart.prototype.layer;
  BaseChart.prototype.layer = function(name, selection, options) {

    var chart = this;

    chart._layersArguments[name] = arguments;

    // save all the layer arguments
    var layer;
    if (typeof options.modes === "undefined" ||
        ("modes" in options &&
          options.modes.indexOf(chart.mode()) > -1)) {

      // run default layer code
      layer = oldLayer.call(this, name, selection, options);
    }

    // register modes
    if ("modes" in options) {

      if (layer) {
        // save available modes on the layer
        layer._modes = options.modes;
      }

      options.modes.forEach(function(mode) {
        
        // make sure mode exists
        if (mode in chart._modes) {
          
           chart._modeLayers[mode] = chart._modeLayers[mode] || [];

           // save the layer as being mapped to this mode.
           chart._modeLayers[mode].push(name);

        } else {
          throw new Error("Mode " + mode + " is not defined");
        }
      });

    // make sure this layer has all modes if none were
    // specified as an option.  
    } else if (chart._modes) {
      
      var allModes = Object.keys(chart._modes);
      
      if (layer) {
        layer._modes = allModes;
      }

      allModes.forEach(function(mode) {
        chart._modeLayers[mode] = chart._modeLayers[mode] || [];
        chart._modeLayers[mode].push(name);
      });
    }

    return layer;
  };

}(window.d3));