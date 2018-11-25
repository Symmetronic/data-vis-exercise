/* Constants */
const margin = {
	top: 30,
	right: 10,
	bottom: 10,
	left: 10
};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

/* Functions */
/**
 * Creates a parallel coordinates plot.
 */
// SOURCE: Modified from https://bl.ocks.org/jasondavies/1341281
function createParallelCoordinatesPlot() {
	let x = d3.scaleOrdinal([0, width]);
	let y = {};
	let svg = createSvg();

	d3.csv('cars.csv').then(function(cars) {
		console.log(cars);

		let axis = d3.svg.axis().orient('left');
		let dimensions;

		/* X and y axes. */
		x.domain(dimensions = d3.keys(cars[0]).filter(function(dimension) {
			return dimension !== 'Name'
				&& (y[dimension] = d3.scaleLinear()
					.domain(d3.extent(cars, function(p) { return +p[d]; }))
					.range([height, 0]));
		}));

		/* Background lines. */
		let background = svg.append('g')
			    .attr('class', 'background')
			.selectAll('path')
				.data(cars)
			.enter().append('path')
				.attr('d', path);

		/* Foreground lines. */
		let foreground = svg.append('g')
				.attr('class', 'foreground')
			.selectAll('path')
				.data('cars')
			.enter().append('path')
				.attr('d', path);

		/* Group element for each dimension. */
		let g = svg.selectAll('.dimension')
				.data(dimensions)
			.enter().append('g')
				.attr('class', 'dimension')
				.attr('transform', function(dimension) { return 'translate(' + x(dimension) + ')'; });
		
		/* Add an axis and title. */
		g.append('g')
				.attr('class', 'axis')
				.each(function(dimension) { d3.select(this).call(axis.scale(y[dimension])); })
			.append('text')
				.style('text-anchor', 'middle')
				.attr('y', -9)
				.text(function(dimension) { return d; });

		// Returns the path for a given data point.
		function path(d) {
			return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
		}
	});

	// TODO: Implement
}

/**
 * Creates a scatter plot.
 */
function createScatterPlot() {
	// setup x
	var xValue = function(car) { return car["Retail Price"];}, // data -> value
		xScale = d3.scaleLinear().range([0, width]), // value -> display
	    xMap = function(car) { return xScale(xValue(car));}, // data -> display
	    xAxis = d3.axisBottom(xScale);

	// setup y
	var yValue = function(car) { return car["City Miles Per Gallon"];}, // data -> value
	    yScale = d3.scaleLinear().range([height, 0]), // value -> display
	    yMap = function(car) { return yScale(yValue(car));}, // data -> display
	    yAxis = d3.axisLeft(yScale);
	    
	 // setup fill color
	 var cValue = function(d) { return d.Manufacturer;},
	    color = d3.scaleOrdinal(d3.schemeCategory10);    

	let svg = createSvg();

	// TODO: Implement
	let carData = getData();
	
	scatterCreateAxes(svg, xAxis, yAxis);
	scatterDrawDots(svg, carData);

}



function scatterCreateAxes(svg, xAxis, yAxis) {
	// x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Retail Price");
	  
	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("City Miles Per Gallon");
}

function scatterDrawDots(svg, data) {
	// draw dots
	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", xMap)
	      .attr("cy", yMap)
	      .style("fill", function(d) { return color(cValue(d));}) 
	      .on("mouseover", function(d) {
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
		        + ", " + yValue(d) + ")")
	               .style("left", (d3.event.pageX + 5) + "px")
	               .style("top", (d3.event.pageY - 28) + "px");
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      });
}


/**
 * Creates a star plot.
 */
function createStarPlot() {
	let svg = createSvg();

	// TODO: Implement
}

/**
 * Creates an SVG element.
 */
function createSvg() {
	return d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

// TODO: 
function getData() {
	d3.csv("cars.csv").then(function(carData) {
		carData.forEach(function(car) {
			car.AWD = +car.AWD;
			car["City Miles Per Gallon"] = +car["City Miles Per Gallon"];
			car["Highway Miles Per Gallon"] = +car["Highway Miles Per Gallon"];
			car.Cyl = +car.Cyl;
			car["Horsepower(HP)"] = +car["Horsepower(HP)"];
			car.Len = + car.Len;
			car["Engine Size (l)"] = +car["Engine Size (l)"];
			car["Retail Price"] = +car["Retail Price"];	
			car["Dealer Cost"] = +car["Dealer Cost"];
			car.RWD = +car.RWD;
			car.Weight = +car.Weight;
			car.Width = +car.Width;
			car["Wheel Base"] = +car["Wheel Base"];
		});
		console.log(carData);
	}); 
}

/**
 * Runs the program.
 */
function main() {
	//createParallelCoordinatesPlot();
	createScatterPlot();
	//createStarPlot();
}

window.onload = function() {
	main();
};
