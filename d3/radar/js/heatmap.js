// Inspired by https://www.d3-graph-gallery.com/graph/heatmap_basic.html

function selectedHM(element) {
    d3.select(".heatmapSelected2").classed("heatmapSelected2", false)
    d3.select(".heatmapSelected").classed("heatmapSelected", false).classed("heatmapSelected2", true)
    // Select current item
    d3.select(element).classed("heatmapSelected", true)
}

// set the dimensions and margins of the graph
var heatmapMargin = {top: 30, right: 10, bottom: 20, left: 110},
  heatmapWidth = 600 - heatmapMargin.left - heatmapMargin.right,
  heatmapHeight = 800 - heatmapMargin.top - heatmapMargin.bottom;

// append the svg object to the body of the page
var hm_svg = d3.select("#heatmap_container")
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

var titleHM = 'Average Rating of State/Cuisine-Combination'

// Add title 
hm_svg.append('text')
  .attr('class', 'titleHM')
  .attr('y', -10)
  .attr('x', 60)
  .attr('font-size', 18)
  .text(titleHM); 

// Build X scales and axis:
var heatmapX = d3.scaleBand()
  .range([ 0, heatmapWidth ])
  .domain(heatmapStates)
  .padding(0.01);

hm_svg.append("g")
  .attr("transform", "translate(0," + heatmapHeight + ")")
  .call(d3.axisBottom(heatmapX))
    .attr("id","hmX");

// Build Y scales and axis:
var heatmapY = d3.scaleBand()
  .range([ heatmapHeight, 0 ])
  .domain(heatmapCuisines)
  .padding(0.01);

hm_svg.append("g")
  .call(d3.axisLeft(heatmapY))
    .attr("id","hmY");

// Build color scale
var myHeatmapColor = d3.scaleLinear()
  .range(["white","#0947ab"])
  .domain([2,5])

  hm_svg.selectAll("#hmX .tick")
  .on("click", function(d) {
          console.log("You clicked", d)
          // Select current item
            selectedHM(this);
          updateIdioms(d,"");
      });

  hm_svg.selectAll("#hmY .tick")
  .on("click", function(d) {
          console.log("You clicked", d)
          // Select current item
         selectedHM(this);
          updateIdioms("",d);
      });

// Initializing the heatmap
function initHeatmap(data) {

    hm_svg.selectAll("rect").remove()

    hm_svg.selectAll()

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
            selectedHM(this);
          updateIdioms(d.States,d.Cuisine);
      })

      .style("fill", function(d) { return myHeatmapColor(d.Rating) } )
      .append("svg:title")
      .text(function(d) { return ["Average rating: " + d.Rating]; })
};