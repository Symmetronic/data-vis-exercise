/*
Create Sunburst Chart
Source for reusable charts: https://bost.ocks.org/mike/chart/
Source for sunburst chart: https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099
*/

function sunburstChart() {

	var width = 700, 	//960
		height = 500;	//700

	var radius = (Math.min(width, height) / 2) - 10;
	var formatNumber = d3.format(",d");
	
	var x = d3.scaleLinear()
    	.range([0, 2 * Math.PI]);

	var y = d3.scaleSqrt()
   		.range([0, radius]);

	var color = d3.scaleOrdinal(d3.schemeCategory10);

	var partition = d3.partition();

	var arc = d3.arc()
    	.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    	.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    	.innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    	.outerRadius(function(d) { return Math.max(0, y(d.y1)); });


    function chart(selection) {
    	selection.each(function(data) {

    		// Select the svg element
            var svg = d3.select("#sunburst").append("svg")
    			.attr("width", width)
    			.attr("height", height)
  			  .append("g")
    			.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")")
    			.on("mouseleave", mouseleave);

    		let arcs = d3.hierarchy(data);
  	
  			arcs.sum(function(d) { return d.stackoverflow; });
  	
  			svg.selectAll("path")
      			.data(partition(arcs).descendants())
    		  .enter().append("path")
      			.attr("d", arc)
      			.style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
      			.on("click", click)
      			.on("mouseover", mouseover)
    		  .append("title")
      			.text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });

			function click(d) {
		  		svg.transition()
		      		.duration(750)
		      		.tween("scale", function() {
		        		var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
		            		yd = d3.interpolate(y.domain(), [d.y0, 1]),
		            		yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
		        		return function(t) { 
		        			x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); 
		        		};
		    		})
		    		.selectAll("path")
		    		.attrTween("d", function(d) { return function() { return arc(d); }; 
		    	});
			}

			function mouseover(d) {

  				d3.select("#info")
      				.style("visibility", "")

      			d3.select("#value")
      				.text(d.value);

      			d3.select("#description")
      				.text(d.data.description);
			}


			function mouseleave(d) {
				d3.select("#info")
					.style("visibility", "hidden")
			}

			d3.select(self.frameElement).style("height", height + "px");

        });


    }


	chart.width = function(value) {
    	if (!arguments.length) return width;
    	width = value;
    	return chart;
  	};

  	chart.height = function(value) {
    	if (!arguments.length) return height;
    	height = value;
    	return chart;
  	};

  	return chart;
}