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
function createPlot() {
	d3.csv('cars.csv', function(errors, cars) {
		console.log(cars);
		//x.domain(dimensions = d3.keys(cars[0].filter(function(dimension) {
		//	return dimension != 'name' && y
		//})
	});
}

function createSvg() {
	svg = d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
}

/* Run program. */
function main() {
	createSvg();
	createPlot();
}

window.onload = function() {
	main();
};
