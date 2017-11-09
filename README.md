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
* [Modularity](#modularity)

*Node metrics*

* [Centrality](#centrality)
  - [Degree centrality](#degree-centrality)

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

### Centrality

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

// To get centralities for every node:
const centralities = degreeCentrality(graph);

// To directly map the result unto nodes' attributes:
degreeCentrality.assign(graph);
```

*Arguments*

* **graph** *Graph*: target graph.
* **options** *?object*: options:
  * **attribute** *?string*: name of the centrality attribute.
