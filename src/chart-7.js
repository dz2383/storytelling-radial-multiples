import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var times = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

let radius = 250

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

let blueScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([45000, 20000])
let redScale = d3.scaleSequential(d3.interpolateYlOrBr).domain([35000, 70000])

let angleScale = d3.scaleBand().range([0, Math.PI * 2])

let line = d3
  .radialArea()
  .angle(d => angleScale(d.time))
  .outerRadius(d => radiusScale(40000))
  .innerRadius(d => radiusScale(d.total))

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  let holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let allTimes = datapoints.map(d => d.time)
  datapoints.push(datapoints[0])
  angleScale.domain(allTimes)

  console.log(datapoints)

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')

  holder
    .selectAll('.time-labels')
    .data(times)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radius)
    .attr('dy', 25)
    .text(d => {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return parseInt(d.replace(':00', ''))
      }
    })
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .append('circle')
    .attr('r', radius)
    .attr('fill', 'none')
    .attr('stroke', 'grey')

  holder
    .selectAll('.bulbs')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', 0)
    .attr('cy', -radius)
    .attr('fill', 'grey')
    .attr('stroke', 'white')
    .attr('stroke-width', 3)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  let bands = d3.range(0, 80000, 1000)

  holder
    .append('g')
    .attr('mask', 'url(#births)')
    .selectAll('.bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', d => {
      if(d < 40000) {
        return blueScale(d)
      } else {
        return redScale(d)
      }
    })
    .lower()
}
