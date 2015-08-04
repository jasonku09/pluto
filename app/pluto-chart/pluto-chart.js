(function() {
  Polymer({
    is: 'pluto-chart',
    properties: {
      chartWidth: {
        type: Number
      },
      chartHeight: {
        type: Number
      },
      data: {
        type: Array,
        observer: 'UpdateChart'
      },
      type: {
        type: String
      },
      options: {
        type: Object
      }
    },
    UpdateChart: function(type, data, options) {
      var chart, dataArray, dataPoint, i, len, ref;
      this.$.chart.style.width = this.chartWidth + 'px';
      this.$.chart.style.height = this.chartHeight + 'px';
      if (this.data) {
        dataArray = [];
        ref = this.data;
        for (i = 0, len = ref.length; i < len; i++) {
          dataPoint = ref[i];
          dataArray.push({
            value: dataPoint.value,
            color: dataPoint.color,
            label: dataPoint.label
          });
        }
        data = data || dataArray;
      }
      chart = this.$.chart.getContext("2d");
      options = options || {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: "easeOut",
        animateRotate: true,
        animateScale: false
      };
      this.chartData = {
        labels: ["", "", "", "", "", "", ""],
        datasets: [
          {
            label: "Burndown",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,0.2)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [60, 50, 40, 30, 20, 10, 0]
          }, {
            label: "Progress",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,0.2)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [60, 42, 35, 33, 12]
          }
        ]
      };
      this.chartOptions = {
        scaleShowGridLines: false,
        bezierCurve: true,
        bezierCurveTension: 0.5,
        pointDot: false,
        pointDotRadius: 4,
        pointHitDetectionRadius: 20,
        datasetStroke: false,
        datasetFill: true
      };
      return setTimeout((function(_this) {
        return function() {
          switch (_this.type) {
            case 'line':
              _this.myChart = new Chart(chart).Line(_this.chartData, _this.chartOptions);
              break;
            case 'pie':
              _this.myChart = new Chart(chart).Pie(data, options);
          }
          return _this.myChart.update();
        };
      })(this), 100);
    }
  });

}).call(this);
