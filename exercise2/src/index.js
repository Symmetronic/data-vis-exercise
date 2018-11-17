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
function createParallelCoordinatesPlot(cars) {
	console.log(cars);
	// let x = d3.scaleOrdinal([0, width]);
	// let y = {};
	// let svg = createSvg();
	// let axis = d3.svg.axis().orient('left');
	// let dimensions;
	// 
	// /* X and y axes. */
	// x.domain(dimensions = d3.keys(cars[0]).filter(function(dimension) {
	// 	return dimension !== 'Name'
	// 		&& (y[dimension] = d3.scaleLinear()
	// 			.domain(d3.extent(cars, function(p) { return +p[d]; }))
	// 			.range([height, 0]));
	// }));

	// /* Background lines. */
	// let background = svg.append('g')
	// 		.attr('class', 'background')
	// 	.selectAll('path')
	// 		.data(cars)
	// 	.enter().append('path')
	// 		.attr('d', path);

	// /* Foreground lines. */
	// let foreground = svg.append('g')
	// 		.attr('class', 'foreground')
	// 	.selectAll('path')
	// 		.data('cars')
	// 	.enter().append('path')
	// 		.attr('d', path);

	// /* Group element for each dimension. */
	// let g = svg.selectAll('.dimension')
	// 		.data(dimensions)
	// 	.enter().append('g')
	// 		.attr('class', 'dimension')
	// 		.attr('transform', function(dimension) { return 'translate(' + x(dimension) + ')'; });
	
	// /* Add an axis and title. */
	// g.append('g')
	// 		.attr('class', 'axis')
	// 		.each(function(dimension) { d3.select(this).call(axis.scale(y[dimension])); })
	// 	.append('text')
	// 		.style('text-anchor', 'middle')
	// 		.attr('y', -9)
	// 		.text(function(dimension) { return d; });

	// // Returns the path for a given data point.
	// function path(d) {
	// 	return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
	// }

	// TODO: Implement
}

/**
 * Creates a scatter plot.
 */
function createScatterPlot(cars) {
	console.log(cars);
		
	let svg = createSvg();
	// TODO: Implement
}

/**
 * Creates a star plot.
 */
function createStarPlot(cars) {
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

/**
 * Clones an object.
 * @param obj The object to be cloned.
 */
// SOURCE: https://stackoverflow.com/a/23481096
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Returns a promise of the parsed car data.
 */
function getData() {
	return d3.csv("cars.csv").then(function(cars) {
	    return Promise.resolve(cars.map(function(car) {
			return Object.keys(car).reduce(function(parsedCar, key) {
				let value = car[key];
				parsedCar[key] = isNumeric(value)
					? parseFloat(value)
					: value;
				return parsedCar;
			}, {});
	  }));
	});
}

/**
 * Returns true, if the value is numeric.
 * @param n The value that should be checked.
 */
// SOURCE: https://stackoverflow.com/a/9716488
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
} 

/**
 * Runs the program.
 */
function main() {
	this.getData()
	    .then(function(cars) {
			createParallelCoordinatesPlot(clone(cars));
			createScatterPlot(clone(cars));
			createStarPlot(clone(cars));
		});
}

window.onload = function() {
	main();
};
