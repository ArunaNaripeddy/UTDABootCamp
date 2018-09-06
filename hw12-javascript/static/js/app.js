/**********************************************************************************************
 * Generating the UFO Sightings table based on the filters provided in the form.
 **********************************************************************************************/

// Assign the 'ufo sightings data' from `data.js` to a descriptive variable
var tableData = data;

/********************************************************
 * Function: refreshTable
 *          1. Prevents the page from refreshing.
 *          2. Clears the old data from the table
 *********************************************************/
function refreshTable(){
   // Prevent the page from refreshing
   d3.event.preventDefault();
  
   // Refreshing the previous table data 
   d3.select("tbody").text("");

   // Refreshing the generated warning text for unmatched date
   d3.selectAll("div>form p").text("");
}

/**************************************************************************************************
 * Function: filterData
 *           Filters the data that matches the input form data.
 * Input: Dataset - the orginal data
 * Output: Filtered Data - the data filtered for the input form fields
 *************************************************************************************************/
function filterData(data){
   // Select the input element and get the raw HTML node
   var inputElement = d3.select("#datetime");
  
   // Get the value property of the input element
   var inputValue = inputElement.property("value");

   if(inputValue == ""){
    d3.selectAll("div>form")
    .append("p")
    .classed("text-danger", true)
    .text("Please enter the date");
    return;
   }

   // filtering the data with the input text provided
  var filteredData = data.filter(sightings => sightings.datetime === inputValue);
  console.log(filteredData);
  return filteredData;
}

/**************************************************************************************************
 * Function: generateTable
 *           Creating the html table for the filtered json data.
 * Input: Filtered Data - the data filtered for the input form fields
 * Output: generated html table
 *************************************************************************************************/
function generateTable(data){  

  // Check if data exists for the input filters, if not then display a warning message below the form.
  if (data == ""){
    console.log("data returned null")
    d3.selectAll("div>form")
      .append("p")
      .classed("text-danger", true)
      .text("Data do not exist for the entered date");
      return;
  }

  // Get the table body element  
  var tbody = d3.select("#ufo-table-tbody");

 // Create a html table row for each json retrieved from the filtered data and display 
  data.map((d) => {
    var row = tbody.append("tr");
    Object.entries(d).map(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
}


/*******************************************************************************************
 *  Form Event handling
 *  When clicked on form button 'filter', the 'input fields' are searched and filtered 
 *     against the data provided and the result data is displyed in a table.
 *******************************************************************************************/
d3.select("#filter-btn")
  .on("click", function(){
      refreshTable();
      var filteredData = filterData(tableData);
      generateTable(filteredData);
  }
);

// Resetting both form fields and the table data
d3.select("#reset-btn")
  .on("click", function(){
    refreshTable();
    generateTable(tableData);
    d3.selectAll("div>form #datetime").property("value", "");
  });

// On page load, display all the data available
d3.select(window)
  .on("load", function(){
    generateTable(tableData);
  })

