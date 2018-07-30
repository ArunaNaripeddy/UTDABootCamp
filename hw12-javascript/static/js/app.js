// Assign the data from `data.js` to a descriptive variable
var tableData = data;

// Select the submit button
var submit = d3.select("#filter-btn");

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  var filteredData = tableData.filter(sightings => sightings.datetime === inputValue);

  var tbody = d3.select("#ufo-table-tbody");

  data.forEach((filteredData) => {
    var row = tbody.append("tr");
    Object.entries(filteredData).forEach(([key, value]) => {
      var cell = tbody.append("td");
      cell.text(value);
    });
  });
});

