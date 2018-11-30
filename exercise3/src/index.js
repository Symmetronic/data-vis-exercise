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
	const NODE_SIZE = 5;

	let svg = createSvg('node-link');
	let layout = d3.tree()
		.size([WIDTH - MARGIN.left - MARGIN.right,
			HEIGHT - MARGIN.top - MARGIN.bottom]);
	let nodes = layout(d3.hierarchy(tree)).descendants();
	let links = nodes.slice(1);

	/* Create the link lines. */
	svg.selectAll('.link')
			.data(links)
		.enter().append('path')
			.attr('class', 'link')
			.attr('d', function(d) {
				return 'M' + d.x + ',' + d.y
				    + 'L' + d.parent.x + ',' + d.parent.y;
			});

	/* Create the nodes. */
	let node = svg.selectAll('.node')
			.data(nodes)
		.enter().append('g')
			.attr('class', 'node')
		
	node.append('circle')
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', NODE_SIZE);

	node.append('text')
		.attr('x', d => d.x)
		.attr('dx', 5)
		.attr('y', d => d.y)
		.attr('dy', -5)
		.text(d => d.data.name);
	
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
