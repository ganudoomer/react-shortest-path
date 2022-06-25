export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    // Set start node distance to Zero (1)
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid); 
    // Convert Matrix to Array 
    while (!!unvisitedNodes.length) {
      // Sort the nodes on based of the distance
      sortNodesByDistance(unvisitedNodes);
      // Get the closest node 
      const closestNode = unvisitedNodes.shift();
      // Check if the node is wall then continue
      if (closestNode.isWall) continue;
      // if distance is Infinity return 
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      // Mark as visited
      closestNode.isVisited = true;
      // Push to visited nodes
      visitedNodesInOrder.push(closestNode);
      // Check to see if we hit the end 
      if (closestNode === finishNode) return visitedNodesInOrder;
      // Update the unvisited nodes

      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    // Priority Q
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    //  Get all the neighbors that are unvisited 
    for (const neighbor of unvisitedNeighbors) {
      // Update the distance from start node 
      neighbor.distance = node.distance + 1;
      // Set prev 
      neighbor.previousNode = node;
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    // Get all the neighbors of the node 
    // Every Node Should have four
    // If row is not less than zero get the node left of it 
    if (row > 0) neighbors.push(grid[row - 1][col]);
    // If row is not greater than grid 
    // Get the row right of it 
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    // If col is not less than zero then get the noe top of it 
    if (col > 0) neighbors.push(grid[row][col - 1]);
    // If col is not greater than grid length 
    // Get the col below it 
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    // Filter out the visited nodes 
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }

  function getAllNodes(grid) {
    //  Make Matrix grid in to array 
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }


  export function getNodesInShortestPathOrder(finishNode) {
    // Back track from the prev node 
    // Until you hit the start node 
    // Which will be null
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }