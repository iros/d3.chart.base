/* global d3,$,Modernizr */
$(function() {

  // define a basic rect chart
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

    transform: function(data) {
      var chart = this;

      chart.data = data;

      return data;
    },

    initialize: function() {

      var chart = this;

      // create an xScale
      this.xScale = d3.scale.linear()
        .range([0, this.width()]);

      // when the width changes, update the x scale range
      chart.on("change:width", function(newWidth) {
        chart.xScale.range([0, newWidth]);
      });

      // add a boxes layer
      this.layer("boxes", this.base.append("g"), {
        modes : ["web", "tablet"],
        dataBind: function(data) {
          var chart = this.chart();

          // update the x scale domain when 
          // new data comes in
          chart.xScale.domain([
            Math.min.apply(null, data),
            Math.max.apply(null, data)
          ]);

          return this.selectAll("rect")
            .data(data);
        },

        // insert semi transparent blue rectangles
        // of height and width 10.
        insert: function() {
          var chart = this.chart();
          var selection =  this.append("rect");

          return selection;
        },

        // for new and updating elements, reposition
        // them according to the updated scale.
        events: {
          "merge" : function() {
            var chart = this.chart();
            var selection = this;
            if (chart.mode() === "tablet") {
              selection.attr("width", 10)
                .attr("height", 10);
            } else  if (chart.mode() === "web") {
              selection.attr("width", 50)
                .attr("height", 50);
            }
            selection.style("fill", "blue")
              .style("opacity", "0.5");

            selection.attr("x", function(d) {
              return chart.xScale(d);
            }).attr("y", chart.height()/2);

            return selection;
          }
        }
      });

      // for mobile, add a small text layer
      this.layer("mobile-text", this.base.append("g"), {
        modes: ["mobile"],
        dataBind: function(data) {
          return this.selectAll("text")
            .data([data.length]);
        },

        insert: function() {
          var chart = this.chart();
          return this.append("text")
            .style("fill", "blue")
            .attr("y", "10%")
            .attr("x", 10);
        },
        events: {
          merge : function() {
            return this.text(function(d) {
              return "There are " + d + " boxes painted on the screen";
            });
          }
        }
      });
    }
  });

  var data = [15, 20, 90, 110, 150, 200, 220, 340, 480];
  var rects = d3.select("#vis")
    .append("svg")
    .chart("RectChart")
    .width("80%")
    .height("50%");

  rects.draw(data);

  // bind to the input boxes and redraw
  // the chart when the width/height values
  // are changed
  $("#width_box").on("keyup", function(e){
    var newWidth = +($(e.target).val());
    rects.width(newWidth);
  });

  $("#height_box").on("keyup", function(e){
    var newHeight = +($(e.target).val());
    rects.height(newHeight);
  });
}());