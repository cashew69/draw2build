import Graph from './Graph';

function testGraph() {
  const graph = new Graph();

  // Add nodes
  graph.addNode('Pune');
  graph.addNode('Mumbai');
  graph.addNode('Chiplun');

  // Add connections
  graph.addConnection('Pune', 'Mumbai');
  graph.addConnection('Mumbai', 'Pune');
  graph.addConnection('Chiplun', 'Pune');
  graph.addConnection('Chiplun', 'Mumbai');

  // Print the graph
  console.log("Graph representation:");
  console.log(graph.toString());

  // Test connections
  console.log("\nConnections:");
  console.log("A connects to:", graph.getConnections('Chiplun'));
  console.log("B connects to:", graph.getConnections('Pune'));
  console.log("C connects to:", graph.getConnections('Mumbai'));
}

testGraph();
