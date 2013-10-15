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
    suite("recomputeMode", function() {
      suite("when called", function() {
        setup( function() {
          d3.chart("BaseChart").extend("BChart", {
            modes: {
              mode: sinon.spy(function() {
                return true;
              })
            }
          });
          this.myChart = d3.select("#vis").chart("BChart");
        });

        test("checks modes", function() {
          assert.equal(this.myChart.modes.mode.callCount, 1);
          var changed = this.myChart.recomputeMode();
          assert.equal(changed, false);
          assert.equal(this.myChart.modes.mode.callCount, 2);
        });
      });

      suite("returns", function() {
        setup(function() {
          var self = this;
          this.state = true;
          d3.chart("BaseChart").extend("BChart", {
            modes: {
              mode: sinon.spy(function() {
                return self.state;
              }),
              anothermode : sinon.spy(function() {
                return !self.state;
              })
            }
          });
          this.myChart = d3.select("#vis").chart("BChart");
        });

        test("false when mode hasn't changed", function() {
          var changed = this.myChart.recomputeMode();
          assert(!changed);
        });
        test("true when mode changes", function() {
          this.state = false;
          var changed = this.myChart.recomputeMode();
          assert(changed);
        });
      });
    });
  });
});