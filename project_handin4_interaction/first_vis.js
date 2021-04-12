/*
CPSC 583 - Project Hand in #4
Isabella Guimet Pedraz
UCID: 30040654

JS file for interactive visualization
*/

var margin = {top: 20, right: 50, bottom: 250, left: 180};
var width = 1200 - margin.left - margin.right; //6500 - margin.left - margin.right
var height = 800 - margin.top - margin.bottom; //1000 - margin.top - margin.bottom;

// Append the svg to the div for this visualization
var svg = d3.select("#info-viz-project").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  Converting all applicable string values into integers
d3.csv("EconomicValueCollegeMajors.csv", function(data) {
    data.Avg_P25th = parseInt(data.Avg_P25th);
    data.Avg_Median = parseInt(data.Avg_Median);
    data.Avg_P75th = parseInt(data.Avg_P75th);
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
    //var salary_sub_group = data.columns.slice(9);
    // Average salary for each major category
    var salary_sub_group = data.columns.slice(12);
    var types_of_majors_groups = d3.map(data, d => d.Major_category)

    // Setting up the X axis
    var xAxis = d3.scaleBand()
                .domain(types_of_majors_groups)
                .range([0, 1000]) // to make bars thin/ thick /// 6000
                .padding([0.5])

    // Setting up the Y axis
    var yAxis = d3.scaleLinear()
                .domain([0, 140000]) // Outlier here! //maxP75th
                .range([height, 0])

    // Scale for graphs within sub-grouo
    var scale_subGroup = d3.scaleBand()
        .domain(salary_sub_group)
        .range([0, xAxis.bandwidth()+10])
        .padding([0.10])

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
        .attr("x", margin.left+200) // 450
        .attr("y", margin.top+650) // 900
        .attr("font-size", 25)
        .text("Majors")

    // Adding the Y axis to SVG body
    svg.append("g")
        .call(d3.axisLeft(yAxis).ticks(10))
        .selectAll("text")
            .attr("font-size", 15)

    // Adding the label to the Y axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+90)
        .attr("x", -margin.top-200)
        .attr("font-size", 25)
        .text("Yearly Salaries in $USD")


    // Initializing color for each salary sub group
    var color = d3.scaleOrdinal()
                .domain(salary_sub_group)
                //.range(['#87c1f5','#47a8ff','#055fb0'])
                .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

    // Setting up legend to add to SVG
    var salary_type_legend = ["25th Percentile", "Median", "75th Percentile"]

    var color_legend = d3.scaleOrdinal()
                        .domain(salary_type_legend)
                        .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

    // Adds the squares with different colors
    var square_size = 35
    svg.selectAll("legend-squares")
            .data(salary_type_legend)
            .enter()
            .append("rect")
                .attr("x", 50)
                .attr("y", function(d, i) {
                    return 130 - i*(square_size+12)
                })
                .attr("width", square_size-3)
                .attr("height", square_size-3)
                .style("fill", function(d) { return color_legend(d)})
    
    // Legend text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left-10)
        .attr("y", margin.top)
        .attr("font-size", 25)
        .text("Legend")
        .style("text-decoration", "underline")

    // Add appropiate labels to each square on legend
    svg.selectAll("label-squares")
                .data(salary_type_legend)
                .enter()
                .append("text")
                    .attr("x", 65 + square_size*1.0)
                    .attr("y", function(d,i) {
                        return 130 - i*(square_size+5) + (square_size/3)
                    })
                    .text(function(d){ return d})
                    .attr("font-size", 20)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")

    var stackedBars = d3.stack().keys(salary_sub_group)(data)

    // Appeding / creating bar graphs for each major
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d) { return "translate(" + xAxis(d.Major_category) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return salary_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return scale_subGroup(d.key); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", scale_subGroup.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.value); })
            .attr("fill", d => color(d.key))
            // Adds hovering interactivity
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black')
                                .style("stroke-width", 2)
            })
            .on("mouseout", function(d) {
                d3.select(this).style('stroke', 'none')
            });

    // Creating a tool tip to show the value when hovering over a bar graph
    var tooltip = d3.select("#info-viz-project")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")

    /*function stackedBarsGraph(data) {
        d3.selectAll("rect")
        .enter().append('rect')
            .attr('x', )
            .attr('y', )
            .attr('width', )
            .attr('height', )
            .attr('rx', 0)
            .attr('ry', 0)
            .style('fill', '#000');
    }*/
}