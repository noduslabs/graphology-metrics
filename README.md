[![Build Status](https://travis-ci.org/graphology/graphology-metrics.svg)](https://travis-ci.org/graphology/graphology-metrics)

# Graphology metrics

Miscellaneous metrics to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-metrics
```

## Usage

*Graph metrics*

* [Density](#density)
* [Extent](#extent)
* [Modularity](#modularity)
* [Weighted size](#weighted-size)

*Node metrics*

* [Centrality](#centrality)
  - [Betweenness centrality](#betweenness-centrality)
  - [Degree centrality](#degree-centrality)
* [Weighted degree](#weighted-degree)

### Density

Computes the density of the given graph.

```js
import {density} from 'graphology-metrics';
import density from 'graphology-metrics/density';

// Passing a graph instance
const d = density(graph);

// Passing the graph's order & size
const d = density(order, size);

// Or to force the kind of density being computed
import {
  mixedDensity,
  directedDensity,
  undirectedDensity,
  multiMixedDensity,
  multiDirectedDensity,
  multiUndirectedDensity
} from 'graphology-metric/density';

const d = undirectedDensity(mixedGraph);
```

*Arguments*

Either:

* **graph** *Graph*: target graph.

Or:

* **order** *number*: number of nodes in the graph.
* **size** *number*: number of edges in the graph.

### Extent

Computes the extent - min, max - of a node or edge's attribute.

```js
import extent from 'graphology-metrics/extent';

// Retrieving a single node attribute's extent
extent(graph, 'size');
>>> [1, 34]

// Retrieving multiple node attributes' extents
extent(graph, ['x', 'y']);
>>> {x: [-4, 3], y: [-34, 56]}

// For edges
extent.edgeExtent(graph, 'weight');
>>> [0, 5.7]
```

*Arguments*

* **graph** *Graph*: target graph.
* **attributes** *string|array*: single attribute names or array of attribute names.

### Modularity

Computes the modularity, given the graph and a partitioning

```js
import {modularity} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import modularity from 'graphology-metrics/modularity';

// Simplest way
const Q = modularity(graph);

// If community mapping is external to the graph
const Q = modularity(graph, {
  communities: {'1': 0, '2': 0, '3': 1, '4': 1, '5': 1}
});
```

*Arguments*

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **communities** *?object*: object mapping nodes to their respective communities.
  * **attributes** *?object*: attributes' names:
    * **community** *?string* [`community`]: name of the nodes' community attribute in case we need to read them from the graph itself.
    * **weight** *?string* [`weight`]: name of the edges' weight attribute.

### Weighted size

Computes the weighted size, i.e. the sum of the graph's edges' weight, of the given graph.

```js
import {weightedSize} from 'graphology-metrics';
// Alternatively, to load only the relevant code:
import weightedSize from 'graphology-metrics/weighted-size';

const graph = new Graph();
graph.mergeEdge(1, 2, {weight: 3});
graph.mergeEdge(1, 2, {weight: 1});

// Simplest way
weightedSize(graph);
>>> 4

// With custom weight attribute
weightedSize(graph, 'myWeightAttribute');
>>> 4
```

*Arguments*

* **graph** *Graph*: target graph.
* **weightAttribute** *?string* [`weight`]: name of the weight attribute.

### Centrality

#### Betweenness centrality

Computes the betweenness centrality for every node.

```js
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';

// To compute centrality for every node:
const centrality = betweennessCentrality(graph);

// To compute weighted betweenness centrality
const centrality = betweennessCentrality(graph, {weighted: true});

// To directly map the result onto nodes' attributes (`beetweennessCentrality`):
betweennessCentrality.assign(graph);

// To directly map the result onto a custom attribute:
betweennessCentrality.assign(graph, {attributes: 'myCentrality'});
```

*Arguments*

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **attributes** *?object*: Custom attribute names:
    - **centrality** *?string* [`betweennessCentrality`]: Name of the centrality attribute to assign.
    - **weight** *?string*: Name of the weight attribute.
  * **normalized** *?boolean* [`true`]: should the result be normalized?
  * **weighted** *?boolean* [`false`]: should we compute the weighted betweenness centrality?

#### Degree centrality

Computes the degree centrality for every node.

```js
import degreeCentrality from 'graphology-metrics/centrality/degree';
// Or to load more specific functions:
import {
  degreeCentrality,
  inDegreeCentrality,
  outDegreeCentrality
} from 'graphology-metrics/centrality/degree';

// To compute degree centrality for every node:
const centrality = degreeCentrality(graph);

// To directly map the result onto nodes' attributes (`degreeCentrality`):
degreeCentrality.assign(graph);

// To directly map the result onto a custom attribute:
degreeCentrality.assign(graph, {attributes: {centrality: 'myCentrality'}});
```

*Arguments*

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **attributes** *?object*: custom attribute names:
    * **centrality** *?string* [`degreeCentrality`]: name of the centrality attribute to assign.

### Weighted degree

Computes the weighted degree of nodes. The weighted degree of a node is the sum of its edges' weights.

```js
import weightedDegree from 'graphology-metrics/weighted-degree';
// Or to load more specific functions:
import {
  weightedDegree,
  weightedInDegree,
  weightedOutDegree
} from 'graphology-metrics/weighted-degree';

// To compute weighted degree of a single node
weightedDegree(graph, 'A');

// To compute weighted degree of every node
const weightedDegrees = weightedDegree(graph);

// To compute normalized weighted degree, i.e. weighted degree will be
// divided by the node's relevant degree
weightedDegree(graph, 'A', {normalized: true});

// To directly map the result onto node attributes
weightedDegree.assign(graph);
```

*Arguments*

To compute the weighted degree of a single node:

* **graph** *Graph*: target graph.
* **node** *any*: desired node.
* **options** *?object*: options. See below.

To compute the weighted degree of every node:

* **graph** *Graph*: target graph.
* **options** *?object*: options. See below.

*Options*

* **attributes** *?object*: custom attribute names:
  - **weight** *?string* [`weight`]: name of the weight attribute.
  - **weightedDegree** *?string* [`weightedDegree`]: name of the attribute to assign.
