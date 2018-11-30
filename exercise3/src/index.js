// FUNCTIONS
/**
 * Creates a node-link graph.
 * @param tree The tree data.
 */
function createNodeLinkGraph(tree) {
	console.log('create node-link graph');

	let svg = createSvg('node-link');
	// TODO: Implement!
}

/**
 * Creates a sunburst chart.
 * @param tree The tree data.
 */
function createSunburstChart(tree) {
	console.log('create sunburst');

	let svg = createSvg('sunburst');
	// TODO: Implement!
}

/*
 * Creates an SVG element.
 */
function createSvg(parentId) {
    const margin = {
 	    top: 30,
        right: 30,
	    bottom: 30,
	    left: 30
    };
    const width = 1920;
    const height = 1080;

    return d3.select('#' + parentId).append('svg')
			.attr('class', 'svg-responsive')
			.attr('preserveAspectRatio', 'none')
			.attr('viewBox', '0 0 ' + width + ' ' + height)
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
