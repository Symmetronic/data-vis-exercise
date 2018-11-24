/* Global variables. */
let selection;
let pcPlot;
let scatterPlot;
let starPlot;

/* Functions. */
/**
 * Creates a parallel coordinates plot.
 */
// SOURCE: Modified from https://bl.ocks.org/jasondavies/1341281
function createParallelCoordinatesPlot(cars) {
	console.log('create parallel coordinates plot');
	
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

	let path = function(car) {
		return d3.line()(dimensions.map(function(dimension, index) {
			return [xScale(index), yScales[dimension](car[dimension])];
		}));
	};

	if (!pcPlot) {
		pcPlot = createSvg();

		/* Add lines. */
		pcPlot.selectAll('path')
				.data(cars)
			.enter().append('path')
				.attr('class', 'line')
				.attr('d', path)
				.on('click', function(car) {
					selection = car;
					createStarPlot(cars);
					createParallelCoordinatesPlot(cars);
				});
	
		/* Add axes. */
		pcPlot.selectAll('.dimension')
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
		
		pcPlot.selectAll('.dimensions')
		.data(dimensions)
			.enter().append('text')
				.attr('class', 'label')
				.attr('x', function(_, index) {
					return xScale(index);
				}).text(function(dimension) { return dimension; });
	}

	if (selection) {
		console.log('foo');
		/* Highlight selected line. */
		pcPlot.select('.selection').remove();

		pcPlot.append('g')
				.attr('class', 'selection')
				.datum(selection)
			.append('path')
				.attr('class', 'line')
				.attr('d', path);
	}
}

/**
 * Creates a scatter plot.
 */
function createScatterPlot(cars) {
	console.log('create scatter plot');
	
	scatterPlot = createSvg();
	console.log(cars);
	// TODO: Implement
}

/**
 * Creates a star plot.
 */
function createStarPlot(cars) {
	console.log('create star plot');

	/* Determine scales */
	let dimensions = ['Retail Price', 'Weight', 'Len', 'Width', 'Cyl', 'Engine Size (l)'];
	let scales = {};
	for (let dimension of dimensions) {
		let scale = d3.scaleLinear()
			.domain(d3.extent(cars, function(car) { return car[dimension]; }))
			.range([0, 200]);
		scales[dimension] = scale;
	}
	
	if (!starPlot) {
		/* Initialize star plot. */
		starPlot = createSvg();
		starPlot = starPlot.append('g')
			.attr('transform', function() { return 'translate(200, 200)'; });
		
		/* Add axes. */
		starPlot.selectAll('.dimensions')
				.data(dimensions)
			.enter().append('g')
				.attr('class', 'dimension')
			.append('g')
				.attr('transform', function(_, index) {
					return 'rotate(' + (index / dimensions.length) * 360 + ')';
				})
			.append('g')
				.attr('class', 'axis')
				.each(function(dimension) {
					d3.select(this).call(d3.axisLeft().scale(scales[dimension]));
				});
		starPlot.selectAll('.dimensions')
				.data(dimensions)
			.enter().append('text')
				.attr('class', 'label')
				.attr('x', function(_, index) { 
					let angle = (index / dimensions.length) * 360 + 90;
					angle = angle / 180 * Math.PI;
					return 210 * Math.cos(angle);
				})
				.attr('y', function(dimension, index) {
					let angle = (index / dimensions.length) * 360 + 90;
					angle = angle / 180 * Math.PI;
					return 210 * Math.sin(angle);
				})
				.text(function(dimension) { return dimension; });
	}
	
	if (selection) {
		/* Function to add line. */
		let path = function(car) {
			return d3.line()(dimensions.map(function(dimension, index) {
				let angle = (index / dimensions.length) * 360 + 90;
				angle = angle / 180 * Math.PI;
				let radius = scales[dimension](car[dimension]);
				return [radius * Math.cos(angle), radius * Math.sin(angle)];
			}));
		};

		/* Remove old line. */
		starPlot.select('.starplot-line').remove();

		/* Add new line. */
		starPlot.append('path')
				.datum(selection)
			.attr('class', 'starplot-line')
			.attr('d', path);
	}
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
