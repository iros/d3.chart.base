/* global suite,test,d3,assert,sinon,setup */

suite("BaseChart", function() {
  suite("Constructor", function() {
    test("Creates a new base chart", function() {
      var chart = d3.chart("Test", {});
      assert.equal(chart, d3.chart("Test"));
    });
  });

  suite("Height", function() {
    test("`height` can set fixed height", function() {
      this.myChart = d3.select("#vis").chart("BaseChart");
      this.myChart.height(100);
      assert.equal(this.myChart.height(), 100);
    });
    suite("Variable", function() {
      setup(function() {
        this.myChart = d3.select("#vis")
        .style("height", "300px")
        .style("width", "300px")
        .style("display", "inline-block")
        .append("div")
        .chart("BaseChart");
      });
      test("`height` can set variable height", function() {
        this.myChart.height("100%");
        assert.equal(this.myChart.height(), 300);
      });
      test("`height` will take default 200 when none provided", function() {
        assert.equal(this.myChart.height(), 200);
      });
    });
  });

  suite("Width", function() {
    test("`width` can set fixed width", function() {
      this.myChart = d3.select("#vis").chart("BaseChart");
      this.myChart.width(100);
      assert.equal(this.myChart.width(), 100);
    });
    suite("Variable", function() {
      setup(function() {
        this.myChart = d3.select("#vis")
        .style("height", "300px")
        .style("width", "300px")
        .style("display", "inline-block")
        .append("div")
        .chart("BaseChart");
      });
      test("`width` can set variable height", function() {
        this.myChart.width("100%");
        assert.equal(this.myChart.width(), 300);
      });
      test("`width` will take parent 300 when none provided", function() {
        assert.equal(this.myChart.width(), 300);
      });
    });
  });

  suite("Modes", function() {
    setup(function() {
      d3.chart("BaseChart").extend("AChart", {
        modes: {
          other: sinon.spy(function() {
            return false;
          }),
          truth: sinon.spy(function() {
            return true;
          }),
          nottruth: sinon.spy(function() {
            return false;
          })
        }
      });

      this.myChart = d3.select("#vis").chart("AChart");
    });

    test("Constructor sets mode correctly", function() {
      assert.equal(this.myChart.mode(), "truth");
    });
    test("Mode functions execute until first one is found to be true", function() {
      assert.equal(this.myChart.modes.other.callCount, 1);
      assert.equal(this.myChart.modes.truth.callCount, 1);
      assert.equal(this.myChart.modes.nottruth.callCount, 0);
    });
  });
});