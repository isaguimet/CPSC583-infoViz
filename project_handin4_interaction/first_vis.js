/*
CPSC 583 - Project Hand in #4
Isabella Guimet Pedraz
UCID: 30040654

JS file for interactive visualization
*/

var margin = {top: 20, right: 50, bottom: 250, left: 350};
var width = 1530 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;

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

    // Sort bars in alphabetical order
    data.sort(function(a,b) {
        return b.Avg_P75th - a.Avg_P75th;
    });

    // Calculating Max P75th for domain for Y axis
    var maxP75th = d3.max(data, collegeMajor => collegeMajor.P75th);
    var maxP25th = d3.max(data, collegeMajor => collegeMajor.P25th);
    var maxMedian = d3.max(data, collegeMajor => collegeMajor.Median);
    var maxYAxis = maxP25th + maxMedian + maxP75th;

    // Average salary for each major category
    var salary_sub_group = data.columns.slice(12,15);
    var types_of_majors_groups = d3.map(data, d => d.Major_category)

    // Creating drop down button options (All Major Categories)
    var major_categories_button = ['Agriculture & Natural Resources', 'Arts', 'Biology & Life Science',
    'Business', 'Communications & Journalism', 'Computers & Mathematics', 'Education', 'Engineering',
    'Health', 'Humanities & Liberal Arts', 'Industrial Arts & Consumer Services', 'Interdisciplinary',
    'Law & Public Policy', 'Physical Sciences', 'Psychology & Social Work', 'Social Science']

    // Construct a drop down button with the following categories
    d3.select("#category-majors-btt")
      .selectAll('option')
     	.data(major_categories_button)
      .enter()
    	.append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) {return d;})

    // Construct a drop down button with the following categories
    d3.select("#popular-majors-btt")
    .selectAll('option')
       .data(major_categories_button)
    .enter()
      .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) {return d;})

    // Construct a drop down menu button with the following categories
    d3.select("#unemployed-rate-btt")
    .selectAll('option')
       .data(major_categories_button)
    .enter()
      .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) {return d;})

    // Make x and y grid lines
    function show_x_grid_lines() {
        return d3.axisBottom(xAxis).ticks(10)
    }

    function show_y_grid_lines() {
        return d3.axisLeft(yAxis).ticks(10)
    }

    // Setting up the X axis
    var xAxis = d3.scaleBand()
                .domain(types_of_majors_groups)
                .range([0, 1200])
                .padding([0.5])

    // Setting up the Y axis
    var yAxis = d3.scaleLinear()
                .domain([0, 140000])
                .range([height, 0])

    // Scale for graphs within sub-grouo
    var scale_subGroup = d3.scaleBand()
        .domain(salary_sub_group)
        .range([0, xAxis.bandwidth()+10])
        .padding([0.10])

    // Add the gridlines to the graph
    svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(show_x_grid_lines()
          .tickSize(-height)
          .tickFormat("")
      )

    // add the Y gridlines
    svg.append("g")			
        .attr("class", "grid")
        .call(show_y_grid_lines()
            .tickSize(-width-15)
            .tickFormat("")
        )

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
        .attr("x", 400)
        .attr("y", margin.top+650)
        .attr("font-size", 25)
        .text("Major Categories")

    // Adding the Y axis to SVG body
    svg.append("g")
        .call(d3.axisLeft(yAxis).ticks(10))
        .selectAll("text")
            .attr("font-size", 15)

    // Adding the label to the Y axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -100)
        .attr("x", -margin.top-160)
        .attr("font-size", 25)
        .text("Yearly Salaries in $USD")


    // Initializing color for each salary sub group
    var color = d3.scaleOrdinal()
                .domain(salary_sub_group)
                //.range(['#87c1f5','#47a8ff','#055fb0'])
                .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

    // Setting up legend to add to SVG
    var salary_type_legend = ["Average 25th Percentile", "Average Median", "Average 75th Percentile"]

    var color_legend = d3.scaleOrdinal()
                        .domain(salary_type_legend)
                        .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

    // Adds the squares with different colors
    var square_size = 35
    svg.selectAll("legend-squares")
            .data(salary_type_legend)
            .enter()
            .append("rect")
                .attr("x", 850)
                .attr("y", function(d, i) {
                    return 120 - i*(square_size+12)
                })
                .attr("width", square_size-3)
                .attr("height", square_size-3)
                .style("fill", function(d) { return color_legend(d)})
    
    // Legend text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left+665)
        .attr("y", margin.top)
        .attr("font-size", 25)
        .text("Legend")
        .style("text-decoration", "underline")

    // Add appropiate labels to each square on legend
    svg.selectAll("label-squares")
                .data(salary_type_legend)
                .enter()
                .append("text")
                    .attr("x", 860 + square_size*1.0)
                    .attr("y", function(d,i) {
                        return 120 - i*(square_size+5) + (square_size/3)
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
            .attr("transform", function(d) { return "translate(" + xAxis(d.Major_category) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return salary_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return scale_subGroup(d.key); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", scale_subGroup.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.value); })
            .attr("fill", d => color(d.key))

    function update_detailedMajorGraph(selectedMajorCategory) {

        svg.selectAll("*").remove()

        // Sort bars in descending order based on the P75th percentile salary
        data.sort(function(a,b) {
            return  b.P75th - a.P75th;
        });

        // Only captures the median, P25th, P75th columns of data
        var salary_sub_group = data.columns.slice(9,12);
        // only return those majors that match the selected major category
        // and filter the data
        var types_of_majors_groups = d3.map(data.filter(function(d){
            if (d.Major_category == selectedMajorCategory) {
                return d;
            }
        }), function(d) {
            if (d.Major_category == selectedMajorCategory) {
                return d.Major;
            }
        })

         // Setting up the X axis
        var xAxis = d3.scaleBand()
            .domain(types_of_majors_groups)
            .range([0, 1200]) // to make bars thin/ thick /// 6000
            .padding([0.5])

        // Setting up the Y axis
        var yAxis = d3.scaleLinear()
        .domain([0, 140000]) // Outlier here! //maxP75th
        .range([height, 0])

        // Scale for graphs within sub-group
        var scale_subGroup = d3.scaleBand()
            .domain(salary_sub_group)
            .range([0, xAxis.bandwidth()])
            .padding([0.10])

        // Add the gridlines to the graph
        svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(show_x_grid_lines()
            .tickSize(-height)
            .tickFormat("")
        )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(show_y_grid_lines()
                .tickSize(-width-15)
                .tickFormat("")
            )

        // Adding the X Axis to SVG body
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis))
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
            .attr("x", -50)
            .attr("y", 575)
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
            .attr("y", -margin.left+250)
            .attr("x", -margin.top-180)
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
                .attr("x", 850)
                .attr("y", function(d, i) {
                    return 120 - i*(square_size+12)
                })
                .attr("width", square_size-3)
                .attr("height", square_size-3)
                .style("fill", function(d) { return color_legend(d)})
    
        // Legend text
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left+700)
            .attr("y", margin.top)
            .attr("font-size", 25)
            .text("Legend")
            .style("text-decoration", "underline")

        // Add appropiate labels to each square on legend
        svg.selectAll("label-squares")
            .data(salary_type_legend)
            .enter()
            .append("text")
                .attr("x", 860 + square_size*1.0)
                .attr("y", function(d,i) {
                    return 120 - i*(square_size+5) + (square_size/3)
                })
                .text(function(d){ return d})
                .attr("font-size", 20)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        // Appeding / creating bar graphs for each major
        svg.append("g")
            .selectAll("g")
            // Filtering data so it only includes data for the selected major category
            .data(data.filter(function(d){
                if (d.Major_category == selectedMajorCategory) {
                    return d;
                }
            }))
            .enter().append("g")
            .attr("transform", function(d) { 
                if (d.Major_category == selectedMajorCategory) {
                    return "translate(" + xAxis(d.Major) + ",0)"; 
                }
            })
            .selectAll("rect")
            // key is the salary sub group (median, p25th, p75th) -- Value is the actually salary value
            .data(function(d) { return salary_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            // Add transition / animation when bars major category changes
            .transition()
            .duration(1500)
            .attr("x", function(d) { return scale_subGroup(d.key); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", scale_subGroup.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.value); })
            .attr("fill", d => color(d.key))
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black')
                                .style("stroke-width", 2)
            })
            .on("mouseout", function(d) {
                d3.select(this).style('stroke', 'none')
            });
    }

    function update_detailedPopularityMajorGraph(selectedMajorCategory) {
        svg.selectAll("*").remove()

        // Sort bars in descending order based on the total number of graduates
        data.sort(function(a,b) {
            return b.Total - a.Total;
        });

        // Setting up groups and subgroups for bar graphs data
        // Slice gets us Total, Employed, Employed-full_time and Unemployed columns
        var numOfpeople_sub_group = data.columns.slice(3,7);
        // only return those majors that match the selected major category
        // and filter the data
        var types_of_majors_groups = d3.map(data.filter(function(d){
            if (d.Major_category == selectedMajorCategory) {
                return d;
            }
        }), function(d) {
            if (d.Major_category == selectedMajorCategory) {
                return d.Major;
            }
        })

         // Setting up the X axis
        var xAxis = d3.scaleBand()
            .domain(types_of_majors_groups)
            .range([0, 1200])
            .padding([0.5])

        // Setting up the Y axis
        var yAxis = d3.scaleLinear()
            .domain([0, 2000000])
            .range([height, 0])

        // Scale for graphs within sub-group
        var scale_subGroup = d3.scaleBand()
            .domain(numOfpeople_sub_group)
            .range([0, xAxis.bandwidth()])
            .padding([0.10])

        // Add the gridlines to the graph
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(show_x_grid_lines()
                .tickSize(-height)
                .tickFormat("")
        )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(show_y_grid_lines()
                .tickSize(-width-15)
                .tickFormat("")
            )

        // Adding the X Axis to SVG body
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis))
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
            .attr("x", -50)
            .attr("y", 575)
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
            .attr("y", -100)
            .attr("x", -margin.top-200)
            .attr("font-size", 25)
            .text("Number of People")

        // Initializing color for each salary sub group
        var color = d3.scaleOrdinal()
            .domain(numOfpeople_sub_group)
            //.range(['#87c1f5','#47a8ff','#055fb0'])
            .range([d3.interpolateSpectral(.1),d3.interpolateSpectral(.3), d3.interpolateSpectral(.6), d3.interpolateSpectral(.7)])

        var numPeople_type_legend = ["Total number of Graduates", "Number of people employed",
            "Number of people employed full time", "Number of people unemployed"]

        var color_legend = d3.scaleOrdinal()
                    .domain(numPeople_type_legend)
                    .range([d3.interpolateSpectral(.1),d3.interpolateSpectral(.3), d3.interpolateSpectral(.6), d3.interpolateSpectral(.7)])

        // Adds the squares with different colors
        var square_size = 35
        svg.selectAll("legend-squares")
            .data(numPeople_type_legend)
            .enter()
            .append("rect")
                .attr("x", 800)
                .attr("y", function(d, i) {
                    return 40 + i*(square_size+5)
                })
                .attr("width", square_size-5)
                .attr("height", square_size-5)
                .style("fill", function(d) { return color_legend(d)})
    
        // Legend text
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left+650)
            .attr("y", margin.top)
            .attr("font-size", 25)
            .text("Legend")
            .style("text-decoration", "underline")

        // Add appropiate labels to each square on legend
        svg.selectAll("label-squares")
            .data(numPeople_type_legend)
            .enter()
            .append("text")
                .attr("x", 800 + square_size*1.0)
                .attr("y", function(d,i) {
                    return 50 + i*(square_size+5) + (square_size/3)
                })
                .text(function(d){ return d})
                .attr("font-size", 20)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        // Appeding / creating bar graphs for each major
        svg.append("g")
            .selectAll("g")
            // Filtering data so it only includes data for the selected major category
            .data(data.filter(function(d){
                if (d.Major_category == selectedMajorCategory) {
                    return d;
                }
            }))
            .enter().append("g")
            .attr("transform", function(d) { 
                if (d.Major_category == selectedMajorCategory) {
                    return "translate(" + xAxis(d.Major) + ",0)"; 
                }
            })
            .selectAll("rect")
            // key is the salary sub group (median, p25th, p75th) -- Value is the actually salary value
            .data(function(d) { return numOfpeople_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            // Add transition / animation when bars major category changes
            .transition()
            .duration(1500)
            .attr("x", function(d) { return scale_subGroup(d.key); })
            .attr("y", function(d) { return yAxis(d.value); })
            .attr("width", scale_subGroup.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.value); })
            .attr("fill", d => color(d.key))
    }

    function updateToOverviewSalaries() {
        svg.selectAll("*").remove()

        // Sort bars in alphabetical order
        data.sort(function(a,b) {
            return b.Avg_P75th - a.Avg_P75th;
        });

        // Average salary for each major category
        var salary_sub_group = data.columns.slice(12,15);
        var types_of_majors_groups = d3.map(data, d => d.Major_category)

        // Make x and y grid lines
        function show_x_grid_lines() {
            return d3.axisBottom(xAxis).ticks(10)
        }

        function show_y_grid_lines() {
            return d3.axisLeft(yAxis).ticks(10)
        }

        // Setting up the X axis
        var xAxis = d3.scaleBand()
                    .domain(types_of_majors_groups)
                    .range([0, 1200]) // to make bars thin/ thick /// 6000
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

        // Add the gridlines to the graph
        svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(show_x_grid_lines()
            .tickSize(-height)
            .tickFormat("")
        )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(show_y_grid_lines()
                .tickSize(-width-15)
                .tickFormat("")
            )

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
            .attr("x", 400)
            .attr("y", margin.top+650)
            .attr("font-size", 25)
            .text("Major Categories")

        // Adding the Y axis to SVG body
        svg.append("g")
            .call(d3.axisLeft(yAxis).ticks(10))
            .selectAll("text")
                .attr("font-size", 15)

        // Adding the label to the Y axis
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -100)
            .attr("x", -margin.top-160)
            .attr("font-size", 25)
            .text("Yearly Salaries in $USD")


        // Initializing color for each salary sub group
        var color = d3.scaleOrdinal()
                    .domain(salary_sub_group)
                    //.range(['#87c1f5','#47a8ff','#055fb0'])
                    .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

        // Setting up legend to add to SVG
        var salary_type_legend = ["Average 25th Percentile", "Average Median", "Average 75th Percentile"]

        var color_legend = d3.scaleOrdinal()
                            .domain(salary_type_legend)
                            .range([d3.interpolateBlues(.4),d3.interpolateBlues(.6), d3.interpolateBlues(.8)])

        // Adds the squares with different colors
        var square_size = 35
        svg.selectAll("legend-squares")
                .data(salary_type_legend)
                .enter()
                .append("rect")
                    .attr("x", 850)
                    .attr("y", function(d, i) {
                        return 120 - i*(square_size+12)
                    })
                    .attr("width", square_size-3)
                    .attr("height", square_size-3)
                    .style("fill", function(d) { return color_legend(d)})
        
        // Legend text
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left+700)
            .attr("y", margin.top)
            .attr("font-size", 25)
            .text("Legend")
            .style("text-decoration", "underline")

        // Add appropiate labels to each square on legend
        svg.selectAll("label-squares")
                    .data(salary_type_legend)
                    .enter()
                    .append("text")
                        .attr("x", 860 + square_size*1.0)
                        .attr("y", function(d,i) {
                            return 120 - i*(square_size+5) + (square_size/3)
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
                .attr("transform", function(d) { return "translate(" + xAxis(d.Major_category) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return salary_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                // Add transition / animation when bars major category changes
                .transition()
                .duration(1500)
                .attr("x", function(d) { return scale_subGroup(d.key); })
                .attr("y", function(d) { return yAxis(d.value); })
                .attr("width", scale_subGroup.bandwidth())
                .attr("height", function(d) { return height - yAxis(d.value); })
                .attr("fill", d => color(d.key))
    }

    function updateToOverviewPopularity() {
        svg.selectAll("*").remove()

        // Sort bars in alphabetical order
        data.sort(function(a,b) {
            return b.Avg_total - a.Avg_total;
        });

        // Average salary for each major category
        var numOfpeople_sub_group = data.columns.slice(15);
        var types_of_majors_groups = d3.map(data, d => d.Major_category)

        // Make x and y grid lines
        function show_x_grid_lines() {
            return d3.axisBottom(xAxis).ticks(10)
        }

        function show_y_grid_lines() {
            return d3.axisLeft(yAxis).ticks(10)
        }

        // Setting up the X axis
        var xAxis = d3.scaleBand()
                    .domain(types_of_majors_groups)
                    .range([0, 1200]) // to make bars thin/ thick /// 6000
                    .padding([0.5])

        // Setting up the Y axis
        var yAxis = d3.scaleLinear()
                    .domain([0, 2000000]) // Outlier here! //maxP75th
                    .range([height, 0])

        // Scale for graphs within sub-grouo
        var scale_subGroup = d3.scaleBand()
            .domain(numOfpeople_sub_group)
            .range([0, xAxis.bandwidth()+10])
            .padding([0.10])

        // Add the gridlines to the graph
        svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(show_x_grid_lines()
            .tickSize(-height)
            .tickFormat("")
        )

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(show_y_grid_lines()
                .tickSize(-width-15)
                .tickFormat("")
            )

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
            .attr("x", 250) // 450
            .attr("y", margin.top+650) // 900
            .attr("font-size", 25)
            .text("Major Categories")

        // Adding the Y axis to SVG body
        svg.append("g")
            .call(d3.axisLeft(yAxis).ticks(10))
            .selectAll("text")
                .attr("font-size", 15)

        // Adding the label to the Y axis
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -100)
            .attr("x", -margin.top-160)
            .attr("font-size", 25)
            .text("Number of people")


        // Initializing color for each salary sub group
        var color = d3.scaleOrdinal()
            .domain(numOfpeople_sub_group)
            //.range(['#87c1f5','#47a8ff','#055fb0'])
            .range([d3.interpolateSpectral(.1),d3.interpolateSpectral(.3), d3.interpolateSpectral(.6), d3.interpolateSpectral(.7)])

        var numPeople_type_legend = ["Average number of Graduates", "Average number of people employed",
            "Average number of people employed full time", "Average number of people unemployed"]

        var color_legend = d3.scaleOrdinal()
                    .domain(numPeople_type_legend)
                    .range([d3.interpolateSpectral(.1),d3.interpolateSpectral(.3), d3.interpolateSpectral(.6), d3.interpolateSpectral(.7)])

        // Adds the squares with different colors
        var square_size = 35
        svg.selectAll("legend-squares")
            .data(numPeople_type_legend)
            .enter()
            .append("rect")
                .attr("x", 735)
                .attr("y", function(d, i) {
                    return 40 + i*(square_size+5)
                })
                .attr("width", square_size-5)
                .attr("height", square_size-5)
                .style("fill", function(d) { return color_legend(d)})
    
        // Legend text
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left+600)
            .attr("y", margin.top)
            .attr("font-size", 25)
            .text("Legend")
            .style("text-decoration", "underline")

        // Add appropiate labels to each square on legend
        svg.selectAll("label-squares")
            .data(numPeople_type_legend)
            .enter()
            .append("text")
                .attr("x", 740 + square_size*1.0)
                .attr("y", function(d,i) {
                    return 50 + i*(square_size+5) + (square_size/3)
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
                .attr("transform", function(d) { return "translate(" + xAxis(d.Major_category) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return numOfpeople_sub_group.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                // Add transition / animation when bars major category changes
                .transition()
                .duration(1500)
                .attr("x", function(d) { return scale_subGroup(d.key); })
                .attr("y", function(d) { return yAxis(d.value); })
                .attr("width", scale_subGroup.bandwidth())
                .attr("height", function(d) { return height - yAxis(d.value); })
                .attr("fill", d => color(d.key))
    }

    function updateUnemployementRate(selectedMajorCategory) {
        svg.selectAll("*").remove()

        // Sort majors in ascending order
        data.sort(function(a,b){
            return a.Unemployement_rate_percentage - b.Unemployement_rate_percentage;
        })

        // Constructing a horizontal graph
        // Setting up the X axis
        var xAxis = d3.scaleLinear()
                    .domain([0,16])
                    .range([0, width])

        // Adding the X Axis to SVG body
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis).ticks(10))
            .selectAll("text")
                .attr("font-size", 15)
                .style("text-anchor", "center")

        // Adding Label to the X axis
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", margin.left+150)
            .attr("y", margin.top+600)
            .attr("font-size", 25)
            .text("Unemployment Rate (in %)")

        // Setting up the Y axis
        var yAxis = d3.scaleBand()
                    .range([0, height])
                    .domain(d3.map(data.filter(function(d){
                        if (d.Major_category == selectedMajorCategory) {
                            return d;
                        }
                    }), function(d) {
                        if (d.Major_category == selectedMajorCategory) {
                            return d.Major;
                        }
                    }))
                    .padding(.5)

        // Add the gridlines to the graph
        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(show_x_grid_lines()
                .tickSize(-height)
                .tickFormat("")
        )

        // Adding the Y axis to SVG body
        svg.append("g")
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
                .attr("font-size", 15)

        // Adding the label to the Y axis
        svg.append("text")
            .attr("text-anchor", "end")
            //.attr("transform", "rotate(-90)")
            .attr("y", -5)
            .attr("x", 50)
            .attr("font-size", 20)
            .text("Majors in " + selectedMajorCategory)

        // Creates bar graphs for each major in the selected major category
        svg.selectAll("rect-graph")
            .data(data.filter(function(d){
                if (d.Major_category == selectedMajorCategory) {
                    return d;
                }
            }))
            .enter()
            .append("rect")
            // Add transition / animation when bars major category changes
            .transition()
            .duration(1500)
            .attr("x", xAxis(0))
            .attr("y", function(d){
                return yAxis(d.Major)
            })
            .attr("width", function(d){
                return xAxis(d.Unemployement_rate_percentage)
            })
            .attr("height", yAxis.bandwidth())
            .attr("fill", "#89aee8")
    }

    // When this button is clicked, show the overview of all major categories salaries
    d3.select("#overview-salaries-btt").on("click", function(d) {
        updateToOverviewSalaries();
    })
    
    d3.select("#overview-popularity-btt").on("click", function(d) {
        updateToOverviewPopularity();
    })

    // When an option in the drop down menu is clicked, update the graph to the
    // appropiate major category's economic outlook
    d3.select("#category-majors-btt").on("change", function(d) {
        // recover the option that has been chosen
        var selectedMajorCategory = d3.select(this).property("value")
        update_detailedMajorGraph(selectedMajorCategory)
    })

    // When an option in the drop down menu is clicked, update the graph to the
    // appropiate major category's employed vs unemployed statistics
    d3.select("#popular-majors-btt").on("change", function(d) {
        // recover the option that has been chosen
        var selectedMajorCategory = d3.select(this).property("value")
        update_detailedPopularityMajorGraph(selectedMajorCategory)
    })

    // When an option in the drop down menu is clicked, update the graph to the
    // appropiate major category's unemployment rate graph
    d3.select("#unemployed-rate-btt").on("change", function(d) {
        var selectedMajorCategory = d3.select(this).property("value")
        updateUnemployementRate(selectedMajorCategory)
        
    })
}