// Inspired by https://www.d3-graph-gallery.com/line.html

// set the dimensions and margins of the graph
var linechartMargin = {top: 10, right: 30, bottom: 35, left: 60},
linechartWidth = 960 - linechartMargin.left - linechartMargin.right,
linechartHeight = 430 - linechartMargin.top - linechartMargin.bottom;

// append the svg object to the body of the page
var line_svg = d3.select("#linechart_container")
  .append("svg")
    .attr("width", linechartWidth + linechartMargin.left + linechartMargin.right)
    .attr("height", linechartHeight + linechartMargin.top + linechartMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + linechartMargin.left + "," + linechartMargin.top + ")");

// Make the linechart
function updateLinechart(data) {

  // Remove previously drawn svg elements; axis and lines so that they don't duplicate
  line_svg.selectAll("path").remove()
  line_svg.selectAll("g").remove()

  // Initializing list for getting max value of number of reviews
  var maxrevs = [];

  // Filtering data for the first line chart
  var combo1 =  data 
      .filter( function(d){return d.state === "NV" && d.category === "Pizza"} )
      .map(function(d){
        maxrevs.push(parseInt(d.num_revs))
        return [parseInt(d.day), parseInt(d.num_revs)]; })
  combo1.sort(function(a,b) {
    return a[0]-b[0]
  });
  
  // Filtering data for the second line chart
  var combo2 = data
      .filter( function(d){return d.state === "NV" && d.category === "Delis"} )
      .map(function(d){
        maxrevs.push(parseInt(d.num_revs))
        return [parseInt(d.day), parseInt(d.num_revs)]; })
  combo2.sort(function(a,b) {
    return a[0]-b[0]
  });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([ 1, combo1[combo1.length-1][0] ])
    .range([ 0, linechartWidth ]);
  xAxis = line_svg.append("g")
    .attr("transform", "translate(0," + linechartHeight + ")")
    .call(d3.axisBottom(x));

  // add text label for the x axis
  line_svg.append("text")             
    .attr("transform",
        "translate(" + (linechartWidth/2) + " ," + (linechartHeight + linechartMargin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Day / Week");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([ 0, d3.max(maxrevs) ])
    .range([ linechartHeight, 0 ]);
  yAxis = line_svg.append("g")
    .call(d3.axisLeft(y));

  // add text label for the y axis
  line_svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x",0 - (linechartHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of reviews");

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = line_svg.append("defs").append("line_svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", linechartWidth )
        .attr("height", linechartHeight )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()
        .extent( [ [0,0], [linechartWidth, linechartHeight] ] )
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create line variables: where both the line and the brush take place
    var line1 = line_svg.append('g')
      .attr("clip-path", "url(#clip)")

    var line2 = line_svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line
    line1.append("path")
      .datum(combo1)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#AFC52F")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )
        .on("mouseover", function (d)  {
          console.log(d)
          d3.select(this).append("svg:title")
            .text(function(d) { return "NV"; })
        });

    line2.append("path")
      .datum(combo2)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#ff6600")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d[0]) })
        .y(function(d) { return y(d[1]) })
        )

    // Add the brushing
    line1.append("g")
        .attr("class", "brush")
        .call(brush);

    line2.append("g")
        .attr("class", "brush")
        .call(brush);    

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 0, combo1[combo1.length-1][0] ])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        line1.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        // line2.select(".brush").call(brush.move, null)
      }

      // Update axis and line position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line1.select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d[0]) })
            .y(function(d) { return y(d[1]) })
          )
      
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      line2.select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d[0]) })
            .y(function(d) { return y(d[1]) })
          )
    }

    // If user double click, reinitialize the chart
    line_svg.on("dblclick",function(){
      x.domain([ 0, combo1[combo1.length-1][0] ])
      xAxis.transition().call(d3.axisBottom(x))
      line1
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
      )
     x.domain([ 0, combo1[combo1.length-1][0] ])
      xAxis.transition().call(d3.axisBottom(x))
      line2
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
    )});

};