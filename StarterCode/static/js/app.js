//set variable for data from samples.json
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Default plots of drop down menu
function init()  {
    //Selecting the Dropdown Menu
    let dropDownMenu = d3.select("#selDataset");

    d3.json(url).then((data)=>{
        console.log(`Data: ${data}`);

    // Array of Name ID
        let names = data.names;

    // Iterate through the names to provide options
        names.forEach((name) => {
            dropDownMenu.append("option").text(name).property("value",name)
     });
    //Initial plots when opening screen
        let name = names[0];
        charts(name)
        demoInfo(name)
    });
}

//Fetch new data for new selection
function optionChanged(newSelection){
    charts(newSelection)
    demoInfo(newSelection)
}

//Demographics Info Panel
function demoInfo(selection){

    //Get JSON data
    d3.json(url).then((data)=>{
        console.log(`Data: ${data}`);

        //Array of metadata
        let metadata = data.metadata;

        //Filter data to the requested selection 
        let filtered = metadata.filter(metadata=>metadata.id == selection);

        //assign the first object to a variable
        let result = filtered[0];

        //Clear populated elements of Panel 
        d3.select("#sample-metadata").html("");

        //Object.entries returns an array of the objects value pair
        let entry = Object.entries(result);

        //iterate through entry array and add an element under h5
        entry.forEach(([key,value])=>{
            d3.select("#sample-metadata").append("h5").text((`${key}: ${value}`))
        });
        console.log(entry);
    });
}

//Creating the Bar Chart
function charts(selection) {
    d3.json(url).then((data)=>{
        console.log(`Data: ${data}`); 

        //Array of samples
        let samples = data.samples;

        //Filter the samples to the requested selection
        let filtered = samples.filter(sample=> sample.id ==selection);

        //Assign first objkect to a variable
        let selected = filtered[0];

        //Trace to create horizontal bar chart
        let trace = [{
            x: selected.sample_values.slice(0,10).reverse(),
            y: selected.otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse(),
            text: selected.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"

        }];
        let layout = {title: "Top 10 OTUs"};

        Plotly.newPlot("bar", trace, layout)

        //Trace2 to create the bubble chart
        let trace2 =[{
            x: selected.otu_ids,
            y: selected.sample_values,
            text: selected.otu_labels,
            mode: "markers",
            marker:{
                size: selected.sample_values,
                color: selected.otu_ids,
                colorscale: "Jet"
            }
        }]
        let layout2 = {
            title:"Bacteria",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", trace2, layout2)
});
}

init();