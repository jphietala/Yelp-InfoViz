// Inspired by https://www.d3-graph-gallery.com/line.html

// set the dimensions and margins of the graph
var linechartMargin = {top: 40, right: 20, bottom: 35, left: 60},
linechartWidth = 950 - linechartMargin.left - linechartMargin.right,
linechartHeight = 460 - linechartMargin.top - linechartMargin.bottom;

// append the svg object to the body of the page
var line_svg = d3.select("#linechart_container")
  .append("svg")
    .attr("width", linechartWidth + linechartMargin.left + linechartMargin.right)
    .attr("height", linechartHeight + linechartMargin.top + linechartMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + linechartMargin.left + "," + linechartMargin.top + ")");

// Add title 
var titleLc = 'Number of Reviews per Day / Week';
line_svg.append('text')
  .attr('class', 'titleLc')
  .attr('y', -20)
  .attr('x', 300)
  .attr('font-size', 18)
  .text(titleLc);

// add text label for the x axis
line_svg.append("text")             
.attr("transform",
    "translate(" + (linechartWidth/2) + " ," + (linechartHeight + linechartMargin.top - 10) + ")")
.style("text-anchor", "middle")
.text("Day / Week");

// add text label for the y axis
line_svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", -55)
.attr("x",0 - (linechartHeight / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("Number of reviews");

// Make the linechart
function updateLinechart(data, selected) {

  // Remove previously drawn svg elements; axis and lines so that they don't duplicate
  line_svg.selectAll("path").remove()
  line_svg.selectAll("g").remove()
  
  // Filter data
  returned = linechartFilter(data, selected)
  combo1 = returned[0]
  combo2 = returned[1]
  maxrevs = returned[2]

  // Add X axis
  var x = d3.scaleLinear()
    .domain([ 1, combo1[combo1.length-1][0] ])
    .range([ 0, linechartWidth ]);
  xAxis = line_svg.append("g")
    .attr("transform", "translate(0," + linechartHeight + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([ 0, d3.max(maxrevs) ])
    .range([ linechartHeight, 0 ]);
  yAxis = line_svg.append("g")
    .call(d3.axisLeft(y));

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
        x.domain([ 1, combo1[combo1.length-1][0] ])
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
      x.domain([ 1, combo1[combo1.length-1][0] ])
      xAxis.transition().call(d3.axisBottom(x))
      line1
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
      )
     x.domain([ 1, combo1[combo1.length-1][0] ])
      xAxis.transition().call(d3.axisBottom(x))
      line2
        .select('.line')
        .transition()
        .attr("d", d3.line()
          .x(function(d) { return x(d[0]) })
          .y(function(d) { return y(d[1]) })
    )});

};

function linechartFilter(data, sel) {

  // Initialize variables
  var combo1;
  var combo2;

  // Initializing list for getting max value of number of reviews
  var maxrevs = [];

  // Filtering data for the first line
  if (sel.first.state !== "" && sel.first.cuisine !== "") {
  
  var combo1 =  data 
    .filter( function(d){return d.state === sel.first.state && d.category === sel.first.cuisine} )
    .map(function(d){
      maxrevs.push(parseInt(d.num_revs))
      return [parseInt(d.day), parseInt(d.num_revs)]; })
  combo1.sort(function(a,b) { return a[0]-b[0] });

  } else if (sel.first.state !== "" && sel.first.cuisine === "") {
        const data1 = d3.nest()
            .key(function(d) { return d.state;})
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data.filter( function(d){return d.state === sel.first.state} ));
      var combo1 = [];
    data1[0].values.forEach( function (d) {
        combo1.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))

    });

  combo1.sort(function(a,b) { return a[0]-b[0] });

  } else if (sel.first.state === "" && sel.first.cuisine !== "") {
 // ############# NO STATE ##########
        const data1 = d3.nest()
            .key(function(d) { return d.category;})
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data.filter( function(d){return d.category === sel.first.cuisine} ));
      var combo1 = [];
    data1[0].values.forEach( function (d) {
        combo1.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))

    });

  combo1.sort(function(a,b) { return a[0]-b[0] });

  } else {
      //################ TOTAL ################
        const data1 = d3.nest()
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data);
      var combo1 = [];
        data1.forEach( function (d) {
        combo1.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))
    });

  combo1.sort(function(a,b) { return a[0]-b[0] });
  }




  // Filtering data for the second line
  if (sel.second.state !== "" && sel.second.cuisine !== "") {

  var combo2 = data
    .filter( function(d){return d.state === sel.second.state && d.category === sel.second.cuisine} )
    .map(function(d){
      maxrevs.push(parseInt(d.num_revs))
      return [parseInt(d.day), parseInt(d.num_revs)]; })
  combo2.sort(function(a,b) { return a[0]-b[0] });

  } else if (sel.second.state !== "" && sel.second.cuisine === "") {
 // ########## NO CUISINE #############
        const data1 = d3.nest()
            .key(function(d) { return d.state;})
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data.filter( function(d){return d.state === sel.second.state} ));
      var combo2 = [];
    data1[0].values.forEach( function (d) {
        combo2.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))

    });

  combo2.sort(function(a,b) { return a[0]-b[0] });

  } else if (sel.second.state === "" && sel.second.cuisine !== "") {
 // ############# NO STATE ##########
        const data1 = d3.nest()
            .key(function(d) { return d.category;})
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data.filter( function(d){return d.category === sel.second.cuisine} ));
      combo2 = [];
    data1[0].values.forEach( function (d) {
        combo2.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))

    });

  combo2.sort(function(a,b) { return a[0]-b[0] });

  } else {
      //################ TOTAL ################
        const data1 = d3.nest()
            .key(function(d) { return d.day})
            .rollup(function(d) {
                return d3.sum(d, function(g) {return g.num_revs; });
            }).entries(data);
      combo2 = [];
        data1.forEach( function (d) {
        combo2.push([parseInt(d.key),parseInt(d.value)]);
        maxrevs.push(parseInt(d.value))
    });

  combo2.sort(function(a,b) { return a[0]-b[0] });
  }

  return [combo1, combo2, maxrevs];
};