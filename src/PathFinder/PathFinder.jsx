import { useEffect, useState } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../utils";
import Node from "./Node/Node";
import "./PathFinder.css";

export default function PathFinder() {
  const [grid, setGrid] = useState([]);
  const [mousePressed, setMousePressed] = useState(false);

  const [isSetStartNode, setIsSetStartNode] = useState(false);
  const [isSetFinishNode, setIsSetFinishNode] = useState(false);


  const [startNode, setStartNode] = useState({
    row: 10,
    col: 15,
  });

  const [finishNode, setFinishNode] = useState({
    row: 10,
    col: 35,
  });

  useEffect(() => {
    // Starts here 
    // We make a grid arrays 
    const grid = makeGrid();
    setGrid(grid);
  }, []);

  const makeGrid = () => {
    const grid = [];
    // Make a matrix grid 
    // of 20 rows an 50 cols 
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  function redrawNodes() {
    const grid = makeGrid();
    setGrid(grid);
  }

  const createNode = (col, row) => {
    // This is the Data Type of the grid 
    // Initially we set everything to Infinity
    // Also set the column number and row number 
    // Set if Finished or is Start 
    // Also the Set the prev here itself 
    // Set it to null initially 
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const getNewGridWithBlocks = (grid, row, col) => {
    // Make a new copy of the array 
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    // Set not to wall 
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };

    newGrid[row][col] = newNode;
    return newGrid;
  };

  function handleMouseDown(row, col) {
    if (isSetStartNode || isSetFinishNode ) return;
    const newGrid = getNewGridWithBlocks(grid, row, col);
    setGrid(newGrid ?? []);
    setMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (isSetStartNode || isSetFinishNode ) return;
    if (!mousePressed) return;
    const newGrid = getNewGridWithBlocks(grid, row, col);
    setGrid(newGrid ?? []);
  }

  function handleMouseUp() {
    setMousePressed(false);
  }

  function drawScannedNodes(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          drawShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if(
         (node.col === startNode.col && node.row === startNode.row) || 
         (node.col === finishNode.col && node.row === finishNode.row)) {
            return
          }
        // Changing by with GetElementById because setState takes time 
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  function drawShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  function findShortestPath() {
    // Take starting node and ending node 
    const startNodeObj = grid[startNode.row][startNode.col];
    const finishNodeObj = grid[finishNode.row][finishNode.col];
    const visitedNodes = dijkstra(grid, startNodeObj, finishNodeObj);
    const pathNodes = getNodesInShortestPathOrder(finishNodeObj);
    drawScannedNodes(visitedNodes, pathNodes);
  }

  return (
    <div className="main">
      <button onClick={() => findShortestPath()}>Find Shortest Path</button>
      <button
        onClick={() => {
          setIsSetStartNode(true);
          setIsSetFinishNode(false)
        }}
      >
        Set Start Node
      </button>

      <button
        onClick={() => {
          setIsSetStartNode(false);
          setIsSetFinishNode(true)
        }}
      >
        Set Finish Node
      </button>


      <button
        onClick={() => {
          setIsSetStartNode(false);
          setIsSetFinishNode(false)
        }}
      >
        Set Block Nodes
      </button>

      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    onClick={(row, col) => {
                      if (isSetStartNode) {
                        console.log(row, col);
                        setStartNode({
                          row: row,
                          col: col,
                        });
                        redrawNodes();
                      }
                    
                      if(isSetFinishNode){
                        setFinishNode({
                          row: row,
                          col: col,
                        });
                        redrawNodes();
                      }

                    }}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mousePressed}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                    onMouseUp={handleMouseUp}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
