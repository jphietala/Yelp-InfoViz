import {
  select,
  csv,
  scaleLinear,
  scaleTime,
  scaleOrdinal,
  extent,
  axisLeft,
  axisBottom,
  line,
  curveBasis,
  format,
  nest,
  schemeCategory10,
  descending,
  zoom,
  event
} from 'd3';

import { colorLegend } from './colorLegend';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const title = 'Reviews per state and day of a year';
  
  const xValue = d => d.day;
  const xAxisLabel = 'Days';
  
  const yValue = d => d.review;
  const yAxisLabel = 'No. of Reviews';
  
  const colorValue = d => d.state;
  
  const margin = { top: 60, right: 180, bottom: 100, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);
  
  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  const colorScale = scaleOrdinal(schemeCategory10);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  
  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();
  
  yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', -95)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);
  
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 70)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabel);
  
  let selectedStateValue;
  
  const onClick = d => {
    selectedStateValue = d;
    render();
  };
  
  const render = () => {
  	
  };
  
  const lineGenerator = line()
  	.x(d => xScale(xValue(d)))
  	.y(d => yScale(yValue(d)))
  	.curve(curveBasis);
  
  const lastYValue = d => 
  	yValue(d.values[d.values.length -1]);
  
  const nested = nest()
  	.key(colorValue)
  	.entries(data)
  	.sort((a,b) => 
          descending(lastYValue(a), lastYValue(b)));
  
  colorScale.domain(nested.map(d => d.key));
  
  g.selectAll('.line-path').data(nested)
  	.enter().append('path')
  		.attr('class', 'line-path')
  		.attr('d', d => lineGenerator(d.values))
  		.attr('stroke', d => colorScale(d.key))
  	.append('title')
  		.text(d => 'No. of reviews of ' + d.key + ': ' + d.values[0].review);

  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(title);

  svg.append('g')
      .attr('transform', `translate(800,120)`)
      .call(colorLegend, {
        colorScale,
        circleRadius: 10,
        spacing: 25,
        textOffset: 14,
    		onClick,
    		selectedStateValue
      });
};
  
	/*svg.call(zoom().on('zoom', () => {
    g.attr('transform', event.transform);
 	}));*/
	
   

d3.csv('dayofyear.csv')
  .then(data => {
   console.log(data)  
           
    });
    render(data);
  });