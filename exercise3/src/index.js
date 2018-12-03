// CONSTANTS
const MARGIN = {
		top: 30,
		right: 30,
		bottom: 30,
		left: 30
	},
	WIDTH = 1920,
	HEIGHT = 1080;

// FUNCTIONS
/**
 * Creates a node-link graph.
 * @param tree The tree data.
 */
function createNodeLinkGraph(tree) {
	console.log('create node-link graph');

	/* Constants */
	const NODE_SIZE = 15;

	/* Configure graph. */
	let chart = nodeLinkGraph()
		.width(WIDTH)
		.height(HEIGHT)
		.margin(MARGIN)
		.nodeSize(NODE_SIZE)
		.zoomExtent([0.5, 5]);
	
	/* Create visualization. */
	d3.select('#node-link')
		.datum(tree)
		.call(chart);
	
	// TODO: Implement!
}

/**
 * Creates a sunburst chart.
 * @param tree The tree data.
 */
function createSunburstChart(tree) {
	console.log('create sunburst');

	//let svg = createSvg('sunburst');
	// TODO: Implement!

	let chart = sunburstChart()
		.width(WIDTH)
		.height(500);

	d3.select('#sunburst')
		.datum(tree)
		.call(chart);
}

/*
 * Creates an SVG element.
 */
function createSvg(parentId) {
    return d3.select('#' + parentId).append('svg')
			.attr('class', 'svg-responsive')
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', '0 0 ' + WIDTH + ' ' + HEIGHT)
	    .append('g')
		    .attr('transform',
		    	'translate(' + MARGIN.left + ',' + MARGIN.top + ')');
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
 * Returns a promise of the parsed tree data.
 */
function getData() {
	return d3.json('https://imld.de/docs/lehre/ws_18-19/data-vis/data/web-vis-tools.json');
}

/**
 * Runs the program.
 */
function main() {
    this.getData()
	    .then(function(tree) {
			createNodeLinkGraph(clone(tree));
			createSunburstChart(clone(tree));
        });
}

window.addEventListener('load', main);
