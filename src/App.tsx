import React, { useCallback, useRef, useState } from 'react';
import produce from 'immer';

const numRows = 50;
const numCols = 50;

// Used to get all the neighbours of a cell (8 different operations)
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  const [running, setRunning] = useState<boolean>(false);

  // To keep track of the running state in the simulation function
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((currentGrid) => {
      return produce(currentGrid, newGrid => {
        for (let i: number = 0; i < numRows; i++) {
          for (let j: number = 0; j < numCols; j++) {
            let neighbours: number = 0;
            // Get the number of neighbours of the current cell
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += currentGrid[newI][newJ];
              }
            });

            // Apply the rules
            if (neighbours < 2 || neighbours > 3) {
              newGrid[i][j] = 0;
            } else if (currentGrid[i][j] === 0 && neighbours === 3) {
              newGrid[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <>
      <button 
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>

      <button onClick={() => {
        setGrid(() => {
          return produce(grid, cleanGrid => {
            for (let i: number = 0; i < numRows; i++) {
              for (let j: number = 0; j < numCols; j++) {
                cleanGrid[i][j] = 0;
              }
            }
          });
        });
      }}>clear</button>
      <div className="App" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) => rows.map((col,k) => 
        <div key={`${i}-${k}`} 
        onClick={() => {
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][k] = grid[i][k] ? 0 : 1;
          });
          setGrid(newGrid);
        }} 
        style={{width: 20, 
          height: 20, backgroundColor: grid[i][k] ? 'pink' : undefined,
          border: 'solid 1px black'
        }}>

        </div>))
        }
      </div>
    </>
  );
}

export default App;
