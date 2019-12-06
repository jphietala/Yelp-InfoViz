// set the dimensions and margins of the graph
var histogramMargin = {top: 20, right: 20, bottom: 50, left: 50},
  histogramWidth = 480 - histogramMargin.left - histogramMargin.right,
  histogramHeight = 420 - histogramMargin.top - histogramMargin.bottom;

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

// add text label for the x axis
hist_svg.append("text")             
.attr("transform",
      "translate(" + (histogramWidth/2) + " ," + (histogramHeight + histogramMargin.top + 15) + ")")
.style("text-anchor", "middle")
.text("Review Averages");

// add the y Axis
var histogramY = d3.scaleLinear()
  .range([histogramHeight, 0])
  .domain([0, 2]);
hist_svg.append("g")
  .call(d3.axisLeft(histogramY));

// add text label for the y axis
hist_svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - histogramMargin.left)
  .attr("x",0 - (histogramHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Value");

hist_svg.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", histogramWidth - 55)
  .style("stroke", "black")
  .style("stroke-width", 0.5);

hist_svg.append("line")
  .attr("x1", 0)
  .attr("y1", histogramHeight)
  .attr("x2", histogramWidth)
  .attr("y2", histogramHeight)
  .style("stroke", "black")
  .style("stroke-width", 0.5);

// Initialize the histogram
function updateHistogram(data, sel) {

  // Set kernel parameters and calculate the estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(0.4), histogramX.ticks(100))
 
  density = calculateDensity(data, sel, kde);
  density1 = density[0]
  density2 = density[1]

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

function calculateDensity(data, sel, kde) {
  // Density for the first histogram
  if (sel.first.state !== "" && sel.first.cuisine !== "") {
      
    // Remove histograms created before
    hist_svg.select("path").remove()
    
    // Compute kernel density estimation
    var density1 =  kde( data
      .filter( function(d){return d.state === sel.first.state && d.category === sel.first.cuisine} ) 
      .map(function(d){  return d.recal_stars; }) )

  } else if (sel.first.state !== "" && sel.first.cuisine === "") {

    hist_svg.select("path").remove()
    var density1 =  kde( data 
      .filter( function(d){return d.state === sel.first.state} )
      .map(function(d){  return d.recal_stars; }) )

  } else if (sel.first.state === "" && sel.first.cuisine !== "") {

    hist_svg.select("path").remove()
    var density1 =  kde( data 
      .filter( function(d){return d.category === sel.first.cuisine} )
      .map(function(d){  return d.recal_stars; }) )

  } else {
    hist_svg.select("path").remove()
    var density1 =  kde(data.map(function(d){  return d.recal_stars; }))
  }

  // Density for the second histogram
  if (sel.second.state !== "" && sel.second.cuisine !== "") {

    hist_svg.select("path").remove()
    // Compute kernel density estimation
    var density2 =  kde( data
      .filter( function(d){return d.state === sel.second.state && d.category === sel.second.cuisine} ) 
      .map(function(d){  return d.recal_stars; }) )

  } else if (sel.second.state !== "" && sel.second.cuisine === "") {

    hist_svg.select("path").remove()
    var density2 =  kde( data 
      .filter( function(d){return d.state === sel.second.state} )
      .map(function(d){  return d.recal_stars; }) )

  } else if (sel.second.state === "" && sel.second.cuisine !== "") {

    hist_svg.select("path").remove()
    var density2 =  kde( data 
      .filter( function(d){return d.category === sel.second.cuisine} )
      .map(function(d){  return d.recal_stars; }) )

  } else {
    hist_svg.select("path").remove()
    var density2 =  kde(data.map(function(d){  return d.recal_stars; }))
  }

  return [density1, density2]
};