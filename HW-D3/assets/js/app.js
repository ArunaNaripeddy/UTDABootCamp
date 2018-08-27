var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(healthCensusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthCensusData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthCensusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(healthCensusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthCensusData, d => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group and labels with a transition to
// new circles w.r.to xaxis
function renderXCircles(newXScale, chosenXaxis, circlesGroup, circlesLabels) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  
  circlesLabels.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXaxis]));
  
  return circlesGroup;
}

// function used for updating circles group and labels with a transition to
// new circles w.r.to yaxis
function renderYCircles(chosenYAxis, newYScale, circlesGroup, circlesLabels) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  circlesLabels.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age:";
  }
  else if (chosenXAxis === "income") {
    var xlabel = "Income:";
  }

  if (chosenYAxis === "healthcare") {
    var ylabel = "Lacks Healthcare:";
  }
  else if (chosenXAxis === "smokes") {
    var ylabel = "Smokes:";
  }
  else if (chosenXAxis === "obesity") {
    var ylabel = "Obesity:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]} %`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
      d3.select(this)
        .transition()
        .duration(100);
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      d3.select(this)
        .transition()
        .duration(100);
      toolTip.hide(data);
    });

  return circlesGroup;
}

function successHandle(healthCensusData) {
  // parse data
  healthCensusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthCensusData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthCensusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Create group for  three x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for  threex y- axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .classed("active", true)
    .attr("dy", "1em")
    .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes")
    .classed("inactive", true)
    .attr("dy", "1em")
    .text("Smokes (%)");

  var obeseLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity")
    .classed("inactive", true)
    .attr("dy", "1em")
    .text("Obese (%)");
  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthCensusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("class", "stateCircle")
    .attr("fill", "darkgreen")
    .attr("opacity", ".5");
  
  // Labels for circles
  var circlesLabels = chartGroup.append("g")
      .selectAll("text")
      .data(healthCensusData)
      .enter()
      .append("text")
        .attr("dx", d => xLinearScale(d[chosenXAxis]))
        .attr("dy", d => yLinearScale(d[chosenYAxis])+1)
        .text(d => d.abbr)
        .attr("class", "stateText");
  
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xlabelsGroup.selectAll("text")
    .on("click", function(){
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(healthCensusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(xLinearScale, chosenXAxis, circlesGroup, circlesLabels);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenXAxis, circlesGroup);

        // changes classes to change bold text
        switch(chosenXAxis){
          case "poverty":
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive",true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          break;
          case "age":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive",false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          break;
          case "income":
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive",true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          break;     
          default:
            console.log("Unable to click on x-axis for chosen input ", chosenXAxis);
        } 
      }
    });
    
  // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function(){
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      // updates y scale for new data
      yLinearScale = yScale(healthCensusData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderYCircles(chosenYAxis, yLinearScale, circlesGroup, circlesLabels);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenYAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      switch(chosenYAxis){
        case "healthcare":
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive",true);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
        case "smokes":
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive",false);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
        case "obesity":
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive",true);
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
            break;     
        default:
            console.log("Unable to click on y-axis for chosen label ", chosenYAxis);
      }
    }
  });
}

function errorHandle(error){
  throw error;
}

// Retrieve data from the CSV file and execute everything below
var file = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/HOMEWORK/Instructions/data/data.csv?token=AKQBliwCkRQ0_tvvEPXRwvcMmkFVzuY_ks5bjVmnwA%3D%3D";
d3.csv(file).then(successHandle, errorHandle);
