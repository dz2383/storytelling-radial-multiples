import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 400 - margin.top - margin.bottom

var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var colorScale = d3.scaleOrdinal().range(['#7fc97f', '#beaed4', '#fdc086'])
var xPositionScale = d3
  .scalePoint()
  .domain(['Project 1', 'Project 2', 'Project 3', 'Project 4'])
  .range([0, width])
  .padding(0.4)

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(80)

var pie = d3
  .pie()
  .value(function(d) {
    return d.minutes
  })
  .sort(function(d1, d2) {
    return d1.task.localeCompare(d2.task)
  })

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.project
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
      .attr('d', arc)
      .attr('fill', function(d) {
        return colorScale(d.data.task)
      })

    d3.select(this)
      .append('text')
      .attr('y', 120)
      .text(d.key)
      .attr('text-anchor', 'middle')
  })
}
