import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 400 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 90

var radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([40, radius])

let months = [
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
]

// var angleScale = d3
//   .scalePoint()
//   .domain(months)
//   .range([0, Math.PI * 2])

var arc = d3
  .arc()
  .innerRadius(function(d) {
    return radiusScale(d.data.low_temp)
  })
  .outerRadius(function(d) {
    return radiusScale(d.data.high_temp)
  })

var pie = d3
  .pie()
  .value(1 / 12)
  .sort(null)

var colorScale = d3
  .scaleLinear()
  .domain([32, 85])
  .range(['orange', 'yellow'])

var xPositionScale = d3
  .scalePoint()
  .domain(['NYC', 'Tuscon', 'Lima', 'Beijing', 'Melbourne', 'Stockholm'])
  .range([0, width])
  .padding(0.35)

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
    d3.select(this)
      .selectAll('path')
      .data(pie(d.values))
      .enter()
      .append('path')
      .attr('class', function(d) {
        return d.data.month_name
      })
      .attr('d', arc)
      .attr('fill', function(d) {
        return colorScale(d.data.high_temp)
      })

    d3.select(this)
      .append('circle')
      .attr('fill', '#666')
      .attr('r', 2)

    d3.select(this)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', radius + 40)
      .text(d.key)
      .attr('text-anchor', 'middle')
  })
}
