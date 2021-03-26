/*
CPSC 583 - Project Hand in #3
Isabella Guimet Pedraz
UCID: 30040654
*/

var margin = {top: 20, right: 50, bottom: 400, left: 300};
var width = 20500 - margin.left - margin.right;
var height = 1500 - margin.top - margin.bottom;

// Append the svg to the div for this visualization
var svg = d3.select("#info-viz-project").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//  Converting all applicable string values into integers
d3.csv("EconomicValueCollegeMajors.csv", function(data) {
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
    var salary_sub_group = data.columns.slice(8);
    var types_of_majors_groups = d3.map(data, function(d){
        return d.Major;
    })

    // Setting up the X axis
    var xAxis = d3.scaleBand()
                .domain(types_of_majors_groups)
                .range([0, 8000]) // to make bars thin/ thick
                .padding([0.2])

    // Setting up the Y axis
    var yAxis = d3.scaleLinear()
                .domain([0, maxYAxis]) // Outlier here!
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
            .attr("font-size", 20)
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")

    // Adding the Y axis to SVG body
    svg.append("g")
        .call(d3.axisLeft(yAxis).ticks(20))
        .selectAll("text")
            .attr("font-size", 25)

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+80)
        .attr("x", -margin.top-400)
        .attr("font-size", 35)
        .text("Salaries in $USD")


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
                .attr("x", 50)
                .attr("y", function(d, i) {
                    return 200 - i*(square_size+12)
                })
                .attr("width", square_size)
                .attr("height", square_size)
                .style("fill", function(d){ return color_legend(d)})
    
    // Legend text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left-100)
        .attr("y", margin.top+30)
        .attr("font-size", 30)
        .text("Legend")

    // Add appropiate labels to each square on legend
    svg.selectAll("label-squares")
                .data(salary_type_legend)
                .enter()
                .append("text")
                    .attr("x", 65 + square_size*1.0)
                    .attr("y", function(d,i){ return 200 - i*(square_size+5) + (square_size/2)})
                    .text(function(d){ return d})
                    .attr("font-size", 25)
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
                .attr("x", function(d) {return xAxis (d.data.Major); })
                .attr("y", function(d) {return yAxis (d[1]); })
                .attr("height", function(d) {return yAxis (d[0]) - yAxis (d[1]); })
                .attr("width", xAxis.bandwidth())

    /*var minMedian = d3.min(data, collegeMajor => collegeMajor.Median);
    var maxMedian = d3.max(data, collegeMajor => collegeMajor.Median);
    console.log("Min median: " , minMedian);
    console.log(maxMedian);

    var minP25th = d3.min(data, collegeMajor => collegeMajor.P25th);
    var maxP25th = d3.max(data, collegeMajor => collegeMajor.P25th);
    console.log(minP25th);
    console.log(maxP25th);

    var minEmployed = d3.min(data, collegeMajor => collegeMajor.Employed);
    var maxEmployed = d3.max(data, collegeMajor => collegeMajor.Employed);
    console.log(minEmployed);
    console.log(maxEmployed);

    var max = d3.max(data, collegeMajor => collegeMajor.Median)

    var scaleY = d3.scaleBand()
                    .domain(data.map(collegeMajor => collegeMajor.Major))
                    .range([0,3000])
                    .padding(0.2)

    var scaleX = d3.scaleLinear()
                    .domain([0,max])
                    .range([0,200])

    var axisX = d3.axisBottom(scaleX).ticks(5)
    var axisY = d3.axisLeft(scaleY);

    var stacked_bars = d3.select("#bars")
                        .selectAll("rect")
                        .data(data).enter()
                        .append("rect")
                        .attr("fill", "grey")
                        .attr("height", 10)
                        .attr("width", collegeMajor => scaleX(collegeMajor.Median))
                        .attr("y", collegeMajor => scaleY(collegeMajor.Major))
                        .attr("transform", "translate(270,0)")

    //d3.select("#axisX").attr("transform", "translate(50,200)").call(axisX)
    d3.select("#axisY").attr("transform", "translate(270,0)").call(axisY)
*/
}