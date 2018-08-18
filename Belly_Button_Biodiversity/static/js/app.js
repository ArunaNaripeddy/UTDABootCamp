function buildMetadata(sample) {
  // Use d3 to select the panel with id of `#sample-metadata`
  var selector = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  selector.html("");
 
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(response){
    var sampleData = Object.entries(response);

    sampleData.forEach((sample)=>{
       selector.append("p")
               .text(`${sample[0]}: ${sample[1]}`);
     });    
  }); 
}

// Plotting Bubblechart
function plotBubbleChart(data){
  var trace1 = {
    type: "scatter",
    x: data.otu_ids,
    y: data.sample_values,
    text: data.otu_labels,
    mode: 'markers',
    marker: {
      size: data.sample_values,
      color: data.otu_ids,
      colorscale: 'Earth'
    },
    hovertext: data.otu_labels,
  };
   
  var bubbledata = [trace1];

  var bubble_layout = {
    showlegend: false,
    height: 800,
    width: 1200,
    xaxis: {
      title: 'OTU ID'
    },
    yaxis: {
      title: 'Sample Values'
    }
  };

  Plotly.newPlot('bubble', bubbledata, bubble_layout);
}

// Build a Pie Chart
function plotPieChart(data){
  const x = data.sample_values.slice(0,10);
  const y = data.otu_ids.slice(0,10)
       
  var pieTrace = {
    values: x,
    labels: y,
    type: 'pie',
    hovertext: data.otu_labels.slice(0,10),
    hoverinfo: "text"
  };
  
  var pieData = [pieTrace];
  var pieLayout = {
    height: 400,
    width: 500
  };
  
  Plotly.newPlot('pie', pieData, pieLayout);
}

// Build Charts - Pie, bubble and gauge charts for the selected sample.
function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response){
     plotBubbleChart(response);
     plotPieChart(response);
  });

  // BONUS: Build the Gauge Chart
  d3.json(`/wfreq/${sample}`).then((response) => {
    const wfreq = response[0];
    buildGauge(wfreq);
  })
}

// Build the default charts when the page loads
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(`BB_${sample}`)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Build charts for the sample selected from the drop down
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
