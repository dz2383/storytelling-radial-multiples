import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }

let height = 400 - margin.top - margin.bottom

let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 150
let radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.score))
  .angle(d => angleScale(d.category))

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  let holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  // holder
  //   .append('mask')
  //   .attr('id', 'radar-shape')
  //   .append('path')
  //   .datum(customDatapoints)
  //   .attr('d', line)
  //   .attr('fill', 'white')

  holder
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  holder
    .selectAll('.angle-text')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    .attr('font-size', 10)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', 0)
    .attr('dy', -15)
    .attr('y', -radius)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.angle-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .text(d => d)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'lightgrey')
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })

  // We want to go from 0 to 1, in steps of 0.2
  var bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  // var masked = holder
  //   .append('g')
  //   .attr('class', d => player.Team)
  //   .attr('mask', 'url(#radar-shape)')
  //   .lower()

  holder
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', d => radiusScale(d))
    .lower()

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'red')
    .attr('opacity', 0.5)
    .attr('stroke', 'black')
}
