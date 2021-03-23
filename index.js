var data = d3.csv("EconomicValueCollegeMajors.csv").then(showData)
    function showData(collegeMajors){

    var max = d3.max(collegeMajors, collegeMajor => collegeMajor.Median)

    var scaleY = d3.scaleBand()
                    .domain(collegeMajors.map(collegeMajor => collegeMajor.Major))
                    .range([0,3000])
                    .padding(0.2)

    var scaleX = d3.scaleLinear()
                    .domain([0,max])
                    .range([0,200])

    var axisX = d3.axisBottom(scaleX).ticks(5)
    var axisY = d3.axisLeft(scaleY);

    var stacked_bars = d3.select("#bars")
                        .selectAll("rect")
                        .data(collegeMajors).enter()
                        .append("rect")
                        .attr("fill", "grey")
                        .attr("height", 10)
                        .attr("width", collegeMajor => scaleX(collegeMajor.Median))
                        .attr("y", collegeMajor => scaleY(collegeMajor.Major))
                        .attr("transform", "translate(270,0)")

    //d3.select("#axisX").attr("transform", "translate(50,200)").call(axisX)
    d3.select("#axisY").attr("transform", "translate(270,0)").call(axisY)

    
    }