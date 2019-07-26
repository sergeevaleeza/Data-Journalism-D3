var svgWidth = 950;
var svgHeight = 600;

var margin = {
  top: 60,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Retrieve data from the CSV file and execute everything below
d3.csv("/assets/data/data.csv").then(function(assetsData) {

  // parse data

    assetsData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    //data. = +data.;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
      .range([height, 0]);
      
    // axis label
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    xLinearScale.domain([8, d3.max(assetsData, function(data){
		return +data.poverty;
    })]);

    yLinearScale.domain([0, d3.max(assetsData, function(data){
		return +data.healthcare;
    })]);
    
    // initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
          return (`${data.abbr}
              <br>Poverty: ${data.poverty}
              <br>Healthcare: ${data.healthcare}
            `);
        });


    // add tooltip to chart
    chartGroup.call(toolTip);


    // append axis to chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // new circles with tooltip
    var circlesGroup = chartGroup.selectAll("circle")
	  .data(assetsData)
      .enter()
      .append("circle")
      .attr("cx", function(data) {
          return xLinearScale(data.poverty);
        })
      .attr("cy", function(data) {
	      return yLinearScale(data.healthcare);
	    })
	  .attr("r", "10")
	  .attr("fill","blue")
      .attr("opacity", "0.5");


    // create event listeners to display and hide tooltip 
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        
        // onmouseout event
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Without Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");

       
});
