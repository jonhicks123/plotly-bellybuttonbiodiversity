// Build the metadata
function metadata(sample) {
    d3.json("samples.json").then((data) => {
        var met = data.metadata;
        var resultsArr = met.filter(sampleobject => sampleobject.id == sample);
        var results = resultsArr[0]
        var dem_info = d3.select("#sample-metadata");
        dem_info.html("");
        
        Object.entries(results).forEach(([key, value]) => {
            console.log(key,value);
            dem_info.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Prepare for charts
function charts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsArr = samples.filter(sampleobject => sampleobject.id == sample);
        var results = resultsArr[0]
        var id = results.otu_ids;
        var label = results.otu_labels;
        var vals = results.sample_values;

        // Bar chart
        var barchart_data = [
            {
                x: vals.slice(0,10).reverse(),
                y: id.slice(0,10).map(otuid => `OTU: ${otuid}`).reverse(),
                text: label.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        var barchart_layout = {
            title: "Top 10 OTUs Found",
            xaxis: { title: "Sample Values" },
            height: 500,
            width: 400
        };
        Plotly.newPlot("bar", barchart_data, barchart_layout);

        // Bubble Chart
        var bubble_data = [
            {
                x: id,
                y: vals,
                text: label,
                mode: "markers",
                marker: {color: id,
                        size: vals}
            }
        ];

        var bubble_layout = {
            xaxis: { title: "OTU ID" }
        };
        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
}


function init() {
    
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        // gather sample names into the dropdown
        var names = data.names;
        names.forEach((sample) => {
            dropdown.append("option", sample).text(sample).property("value", sample);
        });

        const initialsample = names[0];
        charts(initialsample);
        metadata(initialsample);
    });
}

function optionChanged(nextsample) {
    charts(nextsample);
    metadata(nextsample);
}

init();




