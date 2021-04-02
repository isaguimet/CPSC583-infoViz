/*
CPSC 583 - Project Hand in #3
Isabella Guimet Pedraz
UCID: 30040654

JS file for 3rd visualization variation
*/

var margin = {top: 20, right: 50, bottom: 250, left: 180};
var width = 25000 - margin.left - margin.right;
var height = 2000 - margin.top - margin.bottom;

// Append the svg to the div for this visualization
var svg = d3.select("#info-viz-project").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  Converting all applicable string values into integers
d3.csv("EconomicValueCollegeMajors_3rdVis.csv", function(data) {
    data.Median = parseInt(data.Median);
    data.P25th = parseInt(data.P25th);
    data.P75th = parseInt(data.P75th);
    data.Employed = parseInt(data.Employed);
    data.Unemployed = parseInt(data.Unemployed);
    data.Total = parseInt(data.Total);
    data.Employed_full_time_year_round = parseInt(data.Employed_full_time_year_round);
    return data;
}).then(showData)
function showData(data) {

    //Calculating Max total for domain for Y axis
    var max_yaxis_value = d3.max(data, collegeMajor => collegeMajor.Total);

    // Setting up groups and subgroups for bar graphs data
    // Slice gets us Total, Employed, Employed-full_time and Unemployed columns
    var numPeople_sub_group = data.columns.slice(3,7);
    var types_of_majors_groups = d3.map(data, function(d){
        return d.Major;
    })

    // Setting up the X axis
    var xAxis = d3.scaleBand()
                .domain(types_of_majors_groups)
                .range([0, width]) // to make bars thin/ thick /// 8000
                .padding([0.125])

    // Setting up the Y axis
    var yAxis = d3.scaleLinear()
                .domain([0, 2350000]) // Outlier here!
                .range([height, 0])

    // Adding the X Axis to SVG body
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis).tickSizeOuter(0))
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dx", "-1em")
            .attr("dy", "1em")
            .attr("font-size", 15)
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")

    // Adding Label to the X axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left+450)
        .attr("y", margin.top+1900)
        .attr("font-size", 25)
        .text("Majors")

    // Adding the Y axis to SVG body
    svg.append("g")
        .call(d3.axisLeft(yAxis).ticks(50))
        .selectAll("text")
            .attr("font-size", 15)

    // Adding the label to the Y axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+90)
        .attr("x", -margin.top-200)
        .attr("font-size", 25)
        .text("Number of people ")

    // Scale for graphs within sub-grouo
    var scale_subGroup = d3.scaleBand()
        .domain(numPeople_sub_group)
        .range([0, xAxis.bandwidth()+10])
        .padding([0.10])

    // Initializing color for each major sub group
    var color = d3.scaleOrdinal()
                .domain(numPeople_sub_group)
                .range(['#fab2aa','#aafab5','#aacffa', '#c1aafa'])

    // Setting up legend to add to SVG
    var numPeople_type_legend = ["Total number of Graduates", "Number of people employed",
        "Number of people employed full time", "Number of people unemployed"]

    var color_legend = d3.scaleOrdinal()
                        .domain(numPeople_type_legend)
                        .range(['#fab2aa','#aafab5','#aacffa','#c1aafa'])

    // Adds the squares with different colors
    var square_size = 40
    svg.selectAll("legend-squares")
            .data(numPeople_type_legend)
            .enter()
            .append("rect")
                .attr("x", 400)
                .attr("y", function(d, i) {
                    return 80 + i*(square_size+12)
                })
                .attr("width", square_size)
                .attr("height", square_size)
                .style("fill", function(d) { return color_legend(d)})
    
    // Legend text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left+375)
        .attr("y", margin.top+30)
        .attr("font-size", 25)
        .text("Legend")
        .style("text-decoration", "underline")

    // Add appropiate labels to each square on legend
    svg.selectAll("label-squares")
                .data(numPeople_type_legend)
                .enter()
                .append("text")
                    .attr("x", 410 + square_size*1.0)
                    .attr("y", function(d,i) {
                        return 85 + i*(square_size+5) + (square_size/1.5)
                    })
                    .text(function(d){ return d})
                    .attr("font-size", 20)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

    // Appeding / creating bar graphs for each major
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d) { return "translate(" + xAxis(d.Major) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return numPeople_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return scale_subGroup(d.key); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", scale_subGroup.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.value); })
            .attr("fill", function(d) { return color(d.key); });
}