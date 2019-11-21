// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 20, left: 110},
  width = 600 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var states = ['QC', 'ON', 'NV', 'WI', 'AZ', 'PA', 'NC', 'IL', 'OH', 'SC']
var cuisines = ['Diners', 'Canadian (New)', 'Fast Food', 'Bakeries', 'Thai', 'Breakfast & Brunch', 'American (Traditional)', 'Burgers',
'American (New)', 'Vietnamese', 'Chinese', 'Japanese', 'Asian Fusion', 'Sushi Bars', 'Cafes', 'Italian', 'Mediterranean',
'Korean', 'French', 'Sandwiches', 'Desserts', 'Mexican', 'Pizza', 'Steakhouses', 'Seafood', 'Delis', 'Barbeque', 'Tex-Mex',
'Hot Dogs', 'Chicken Wings', 'Salad', 'Vegetarian', 'Indian', 'Caribbean', 'Greek', 'Latin American', 'Soup', 'Middle Eastern', 'German']

// Build X scales and axis:
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(states)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build X scales and axis:
var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(cuisines)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear()
  .range(["white","#0947ab"])
  .domain([0,5])

//Read the data
function initHeatmap(data) {

  svg.selectAll()
      .data(data, function(d) { return d.States+':'+d.Cuisine; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.States) })
      .attr("y", function(d) { return y(d.Cuisine) })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())

      .on("click", function(d) {
          console.log("You clicked", d.States+':'+d.Cuisine+':'+d.Rating)
          // Find previously selected, unselect
          d3.select(".selected").classed("selected", false)
          // Select current item
          d3.select(this).classed("selected", true)
      })

      .style("fill", function(d) { return myColor(d.Rating) } )
      .append("svg:title")
      .text(function(d) { return ["Average rating: " + d.Rating]; })
};