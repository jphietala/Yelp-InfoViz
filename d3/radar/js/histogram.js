// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 20, left: 30},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#histogram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the x Axis
var x = d3.scaleLinear()
  .domain([0.5, 5.5])
  .range([0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// add the y Axis
var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 1]);
svg.append("g")
  .call(d3.axisLeft(y));

// get the data
d3.csv("data/histogram.csv").then(data => {
    console.log(data)

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(0.1), x.ticks(100))
  var density1 =  kde( data
      .filter( function(d){return d.state === "AZ" && d.category === "American (New)"} ) // Replace hard coded examples with interactive data
      .map(function(d){  return d.restaurant_stars; }) )
  var density2 =  kde( data
      .filter( function(d){return d.state === "OH" && d.category === "Chicken Wings"} ) // Replace hard coded examples with interactive data
      .map(function(d){  return d.restaurant_stars; }) )

  // Plot the area
  svg.append("path")
      .attr("class", "mypath")
      .datum(density1)
      .attr("fill", "#5377ed")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      )
      .on("mouseover", function (d)  {
        d3.select(this).append("svg:title")
          .text(function(d) { return [data[0].state + ", " + data[0].category]; }) // Replace hard coded examples with interactive data
      });

  // Plot the area
  svg.append("path")
      .attr("class", "mypath")
      .datum(density2)
      .attr("fill", "#f2973d")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      )
      .on("mouseover", function (d)  {
        d3.select(this).append("svg:title")
          .text(function(d) { return [data[10000].state + ", " + data[10000].category]; }) // Replace hard coded examples with interactive data
      });
});

// Handmade legend
svg.append("circle").attr("cx",280).attr("cy",30).attr("r", 6).style("fill", "#5377ed")
svg.append("circle").attr("cx",280).attr("cy",60).attr("r", 6).style("fill", "#f2973d")
svg.append("text").attr("x", 300).attr("y", 30).text("AZ, American (New)").style("font-size", "15px").attr("alignment-baseline","middle") // Replace hard coded examples with interactive data
svg.append("text").attr("x", 300).attr("y", 60).text("NC, Latin American").style("font-size", "15px").attr("alignment-baseline","middle") // Replace hard coded examples with interactive data

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}