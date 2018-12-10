import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var outerRadius = 80
var innerRadius = 40

var radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([innerRadius, outerRadius])

var xPositionScale = d3
  .scalePoint()
  .domain(['NYC', 'Tuscon', 'Lima', 'Beijing', 'Stockholm', 'Melbourne'])
  .range([0, width])
  .padding(0.35)

var angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

// var colorScale = d3
//   .scaleLinear()
//   .domain([32, 100])
//   .range(['lightblue', 'pink'])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  svg
    .append('text')
    .text('Average Monthly Temperatures')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('font-size', 30)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')

  svg
    .append('text')
    .text('in cities around the world')
    .attr('x', width / 2)
    .attr('y', 42)
    .attr('font-size', 16)
    .attr('text-anchor', 'middle')

  var charts = svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      var xPos = xPositionScale(d.key)
      return 'translate(' + xPos + ',' + height / 2 + ')'
    })

  charts.each(function(d) {
    var container = d3.select(this)

    d.values.push(d.values[0])

    var circleBands = [20, 40, 60, 80, 100]
    var textBands = [20, 60, 100]

    container
      .selectAll('.bands')
      .data(circleBands)
      .enter()
      .append('circle')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', function(d) {
        return radiusScale(d)
      })

    container
      .append('text')
      .attr('text-anchor', 'middle')
      .text(d.key)
      .attr('font-size', 15)
      .attr('font-weight', 700)
      .attr('alignment-baseline', 'middle')

    container
      .selectAll('.temp-notes')
      .data(textBands)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', function(d) {
        return -1 * radiusScale(d)
      })
      .attr('dy', function(d) {
        return -1
      })
      .attr('fill', '#333')
      .text(function(d) {
        return d + '°'
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)

    container
      .append('path')
      .datum(d.values)
      .attr('d', line)
      .attr('fill', 'salmon')
      .attr('opacity', '0.5')
  })
}
