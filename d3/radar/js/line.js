



let select = d3.select;
let csv = d3.csv;
let scaleLinear = d3.scaleLinear;
let scaleTime = d3.scaleTime;
let scaleOrdinal = d3.scaleOrdinal;
let extent = d3.extent;
let axisLeft = d3.axisLeft;
let axisBottom = d3.axisBottom;
let line = d3.line;
let curveBasis = d3.curveBasis;
let format = d3.format;
let nest = d3.nest;
let schemeCategory10 = d3.schemeCategory10;
let descending = d3.descending;
let zoom = d3.zoom;
let even = d3.event;



const line_svg = select('#line_svg');
const width = +line_svg.attr('width');
const height = +line_svg.attr('height');

const render = data => {
    line_svg.selectAll("*").remove();
  const title = 'Reviews per state/cuisine and day of a year';
  
  const xValue = d => d.day;
  const xAxisLabel = 'Days';
  
  const yValue = d => d.review;
  const yAxisLabel = 'No. of Reviews';
  
  const colorValue = d => d.state;
  
  const margin = { top: 25, right: 180, bottom: 50, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);
  
  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  const colorScale = scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]);
  //let indata = [{name: infodicts[0][0], axes: first_vals, color: '#26AF32'},{name: infodicts[1][0], axes: second_vals, color: '#762712'}];

  
  const g = line_svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(7);
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(0);
  
  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();
  
  yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', -35)
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
      .attr('y', 35)
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
  	/*.sort((a,b) => 
          descending(lastYValue(a), lastYValue(b)));*/
  
  colorScale.domain(nested.map(d => d.key));
  
  g.selectAll('.line-path').data(nested)
  	.enter().append('path')
  		.attr('class', 'line-path')
  		.attr('d', d => lineGenerator(d.values))
  		.attr('stroke', d => colorScale(d.key))
  	.append('title')
      .text(d => d.key);
     
  const focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

  /*focus.append("circle")
      .attr("r", 5);

  const overlay = g.append("rect")
      .attr("class", "overlay")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", 10)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

  focus.append("text")
      .attr("class", "tooltip-date")
      .attr("x", 18)
      .attr("y", -2);

  focus.append("text")
      .attr("x", 18)
      .attr("y", 18)
      .text("Reviews:");

  focus.append("text")
      .attr("class", "tooltip-reviews")
      .attr("x", 60)
      .attr("y", 18);

  g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

  function mousemove() {
      
      const x0 = xScale.invert(mouse(this)[0]),
          d0 = data[x0 - 1],
          d1 = data[d0],
          d = x0 - d0.day > d1.day - x0 ? d1 : d0;
          console.log(xScale);
      focus.attr("transform", "translate(" + xScale(d.day) + "," + yScale(d.review) + ")");
      focus.select(".tooltip-date").text(d.day);
      focus.select(".tooltip-reviews").text(d.review);
  }*/

  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .attr('x', 140)
      .text(title);

  line_svg.append('g')
      .attr('transform', `translate(800,190)`)
      .call(colorLegend, {
        colorScale,
        circleRadius: 10,
        spacing: 25,
        textOffset: 14,
        onClick,
        focus,
    		selectedStateValue
      });
};
  
	/*svg.call(zoom().on('zoom', () => {
    g.attr('transform', event.transform);
 	}));*/
	
/*

d3.csv('clean_states,days,colums.csv')
  .then(data => {
   console.log(data)  
           

    render(data);
      });
*/