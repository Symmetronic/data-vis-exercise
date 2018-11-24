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
			})
	svg.selectAll('.dimensions')
	.data(dimensions)
		.enter().append('text')
			.attr('class', 'label')
			.attr('x', function(_, index) {
				return xScale(index);
			}).text(function(dimension) { console.log(dimension); return dimension; });
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
	
	/* Determine variables. */
	let svg = createSvg();
	svg = svg.append('g')
	.attr('transform', function() { return 'translate(200, 200)'; });
	
	// TODO: Update selection with interaction.
	let selection = cars[0];
	console.log(selection);
	let dimensions = ['Retail Price', 'Weight', 'Len', 'Width', 'Cyl', 'Engine Size (l)'];

	/* Determine scales */
	let scales = {};
	for (let dimension of dimensions) {
		let scale = d3.scaleLinear()
			.domain(d3.extent(cars, function(car) { return car[dimension]; }))
			.range([0, 200]);
		scales[dimension] = scale;
	}

	/* Add lines. */
	let path = function(car) {
		return d3.line()(dimensions.map(function(dimension, index) {
			let angle = (index / dimensions.length) * 360 + 90;
			angle = angle / 180 * Math.PI;
			let radius = scales[dimension](car[dimension]);
			return [radius * Math.cos(angle), radius * Math.sin(angle)];
		}));
	};

	svg.selectAll('path')
			.data([selection])
		.enter().append('path')
			.attr('class', 'starplot-line')
			.attr('d', path);

	/* Add axes. */
	svg.selectAll('.dimensions')
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
			})
	svg.selectAll('.dimensions')
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
