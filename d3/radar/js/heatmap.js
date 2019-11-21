// set the dimensions and margins of the graph
var heatmapMargin = {top: 10, right: 10, bottom: 20, left: 110},
  heatmapWidth = 600 - heatmapMargin.left - heatmapMargin.right,
  heatmapHeight = 800 - heatmapMargin.top - heatmapMargin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
.append("svg")
  .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
  .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
.append("g")
  .attr("transform", "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

// Labels of row and columns
var heatmapStates = ['QC', 'ON', 'NV', 'WI', 'AZ', 'PA', 'NC', 'IL', 'OH', 'SC']
var heatmapCuisines = ['Diners', 'Canadian (New)', 'Fast Food', 'Bakeries', 'Thai', 'Breakfast & Brunch', 'American (Traditional)', 'Burgers',
'American (New)', 'Vietnamese', 'Chinese', 'Japanese', 'Asian Fusion', 'Sushi Bars', 'Cafes', 'Italian', 'Mediterranean',
'Korean', 'French', 'Sandwiches', 'Desserts', 'Mexican', 'Pizza', 'Steakhouses', 'Seafood', 'Delis', 'Barbeque', 'Tex-Mex',
'Hot Dogs', 'Chicken Wings', 'Salad', 'Vegetarian', 'Indian', 'Caribbean', 'Greek', 'Latin American', 'Soup', 'Middle Eastern', 'German']

// Build X scales and axis:
var heatmapX = d3.scaleBand()
  .range([ 0, heatmapWidth ])
  .domain(heatmapStates)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + heatmapHeight + ")")
  .call(d3.axisBottom(heatmapX))

// Build X scales and axis:
var heatmapY = d3.scaleBand()
  .range([ heatmapHeight, 0 ])
  .domain(heatmapCuisines)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(heatmapY));

// Build color scale
var myHeatmapColor = d3.scaleLinear()
  .range(["white","#0947ab"])
  .domain([0,5])

//Read the data
d3.csv('data/heatmap.csv').then(data => {

  svg.selectAll()
      .data(data, function(d) { return d.States+':'+d.Cuisine; })
      .enter()
      .append("rect")
      .attr("x", function(d) { return heatmapX(d.States) })
      .attr("y", function(d) { return heatmapY(d.Cuisine) })
      .attr("width", heatmapX.bandwidth())
      .attr("height", heatmapY.bandwidth())

      .on("click", function(d) {
          console.log("You clicked", d.States+':'+d.Cuisine+':'+d.Rating)
          // Find previously selected, unselect
          d3.select(".selected").classed("selected", false)
          // Select current item
          d3.select(this).classed("selected", true)
      })

      .style("fill", function(d) { return myHeatmapColor(d.Rating) } )
      .append("svg:title")
      .text(function(d) { return ["Average rating: " + d.Rating]; })
});