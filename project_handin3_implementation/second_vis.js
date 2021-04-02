/*
CPSC 583 - Project Hand in #3
Isabella Guimet Pedraz
UCID: 30040654

JS file for 2nd visualization variation
*/

var margin = {top: 20, right: 50, bottom: 400, left: 450};
var width = 1700 - margin.left - margin.right;
var height = 6100 - margin.top - margin.bottom;

// Append the svg to the div for this visualization
var svg = d3.select("#info-viz-project").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  Converting all applicable string values into integers
d3.csv("EconomicValueCollegeMajors_2ndVis.csv", function(data) {
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

    // Calculating Max P75th for domain for Y axis
    var maxP75th = d3.max(data, collegeMajor => collegeMajor.P75th);
    var maxP25th = d3.max(data, collegeMajor => collegeMajor.P25th);
    var maxMedian = d3.max(data, collegeMajor => collegeMajor.Median);
    var maxYAxis = maxP25th + maxMedian + maxP75th;

    // Setting up groups and subgroups for stacking data
    // Only salary columns into one stack
    var salary_sub_group = data.columns.slice(9);
    var types_of_majors_groups = d3.map(data, function(d){
        return d.Major;
    })

    // Setting up the Y axis
    var yAxis = d3.scaleBand()
                .domain(types_of_majors_groups)
                .range([0, 6000]) // to make bars thin/ thick /// 8000
                .padding([0.3])

    // Setting up the X axis
    var xAxis = d3.scaleLinear()
                .domain([0, maxYAxis]) // Outlier here!
                .range([0, width])

    // Adding the X Axis to SVG body
    svg.append("g")
        .attr("transform", "translate(0," + 6000 + ")")
        .call(d3.axisTop(xAxis).tickSizeInner(-5).tickSizeOuter(0))
        .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dx", "-1em")
            .attr("dy", "2em")
            .attr("font-size", 15)
            .style("text-anchor", "center")

    svg.append("text")
        .attr("text-anchor", "end")
        //.attr("transform", "rotate(-90)")
        .attr("y", margin.bottom+5670)
        .attr("x", margin.left+200)
        .attr("font-size", 20)
        .text("Yearly Salary in USD")

    // Adding the Y axis to SVG body
    svg.append("g")
        .call(d3.axisLeft(yAxis))
        .selectAll("text")
            .attr("font-size", 15)

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+90)
        .attr("x", -margin.top-400)
        .attr("font-size", 25)
        .text("Majors")


    // Initializing color for each salary sub group
    var color = d3.scaleOrdinal()
                .domain(salary_sub_group)
                .range(['#87c1f5','#47a8ff','#055fb0'])

    // Setting up legend to add to SVG
    var salary_type_legend = ["25th Percentile", "Median", "75th Percentile"]

    var color_legend = d3.scaleOrdinal()
                        .domain(salary_type_legend)
                        .range(['#87c1f5','#47a8ff','#055fb0'])

    // Adds the squares with different colors
    var square_size = 50
    svg.selectAll("legend-squares")
            .data(salary_type_legend)
            .enter()
            .append("rect")
                .attr("x", 800)
                .attr("y", function(d, i) {
                    return 600 - i*(square_size+12)
                })
                .attr("width", square_size)
                .attr("height", square_size)
                .style("fill", function(d) { return color_legend(d)})
    
    // Legend text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left+450)
        .attr("y", margin.top+415)
        .attr("font-size", 25)
        .text("Legend")
        .style("text-decoration", "underline")

    // Add appropiate labels to each square on legend
    svg.selectAll("label-squares")
                .data(salary_type_legend)
                .enter()
                .append("text")
                    .attr("x", 815 + square_size*1.0)
                    .attr("y", function(d,i) {
                        return 600 - i*(square_size+5) + (square_size/2)
                    })
                    .text(function(d){ return d})
                    .attr("font-size", 20)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

    var stackedBars = d3.stack().keys(salary_sub_group)(data)

    // Appeding / creatind stacked bar graphs for each major
    svg.append("g")
        .selectAll("g")
        .data(stackedBars)
        .enter().append("g")
            .attr("fill", function(d) {return color(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("y", function(d) {return yAxis (d.data.Major); })
                .attr("x", function(d) {return xAxis (d[0]); })
                .attr("width", function(d) {return xAxis (d[1]) - xAxis (d[0]); })
                .attr("height", yAxis.bandwidth())
}