/* global d3,$ */
(function() {

  // define a basic rect chart
  d3.chart("BaseChart").extend("RectChart", {
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
        dataBind: function(data) {
          var chart = this.chart();

          chart.data = data;

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
          return this.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "blue")
            .style("opacity", "0.5");
        },

        // for new and updating elements, reposition
        // them according to the updated scale.
        events: {
          merge : function() {
            var chart = this.chart();

            return this.attr("x", function(d) {
              return chart.xScale(d);
            }).attr("y", chart.height()/2);
          }
        }
      });
    }
  });

  var data = [15, 20, 90, 110, 150, 200, 220, 340, 480];
  var rects = d3.select("#vis")
    .append("svg")
    .chart("RectChart")
    .width(500)
    .height(100);

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