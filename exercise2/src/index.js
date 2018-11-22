/* Functions */
/**
 * Creates a parallel coordinates plot.
 */
// SOURCE: Modified from https://bl.ocks.org/jasondavies/1341281
function createParallelCoordinatesPlot(cars) {
	console.log('create parallel coordinates plot');
	
	let svg = createSvg();
	
	/* Determine variables. */
	let dimensions = Object.keys(cars[0]).filter(function(dimension) {
		return isNumeric(cars[0][dimension]);
	});
	let xScale = d3.scaleLinear()
		.domain([0, dimensions.length - 1])
		.range([0, 960]);
	let yScales = {};
	for (let dimension of dimensions) {
		let yScale = d3.scaleLinear()
			.domain(d3.extent(cars, function(car) { return car[dimension]; }))
			.range([400, 0]);
		yScales[dimension] = yScale;
	}

	/* Add lines. */
	let path = function(car) {
		return d3.line()(dimensions.map(function(dimension, index) {
			return [xScale(index), yScales[dimension](car[dimension])];
		}));
	};
	svg.selectAll('path')
			.data(cars)
		.enter().append('path')
			.attr('class', 'line')
			.attr('d', path);
	
	/* Add axes. */
	svg.selectAll('.dimension')
			.data(dimensions)
		.enter().append('g')
			.attr('class', 'dimension')
			.attr('transform', function(_, index) {
				return 'translate(' + xScale(index) + ')';
			})
		.append('g')
			.attr('class', 'axis')
			.each(function(dimension) {
				d3.select(this).call(d3.axisLeft().scale(yScales[dimension]));
			});
}

/**
 * Creates a scatter plot.
 */
function createScatterPlot(cars) {
	console.log('create scatter plot');
	
	let svg = createSvg();
	console.log(cars);
	// TODO: Implement
}

/**
 * Creates a star plot.
 */
function createStarPlot(cars) {
	console.log('create star plot');
	
	let svg = createSvg();
	// TODO: Implement
}

/**
 * Creates an SVG element.
 */
function createSvg() {
	const margin = {
		top: 30,
		right: 10,
		bottom: 10,
		left: 10
	};
	const width = 960 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

	return d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform',
			    'translate(' + margin.left + ',' + margin.top + ')');
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
				parsedCar[key] = isNumeric(value) ? parseFloat(value) : value;
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
