// set the dimensions and margins of the graph
var histogramMargin = {top: 20, right: 20, bottom: 20, left: 30},
  histogramWidth = 460 - histogramMargin.left - histogramMargin.right,
  histogramHeight = 400 - histogramMargin.top - histogramMargin.bottom;

// append the svg object to the body of the page
var hist_svg = d3.select("#histogram_container")
  .append("svg")
    .attr("width", histogramWidth + histogramMargin.left + histogramMargin.right)
    .attr("height", histogramHeight + histogramMargin.top + histogramMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + histogramMargin.left + "," + histogramMargin.top + ")");

var titleHist = 'Distribution of Ratings';

// Add title 
hist_svg.append('text')
  .attr('class', 'titleHist')
  .attr('y', 0)
  .attr('x', 130)
  .attr('font-size', 18)
  .text(titleHist);

// add the x Axis
var histogramX = d3.scaleLinear()
  .domain([0.5, 5.5])
  .range([0, histogramWidth]);
hist_svg.append("g")
  .attr("transform", "translate(0," + histogramHeight + ")")
  .call(d3.axisBottom(histogramX));

// add the y Axis
var histogramY = d3.scaleLinear()
  .range([histogramHeight, 0])
  .domain([0, 2]);
hist_svg.append("g")
  .call(d3.axisLeft(histogramY));

// Initialize the histogram
function updateHistogram(data, sel) {

  // Remove histograms created before
  hist_svg.selectAll("path").remove()
  var kde = kernelDensityEstimator(kernelEpanechnikov(0.4), histogramX.ticks(100))

  if (sel.first.state !== "" && sel.first.cuisine !== "") {

    // Compute kernel density estimation
    var density1 =  kde( data
      .filter( function(d){return d.state === sel.first.state && d.category === sel.first.cuisine} ) 
      .map(function(d){  return d.restaurant_stars; }) )
    var density2 =  kde( data
      .filter( function(d){return d.state === sel.second.state && d.category === sel.second.cuisine} )
      .map(function(d){  return d.restaurant_stars; }) )

  /* } else if (sel.first.state !== "") {
    var density1 =  kde( data 
      .filter( function(d){return d.state === sel.first.state} )
      .map(function(d){  return d.restaurant_stars; }) )

  } else if (sel.first.cuisine !== "") {
    var density1 =  kde( data 
      .filter( function(d){return d.category === sel.first.cuisine} )
      .map(function(d){  return d.restaurant_stars; }) )
  
  } else {
    var density1 =  kde( data 
      .map(function(d){  return d.restaurant_stars; }) ) */
  }

  // Plot the area of histogram 1
  hist_svg.append("path")
      .attr("class", "mypath")
      .datum(density1)
      .attr("fill", "#AFC52F")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return histogramX(d[0]); })
          .y(function(d) { return histogramY(d[1]); })
      )
      .on("mouseover", function (d)  {
        d3.select(this).append("svg:title")
          .text(function(d) { return [sel.first.state + ", " + sel.first.cuisine]; })
      });

  // Plot the area of histogram 2
  hist_svg.append("path")
      .attr("class", "mypath")
      .datum(density2)
      .attr("fill", "#ff6600")
      .attr("opacity", ".6")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return histogramX(d[0]); })
          .y(function(d) { return histogramY(d[1]); })
      )
      .on("mouseover", function (d)  {
        d3.select(this).append("svg:title")
          .text(function(d) { return [sel.second.state + ", " + sel.second.cuisine]; })
      });
};

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
};
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
};