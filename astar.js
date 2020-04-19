const maze = [' ##########',
              '       ####',
              '# #### ####',
              '           ',
              '##########E'
              ];
const ROWS = maze.length;
const COLS = maze[0].split("").length;
console.log(ROWS, COLS);
const neighbours = [[-1,0],[1,0],[0,-1],[0,1]];
let closedSet = [];
let openSet = [];
let cellTable = [];

for(let i = 0; i < ROWS; i++) {
  let line = maze[i].split("");
  closedSet[i] = [];
  cellTable[i] = [];
  for(let j = 0; j < COLS; j++) {
    closedSet[i][j] = false;
    cellTable[i][j] = {
      val: line[j],
      row: i,
      col: j,
      f: Number.MAX_SAFE_INTEGER,
      g: Number.MAX_SAFE_INTEGER,
      h: Number.MAX_SAFE_INTEGER,
      parentRow: false,
      parentCol: false
    };
  }
}

function inOpenSet(si,sj) {
  for( let i =0; i < openSet.length; i++) {
    if( openSet[i].row === si && openSet[i].col === sj ) return true;
  }
  return false;
}

function heuristic(pos1, pos2) {
  if(typeof pos2 === 'undefined') {
    pos2 = {
      x: COLS,
      y: ROWS
    };
  }
 return Math.sqrt(
  ((pos1.x - pos2.x)*(pos1.x - pos2.x)) + ((pos1.y - pos2.y)*(pos1.y - pos2.y))
 );
}

function isValid(i,j) {
  let res =  (i >= 0 && i < ROWS && j >= 0 && j < COLS && cellTable[i][j].val !== '#');
  return res;
}

function isDest(i,j) {
  return ((i === (ROWS -1)) && (j === (COLS - 1)));
}


function astar() {
  cellTable[0][0].f = 0;
  cellTable[0][0].g = 0;
  cellTable[0][0].h = 0;
  openSet.push( cellTable[0][0] );

  let index = 100;
  while( openSet.length && index ) {
    let smallestF = 9999;
    let smallestFIndex = -1
    for(let i = 0; i<openSet.length; i++) {
      if( openSet[i].f < smallestF ) {
        smallestF = openSet[i].f;
        smallestFIndex = i;
      }
    }
    let current = openSet.splice(smallestFIndex,1)[0];//openSet.shift();
    closedSet[current.row][current.col] = true;
    for( let elIndex = 0; elIndex < neighbours.length; elIndex++) {
      
      let i = current.row - neighbours[elIndex][0];
      let j = current.col - neighbours[elIndex][1];
      if( isValid(i,j) ) {
        if( isDest(i,j) ) {
          cellTable[i][j].parentRow = current.row;
          cellTable[i][j].parentCol = current.col;
    //      console.log('FINISHED!');
          return;
        }
        let newG = current.g + 1;
        let newH = heuristic({x: i, y: j});
        let newF = newG + newH;
        if( newF >= current.f && !closedSet[i][i] ) {
          cellTable[i][j].g = newG;
          cellTable[i][j].h = newH;
          cellTable[i][j].f = newF;
       }
        if( !inOpenSet(i,j) && !closedSet[i][j] ) {
          cellTable[i][j].parentRow = current.row;
          cellTable[i][j].parentCol = current.col;
          openSet.push(cellTable[i][j]);
        }
      }
    };

    index--;
  }
}

astar();

let field = cellTable[ROWS-1][COLS-1];
while( field.parentRow !== false ) {
  cellTable[field.row][field.col].val = 'o';
  field = cellTable[field.parentRow][field.parentCol];
}


cellTable.forEach(x => {
  let line = [];
  x.forEach( y => line.push(y.val) );
  console.log( line.join(""));
});


