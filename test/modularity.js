/**
 * Graphology Modularity Unit Tests
 * =================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    modularity = require('../modularity.js');

/**
 * Test helpers.
 */
var TYPE = {
  UNDIRECTED: 1,
  DIRECTED: 2,
  MIXED: 3,
};

function parse(dataset, t) {
   var graph = new Graph(),
      n = dataset.nodes,
      e = dataset.edges,
      partitioning = {},
      i, l;

  for (i = 0, l = n.length; i < l; i++) {
    graph.addNode(n[i].id);
    partitioning[n[i].id] = n[i].attributes['Modularity Class'];
  }

  for (i = 0, l = e.length; i < l; i++) {
    if (graph.hasEdge(e[i].source, e[i].target))
      continue;
    if (t === TYPE.DIRECTED || (t === TYPE.MIXED && e[i].attributes.Orientation === 'directed'))
      graph.addDirectedEdge(e[i].source, e[i].target);
    else
      graph.addUndirectedEdge(e[i].source, e[i].target);
  }

  return {graph: graph, partitioning: partitioning};
}

/**
 * Datasets.
 */
var clique3 = parse(require('./datasets/clique3.json'), TYPE.DIRECTED),
    directed500 = parse(require('./datasets/directed500.json'), TYPE.DIRECTED),
    undirected500 = parse(require('./datasets/undirected500.json'), TYPE.UNDIRECTED);

/**
 * Actual unit tests.
 */
describe('modularity', function() {
  it('should throw if given graph is invalid.', function() {
    assert.throws(function() {
      modularity(null, []);
    }, /graphology/);
  });

  it('should throw if given graph is multi.', function() {
    assert.throws(function() {
      modularity(new Graph({multi: true}), []);
    }, /multi/);
  });

  it('should throw if the given graph has no edges.', function() {
    var graph = new Graph();
    graph.addNode(1);
    graph.addNode(2);

    assert.throws(function() {
      modularity(graph, [[1], [2]]);
    }, /edge/);
  });

  it('should throw if a node is not in the given partition.', function() {
    var graph = new Graph();
    graph.mergeUndirectedEdge(1, 2);
    graph.mergeUndirectedEdge(1, 3);
    graph.mergeUndirectedEdge(2, 3);

    assert.throws(function() {
      modularity(graph, {communities: {1: 0, 2: 0}});
    }, /partition/);
  });

  it('should handle unique partitions of cliques.', function() {
    var graph = new Graph();
    graph.mergeUndirectedEdge(1, 2);
    graph.mergeUndirectedEdge(1, 3);
    graph.mergeUndirectedEdge(2, 3);

    assert.closeTo(modularity(graph, {communities: {1: 0, 2: 0, 3: 0}}), 0, 0.01);
  });

  it('should handle tiny weighted graphs (5 nodes).', function() {
    var graph = new Graph();

    graph.mergeUndirectedEdge(1, 2, {weight: 30});
    graph.mergeUndirectedEdge(1, 5);
    graph.mergeUndirectedEdge(2, 3, {weight: 15});
    graph.mergeUndirectedEdge(2, 4, {weight: 10});
    graph.mergeUndirectedEdge(2, 5);
    graph.mergeUndirectedEdge(3, 4, {weight: 5});
    graph.mergeUndirectedEdge(4, 5, {weight: 100});

    assert.closeTo(modularity(graph, {communities: {1: 0, 2: 0, 3: 0, 4: 1, 5: 1}}), 0.337, 0.01);
  });

  it('should be possible to indicate the weight attribute name.', function() {
    var graph = new Graph();

    graph.mergeUndirectedEdge(1, 2, {customWeight: 30});
    graph.mergeUndirectedEdge(1, 5);
    graph.mergeUndirectedEdge(2, 3, {customWeight: 15});
    graph.mergeUndirectedEdge(2, 4, {customWeight: 10});
    graph.mergeUndirectedEdge(2, 5);
    graph.mergeUndirectedEdge(3, 4, {customWeight: 5});
    graph.mergeUndirectedEdge(4, 5, {customWeight: 100});

    var options = {
      attributes: {
        weight: 'customWeight'
      },
      communities: {1: 0, 2: 0, 3: 0, 4: 1, 5: 1}
    };

    assert.closeTo(modularity(graph, options), 0.337, 0.01);
  });

  it('should be possible to read the communities from the graph', function() {
    var graph = new Graph();

    var data = {
      1: {
        community: 0
      },
      2: {
        community: 0
      },
      3: {
        community: 0
      },
      4: {
        community: 1
      },
      5: {
        community: 1
      }
    };

    for (var node in data)
      graph.addNode(node, data[node]);

    graph.addUndirectedEdge(1, 2, {weight: 30});
    graph.addUndirectedEdge(1, 5);
    graph.addUndirectedEdge(2, 3, {weight: 15});
    graph.addUndirectedEdge(2, 4, {weight: 10});
    graph.addUndirectedEdge(2, 5);
    graph.addUndirectedEdge(3, 4, {weight: 5});
    graph.addUndirectedEdge(4, 5, {weight: 100});

    assert.closeTo(modularity(graph), 0.337, 0.01);
  });

  it('should handle tiny directed graphs (5 nodes).', function() {
    var graph = new Graph({type: 'directed'});

    graph.mergeDirectedEdge(1, 2);
    graph.mergeDirectedEdge(1, 5);
    graph.mergeDirectedEdge(2, 3);
    graph.mergeDirectedEdge(3, 4);
    graph.mergeDirectedEdge(4, 2);
    graph.mergeDirectedEdge(5, 1);

    assert.closeTo(modularity(graph, {communities: {1: 0, 5: 0, 2: 1, 3: 1, 4: 1}}), 0.22, 0.01);
  });

  it('should handle tiny undirected graphs (12 nodes).', function() {
    assert.closeTo(modularity(clique3.graph, {communities: clique3.partitioning}), 0.524, 0.01);
  });

  it('should handle heavy-sized undirected graphs (500 nodes).', function() {
    assert.closeTo(modularity(undirected500.graph, {communities: undirected500.partitioning}), 0.397, 0.01);
  });

  it('should handle heavy-sized directed graphs (500 nodes).', function() {
    assert.closeTo(modularity(directed500.graph, {communities: directed500.partitioning}), 0.408, 0.01);
  });
});
