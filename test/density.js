/**
 * Graphology Density Unit Tests
 * ==============================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    density = require('../density.js');

describe('density', function() {

  it('should throw if given wrong arguments.', function() {

    assert.throws(function() {
      density(null);
    }, /instance/);

    assert.throws(function() {
      density('test', 1);
    }, /number/);

    assert.throws(function() {
      density(45, 'test');
    }, /number/);
  });

  it('should properly compute the given graph\'s density.', function() {
    var mixedGraph = new Graph();
    mixedGraph.addNodesFrom([1, 2, 3]);
    mixedGraph.addEdge(1, 2);
    mixedGraph.addEdge(1, 3);

    var directedGraph = new Graph({type: 'directed'});
    directedGraph.addNodesFrom([1, 2, 3]);
    directedGraph.addEdge(1, 2);
    directedGraph.addEdge(1, 3);

    var undirectedGraph = new Graph({type: 'undirected'});
    undirectedGraph.addNodesFrom([1, 2, 3]);
    undirectedGraph.addEdge(1, 2);
    undirectedGraph.addEdge(1, 3);

    // TODO: mixed density is incorrect => need #.directedSize etc.
    // console.log(density(mixedGraph));
    // console.log(density(directedGraph));
    // console.log(density(undirectedGraph));
  });
});
