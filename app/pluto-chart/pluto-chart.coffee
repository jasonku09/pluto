Polymer
  is: 'pluto-chart'

  properties:
    chartWidth:
      type: Number

    chartHeight:
      type: Number

    data:
      type: Array
      observer: 'UpdateChart'

    type:
      type: String

    options:
      type: Object

  UpdateChart: (type, data, options)->
    @$.chart.style.width = @chartWidth + 'px'
    @$.chart.style.height = @chartHeight + 'px'

    if @data
      dataArray = []
      for dataPoint in @data
        dataArray.push
          value: dataPoint.value
          color: dataPoint.color
          label: dataPoint.label
      data = data || dataArray

    chart = @$.chart.getContext("2d")
    options = options || {
        segmentShowStroke : true

        segmentStrokeColor : "#fff"

        segmentStrokeWidth : 2

        animationSteps : 100

        animationEasing : "easeOut"

        animateRotate : true

        animateScale : false

    }
    @chartData = {
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
          },
          {
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
    }
    @chartOptions = {
      scaleShowGridLines : false
      bezierCurve : true
      bezierCurveTension : 0.5
      pointDot : false
      pointDotRadius : 4
      pointHitDetectionRadius : 20
      datasetStroke : false
      datasetFill : true
    }
    setTimeout =>
      switch @type
        when 'line'
          @myChart = new Chart(chart).Line(@chartData,@chartOptions)
        when 'pie'
          @myChart = new Chart(chart).Pie(data,options)
      @myChart.update()
    , 100
