/**
 * Graphology Modularity
 * ======================
 *
 * Notes:
 * The following code is taken from Gephi and Gephi doesn't consider directed
 * edges:
 *
 * Directed edges produces the same modularity as if they were undirected
 *   - if there are a->b and b->a : consider a<->b
 *   - if there is a->b only or b->a only : consider ALSO a<->b
 *   - if there are a->b , b->a with differents weights, only one is considered
 *
 * The order chosen by Gephi is unknown, it is a sensitive case and is not
 * handled.
 *
 * Self-loops are not considered at all, not in the total weights, not in the
 * computing part (remove them and it will be the same modularity score).
 */
var defaults = require('lodash/defaultsDeep'),
    isGraph = require('graphology-utils/is-graph');

var DEFAULTS = {
  attributes: {
    community: 'community',
    weight: 'weight'
  }
};

/**
 * Function returning the modularity of the given graph.
 *
 * @param  {Graph}  graph         - Target graph.
 * @param  {object} options       - Options:
 * @param  {object}   communities - Communities mapping.
 * @param  {object}   attributes  - Attribute names:
 * @param  {string}     community - Name of the community attribute.
 * @param  {string}     weight    - Name of the weight attribute.
 * @return {number}
 */
function modularity(graph, options) {

  // Handling errors
  if (!isGraph(graph))
    throw new Error('graphology-metrics/modularity: the given graph is not a valid graphology instance.');

  if (graph.multi)
    throw new Error('graphology-metrics/modularity: multi graphs are not handled.');

  if (!graph.size)
    throw new Error('graphology-metrics/modularity: the given graph has no edges.');

  // Solving options
  options = defaults({}, options, DEFAULTS);

  var communities,
      nodes = graph.nodes(),
      edges = graph.edges(),
      i,
      l;

  // Do we have a community mapping?
  if (typeof options.communities === 'object') {
    communities = options.communities;
  }

  // Else we need to extract it from the graph
  else {
    communities = {};

    for (i = 0, l = nodes.length; i < l; i++)
      communities[nodes[i]] = graph.getNodeAttribute(nodes[i], options.attributes.community);
  }

  var M = 0,
      Q = 0,
      internalW = {},
      totalW = {},
      bounds,
      node1, node2, edge,
      community1, community2,
      w, weight;

  for (i = 0, l = edges.length; i < l; i++) {
    edge = edges[i];
    bounds = graph.extremities(edge);
    node1 = bounds[0];
    node2 = bounds[1];

    if (node1 === node2)
      continue;

    community1 = communities[node1];
    community2 = communities[node2];

    if (community1 === undefined)
      throw new Error('graphology-metrics/modularity: the "' + node1 + '" node is not in the partition.');

    if (community2 === undefined)
      throw new Error('graphology-metrics/modularity: the "' + node2 + '" node is not in the partition.');

    w = graph.getEdgeAttribute(edge, options.attributes.weight);
    weight = isNaN(w) ? 1 : w;

    totalW[community1] = (totalW[community1] || 0) + weight;
    if (graph.undirected(edge) || !graph.hasDirectedEdge(node2, node1)) {
      totalW[community2] = (totalW[community2] || 0) + weight;
      M += 2 * weight;
    }
    else {
      M += weight;
    }

    if (!graph.hasDirectedEdge(node2, node1))
      weight *= 2;

    if (community1 === community2)
      internalW[community1] = (internalW[community1] || 0) + weight;
  }

  for (community1 in totalW)
    Q += ((internalW[community1] || 0) - (totalW[community1] * totalW[community1] / M));

  return Q / M;
}

module.exports = modularity;
