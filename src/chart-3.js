import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 400 - margin.top - margin.bottom

var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 150

var radiusScale = d3
  .scaleLinear()
  .domain([10, 90])
  .range([40, radius])

var arc = d3
  .arc()
  .innerRadius(function(d) {
    return 0
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

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  container
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('x', 0)
    .attr('y', -140)
    .attr('font-size', 28)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 600)

  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('class', function(d) {
      return d.data.month_name
    })
    .attr('d', arc)
    .attr('fill', function(d) {
      return colorScale(d.data.high_temp)
    })

  container
    .append('circle')
    .attr('fill', '#666')
    .attr('r', 2)
}
