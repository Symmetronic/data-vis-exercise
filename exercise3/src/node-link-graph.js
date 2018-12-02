/**
 * A node-link graph.
 */
// SOURCE for reusable charts: https://bost.ocks.org/mike/chart/
function nodeLinkGraph(config) {
    let height = (!config || !config.height)
            ? 1080
            : config.height,
        margin = (!config || !config.margin)
            ? {
                bottom: 30,
                left: 30,
                right: 30,
                top: 30
            }
            : config.margin,
        nodeSize = (!config || !config.nodeSize)
            ? 10
            : config.nodeSize,
        width = (!config || !config.width)
            ? 1920
            : config.width,
        zoomExtent = (!config || !config.zoomExtent)
            ? [0.5, 5]
            : config.zoomExtent;

    /**
     * Logic for the chart creation.
     * @param selection The DOM elements that should be used as charts.
     */
    function chart(selection) {
        selection.each(function(tree) {
            /* Method for enabling semantic zooming. */
            let updateDetails = function(zoom) {
                let classes = ['svg-responsive'];
                let minZoom = Math.min(...zoomExtent);
                let maxZoom = Math.max(...zoomExtent);
                let zoomRange = maxZoom - minZoom;
                if (zoom > 2/3 * zoomRange + minZoom) {
                    /* Show most details. */
                    classes.push('details');
                } else if (zoom > 1/3 * zoomRange + minZoom) {
                    /* Show some details. */
                    classes.push('labels');
                } else {
                    /* Show least details. */
                    classes.push('overview');
                }
                svg.attr('class', classes.join(' '));
            };

            /* Creates the SVG container. */
            let svg = d3.select(this).append('svg')
                    .attr('class', 'svg-responsive')
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .attr('viewBox', '0 0 '
                        + (width + margin.left + margin.right) + ' '
                        + (height + margin.top + margin.bottom))
                    .call(d3.zoom()
                        .scaleExtent(zoomExtent)
                        .on('zoom', function() {
                            /* Add zooming and panning. */
                            svg.attr('transform', d3.event.transform);

                            /* Update details. */
                            updateDetails(d3.event.transform.k);
                        })
                    )
                .append('g')
                    .attr('transform',
                        'translate(' + margin.left + ',' + margin.top + ')');
            updateDetails(1.0);

            /* Determines the graph layout. */
            let layout = d3.tree()
                .size([width, height]);
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
            let stackoverflowExtent = [0, d3.max(nodes, node => (node.data && node.data.stackoverflow)
                ? node.data.stackoverflow
                : 0)
            ];

            nodes.forEach(function (d) {
                /* Append the node. */
                let node = svg.append('g')
                    .datum(d)
                    .attr('class', 'node');
                
                if (d.data && d.data.free) {
                    /* Display circle for free. */
                    node.append('circle')
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y)
                        .attr('r', nodeSize/2)
                        .attr('fill', d => {
                            let percentage = (d.data && d.data.stackoverflow)
                                ? d.data.stackoverflow / stackoverflowExtent[1]
                                : 0;
                            return 'rgb(0, 0, ' + 255 * percentage + ')';
                        })
                } else {
                    /* Display rectangles for non free. */
                    node.append('rect')
                        .attr('x', d => d.x - nodeSize/2)
                        .attr('y', d => d.y - nodeSize/2)
                        .attr('width', nodeSize)
                        .attr('height', nodeSize)
                        .attr('fill', d => {
                            let percentage = (d.data && d.data.stackoverflow)
                                ? d.data.stackoverflow / stackoverflowExtent[1]
                                : 0;
                            return 'rgb(0, 0, ' + 255 * percentage + ')';
                        });
                }

                /* Append label. */
                node.append('text')
                    .attr('class', 'label')
                    .attr('x', d => d.x)
                    .attr('dx', 5)
                    .attr('y', d => d.y)
                    .attr('dy', -15)
                    .text(d => d.data.name);
                
                /* Append description. */
                node.append('text')
                    .attr('class', 'description')
                    .attr('x', d => d.x)
                    .attr('dx', 5)
                    .attr('y', d => d.y)
                    .attr('dy', 15)
                    .text(d => d.data.description);
                
                /* Append Stackoverflow value. */
                node.append('text')
                    .attr('class', 'stackoverflow')
                    .attr('x', d => d.x)
                    .attr('dx', 5)
                    .attr('y', d => d.y)
                    .attr('dy', 45)
                    .text(d => (d.data.stackoverflow)
                        ? String(d.data.stackoverflow)
                        : ''
                    )
            });
        });
    };

    /**
     * Accessor for getting and setting the chart's height.
     * @param  value The new height.
     * @return       The height, if no value was specified, otherwise the chart itself.
     */
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    /**
     * Accessor for getting and setting the chart's margin.
     * @param  value The new margin.
     * @return       The margin, if no value was specified, otherwise the chart itself.
     */
    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    /**
     * Accessor for getting and setting the chart's node size.
     * @param  value The new node size.
     * @return       The node size, if no value was specified, otherwise the chart itself.
     */
    chart.nodeSize = function(value) {
        if (!arguments.length) return nodeSize;
        nodeSize = value;
        return chart;
    };

    /**
     * Accessor for getting and setting the chart's width.
     * @param  value The new width.
     * @return       The width, if no value was specified, otherwise the chart itself.
     */
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    /**
     * Accessor for getting and setting the chart's zoom extent.
     * @param  value The new zoom extent.
     * @return       The zoom extent, if no value was specified, otherwise the chart itself.
     */
    chart.zoomExtent = function(value) {
        if (!arguments.length) return zoomExtent;
        zoomExtent = value;
        return chart;
    };

    return chart;
}