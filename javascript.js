const req = new XMLHttpRequest();
           req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
           req.send();
           req.onload = function(){
             const json = JSON.parse(req.responseText);


             const graphConteiner = d3.select("body")
                                      .append("div")
                                      .attr("id","graphConteiner");
            graphConteiner.append("h1")
                          .attr("id","title")
                          .text("Doping in Professional Bicycle Racing");
            graphConteiner.append("h2")
                          .text("35 Fastest times up Alpe d'Huez");

            const w = 1000;
            const h = 700;
            const padding = 40;

            let leadIt = function(t) {
              return t < 10 ? '0' + t : t;
            }

            let timeFormat = function(time){
              let mins = Math.floor(time / 60);
              let sec = Math.floor(time % 60);

              return leadIt(mins) + ':' + leadIt(sec);
            }

            const yearMin = d3.min(json, (d) => (d.Year));
            const yearMax = d3.max(json, (d) => (d.Year));

            const timeMin = d3.min(json, (d) => new Date(d["Seconds"] * 1000));
            const timeMax = d3.max(json, (d) => new Date(d["Seconds"] * 1000));

            const xScale = d3.scaleLinear()
                             .domain([yearMin, yearMax + 1])
                             .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                             .domain([timeMin, timeMax])
                             .range([padding, h - padding]);

            const svg = d3.select("#graphConteiner")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h)
                          .attr("class","graph");

            const xAxis = d3.axisBottom(xScale).tickFormat((x) => x.toString());

              svg.append("g")
                  .attr("id","x-axis")
                  .attr("transform", "translate(0, " + (h - padding) + ")")
                  .call(xAxis);

              const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

              svg.append("g")
                  .attr("id","y-axis")
                  .attr("transform", "translate(" + (padding) + ", 0)")
                  .call(yAxis);

              let tooltip = d3.select("body")
                              .append("div")
                              .attr("id", "tooltip")
                              .style("visibility", "hidden")
                              .style("position", "absolute");

              svg.selectAll("circle")
                 .data(json)
                 .enter()
                 .append("circle")
                 .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
                 .attr("cx", (d) => xScale(parseInt(d.Year)))
                 .attr("r", 5)
                 .attr("class","dot")
                 .attr("data-xvalue",(d) => d.Year)
                 .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
                 .attr("fill", (d) => {
                   if(d.Doping != "") {
                     return "red"
                   } else{
                     return "green"
                   }
                 })
                 .on("mouseover", function (event, d) {
                    tooltip
                      .html("")
                      .attr("data-year", d.Year)
                      .style('visibility', 'visible')
                      .style('top', event.pageY - 50 + 'px')
                      .style('left', event.pageX + 20 + 'px');

                    tooltip.append('h4').text(d.Name);
                    tooltip.append('h5').text("Time: " + d.Time);
                    tooltip.append('h5').text("Place: " + d.Place);
                    tooltip.append('h5').text("Year: " + d.Year);
                    tooltip.append('h5').text("Nationality: " + d.Nationality);
                    tooltip.append('h5').text("Dopping: " + d.Doping);

                  })
                  .on("mouseout", function() {
                    tooltip.style('visibility', 'hidden');
                  });;

              graphConteiner.append("div")
                            .attr("id","legend")
                            .html("Year (x), Times (y) <br> Red = Dopping Allegation <br> Green = No Dopping Allegation");



           }
