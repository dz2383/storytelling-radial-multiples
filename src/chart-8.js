import * as d3 from 'd3'

let margin = { top: 50, left: 0, right: 0, bottom: 0 }
let height = 430 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let angleScale = d3.scaleBand().range([0, Math.PI * 2])

let radius = 150

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

let line = d3
  .radialLine()
  .angle(d => angleScale(d.name))
  .radius(d => radiusScale(d.value))

let maxMinutes = 40
let maxPoints = 30
let maxFieldGoals = 10
let max3P = 5
let maxFreeThrows = 10
let maxRebounds = 15
let maxAssists = 10
let maxSteals = 5
let maxBlocks = 5

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  let player = datapoints[0]

  let holder = svg
    .append('g')
    .attr('transform', `translate(${height / 2},${width / 2})`)

  let customDatapoints = [
    { name: 'Minutes', value: player.MP / maxMinutes },
    { name: 'Points', value: player.PTS / maxPoints },
    { name: 'Field Goals', value: player.FG / maxFieldGoals },
    { name: '3-Point Field Goals', value: player['3P'] / max3P },
    { name: 'Free Throws', value: player.FT / maxFreeThrows },
    { name: 'Rebounds', value: player.TRB / maxRebounds },
    { name: 'Assists', value: player.AST / maxAssists },
    { name: 'Steals', value: player.STL / maxSteals },
    { name: 'Blocks', value: player.BLK / maxBlocks }
  ]

  let categories = customDatapoints.map(d => d.name)
  angleScale.domain(categories)

  var bands = [0.2, 0.4, 0.6, 0.8, 1]

  holder
    .selectAll('.band-circle')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
    })
    .lower()

  holder
    .append('g')
    .attr('mask', 'url(#player-mask)')
    .selectAll('.band-circle-colored')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', (d, i) => {
      if (i % 2 === 0) {
        return '#FFB81C'
      } else {
        return '#c94435'
      }
    })
    .lower()

  holder
    .selectAll('.category-title')
    .data(categories)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d)
    .attr('x', 0)
    .attr('y', -radius)
    .attr('dy', -15)
    .attr('transform', d => {
      let degrees = (angleScale(d) / Math.PI) * 180
      return `rotate(${degrees})`
    })
    .attr('font-weight', 'bold')
    .attr('font-size', 12)

  holder
    .append('mask')
    .attr('id', 'player-mask')
    .append('path')
    .datum(customDatapoints)
    .attr('d', line)
    .attr('fill', 'white')

  holder
    .append('text')
    .text(0)
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxMinutes)

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxPoints)
    .attr('transform', d => {
      let degrees = (angleScale('Points') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxFieldGoals)
    .attr('transform', d => {
      let degrees = (angleScale('Field Goals') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * max3P)
    .attr('transform', d => {
      let degrees = (angleScale('3-Point Field Goals') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxFreeThrows)
    .attr('transform', d => {
      let degrees = (angleScale('Free Throws') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxRebounds)
    .attr('transform', d => {
      let degrees = (angleScale('Rebounds') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxAssists)
    .attr('transform', d => {
      let degrees = (angleScale('Assists') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxSteals)
    .attr('transform', d => {
      let degrees = (angleScale('Steals') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .selectAll('.text-label')
    .data(bands)
    .enter()
    .append('text')
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('alignment-baseline', 'middle')
    .text(d => d * maxBlocks)
    .attr('transform', d => {
      let degrees = (angleScale('Blocks') / Math.PI) * 180
      return `rotate(${degrees})`
    })

  holder
    .append('text')
    .attr('font-size', 20)
    .attr('font-weight', 'bold')
    .text('LeBron James')
    .attr('y', -radius)
    .attr('dy', -65)
    .attr('text-anchor', 'middle')

  holder
    .append('text')
    .attr('font-size', 14)
    .text('Cleveland Cavaliers')
    .attr('y', -radius)
    .attr('dy', -45)
    .attr('text-anchor', 'middle')
}
