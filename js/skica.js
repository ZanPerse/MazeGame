
var sprite = 1;
var mov=1;
var cols, rows;
var cell_size = 50;
var grid = [];
var  current;
var stack = [];
var cnv;
var img;
var current, start, end, bug, alpha, start, end, r_end, r_start;
var start_drawing = false;
var finished = false;
var init_solve = true;
var startSolve = false;
var canSolve = false;
var sand;
var stack1=[];
var song;
function preload() {

  //create an animation from a sequence of numbered images
  //pass the first and the last file name and it will try to find the ones in between
  tresure = loadImage('slike/treasure-chest.png')
  ghost = loadAnimation('slike/sprite/front.png','slike/sprite/front1.png','slike/sprite/front2.png');
  nazaj   = loadAnimation('slike/sprite/back.png','slike/sprite/back1.png','slike/sprite/back2.png');
  levo    = loadAnimation('slike/sprite/left.png','slike/sprite/left1.png','slike/sprite/left2.png');
  desno   = loadAnimation('slike/sprite/right.png','slike/sprite/right1.png','slike/sprite/right2.png');
  knaprej = loadAnimation('slike/sprite1/naprej.png','slike/sprite1/naprej1.png','slike/sprite1/naprej2.png');
  knazaj = loadAnimation('slike/sprite1/nazaj.png','slike/sprite1/nazaj1.png','slike/sprite1/nazaj2.png');
  kdesno = loadAnimation('slike/sprite1/desno.png','slike/sprite1/desno1.png','slike/sprite1/desno2.png');
  klevo = loadAnimation('slike/sprite1/levo.png','slike/sprite1/levo1.png','slike/sprite1/levo2.png');
 sand = loadImage('slike/gravel.png');
 song = loadSound('zvok/song.mp3');
}

function setup() {
 let cnv = createCanvas(601, 601);
  cols = floor(width / cell_size);
  rows = floor(height/ cell_size);
  frameRate(5);
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}
function draw() {
  image(sand,0,0,601,601);

  //RENDERS THE GRID OF CELLS
  for (var i = 0; i < grid.length; i++) {
    grid[i].render(255, 0, 255, 100);
  }
  current.visited = true; //SETS THE CURRENT CELL TO VISITED

  current.curentCell(); //RENDERS AN IMAGE IN THE CURRENT CELL

  //STOPS THE DRAW() LOOP IF THE MAZE IS SOLVED
  if (canSolve && finished && current.j == end.j && current.i == end.i) {
    finished = false;
    noLoop();
    finish();
  }

  //STARTS DRAWING IF THE BUTTON IS PRESSED
  if (start_drawing && !finished) {
    var next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current); //PUSHES THE CURRENT CELL TO THE STACK
      removeWalls(current, next); //REMOVES THE WALLS OF THE CURRENT AND NEXT CELLS
      current = next;
    }
    //IF THE NEXT CELL ISNT AVAILABLE AND THE THERE IS AT LEAST A CELL ON THE STACK, SETS THE CURRENT CELL TO THE LAST CELL THAT WAS ON THE ON TOP OF THE STACK
    else if (stack.length > 0) {
      current = stack.pop();
    }
    //IF THERE ISNT ANYTHING ON THE STACK AND THE NEXT CELL ISNT AVAILABLE IT STOPS THE DRAWING OF THE MAZE
    else {
      finished = true;
      document.getElementById('solve').style.display = "inline";
      document.getElementById('start').style.display = "hidden";
      start_end();
      current = grid[r_start];
    }
  }

  // IF THE BUTTON WAS PRESSED IT STARTS THE SOLVING
  if (startSolve) {
    solve();
    canSolve = true;
    startSolve = false;
  }

  //IF THE DRAWING OF THE MAZE IS STOPPED. IT START DRAWING THE SOLUTION
  if (finished) {
    start_drawing = false;
    var next = current.solveDirection();
    if (next) {
      next.visited = true;
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current.visitedSecondTime = true;
      current = stack.pop();
      mov = stack1.pop();
    }
  }
}

//GETS INDEX OF 1D ARRAY FROM I,J CORDINATES OF A 2D ARRAY
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.visitedSecondTime = false;
  this.start = false;
  this.end = false;
  this.ind = index(i, j);

  // CHECKS THE AVAILABLE NEIGHBORS OF THE CELL AND ADDS THE AVAILABLE TO THE NEIGHBORS ARRAY
  this.checkNeighbors = function() {
    var neighbors = [];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
    neighbors.push(top);
	  mov = 2;
    stack1.push(2);
    }
    if (right && !right.visited) {
      neighbors.push(right);
	  	  mov = 4;
        stack1.push(4);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
	  	  mov = 1;
        stack1.push(1);
    }
    if (left && !left.visited) {
      neighbors.push(left);
	  	  mov = 3;
        stack1.push(3);
    }
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];

    } else {
      return undefined;
    }
  }

  // CHECKS THE AVAILABLE NEIGHBORS OF THE CELL AND ADDS THE AVAILABLE TO THE NEIGHBORS ARRAY
  this.solveDirection = function() {
    var neighbors = [];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited && !this.walls[0]) {
      neighbors.push(top);
      mov = 2;
    }
    if (right && !right.visited && !this.walls[1]) {
      neighbors.push(right);
      mov = 4;
    }
    if (bottom && !bottom.visited && !this.walls[2]) {
      neighbors.push(bottom);
      mov = 1;
    }
    if (left && !left.visited && !this.walls[3]) {
      neighbors.push(left);
      mov = 3;
    }
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];

    } else {
      return undefined;
    }
  }

  // RENDERS THE CELL
  this.render = function(r, g, b, a) {
    var x = this.i * cell_size ;
    var y = this.j * cell_size ;

    stroke(25);
    strokeWeight(3);
    if (this.walls[0]) {
      line(x, y, x + cell_size, y);
    }
    if (this.walls[1]) {
      line(x + cell_size, y, x + cell_size, y + cell_size);
    }
    if (this.walls[2]) {
      line(x + cell_size, y + cell_size, x, y + cell_size);
    }
    if (this.walls[3]) {
      line(x, y + cell_size, x, y);
    }
    if (this.end) {
	  image(tresure,x,y,cell_size,cell_size);
    }
  }

  // RENDERS AN IMAGE IN THE PLACE OF THE CURRENT CELL
  this.curentCell = function() {
    var x = this.i * cell_size ;
    var y = this.j * cell_size ;
   // noStroke();
    //fill(255, 255, 255);
   // rect(x, y, cell_size, cell_size);
   if(mov === 1 && sprite === 1){
	 animation(ghost,x+25,y+25,cell_size,cell_size);
   }else if(mov === 1 && sprite === 2){
	   animation(knaprej,x+25,y+25);
   }
   if(mov === 2 && sprite === 1){
	 animation(nazaj,x+25,y+25,cell_size,cell_size);
   }else if(mov === 2 && sprite === 2){
	   animation(knazaj,x+25,y+25);
   }
   if(mov === 3 && sprite === 1){
	 animation(levo,x+25,y+25,cell_size,cell_size);
   }else if(mov === 3 && sprite === 2 ){
	   animation(klevo,x+25,y+25);
   }
   if(mov === 4 && sprite === 1){
	 animation(desno,x+25,y+25,cell_size,cell_size);
   }else if(mov === 4 && sprite === 2){
	   animation(kdesno,x+25,y+25);
   }
  }

}


function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}


function start_end() {
  r_start = floor(random(0, cols));
  r_end = floor(random(grid.length - cols, grid.length));
  if (r_start == r_end) {
    start_end();

  }

  grid[r_start].start = true;
  grid[r_end].end = true;
  grid[r_start].walls[0] = false;
  grid[r_end].walls[2] = false;

}

function drawMaze() {
  if (!start_drawing) {
    start_drawing = true;
  } else {
    start_drawing = false;
  }
}

function solve() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].visited = false;
    if (grid[i].start) {
      current = grid[i];
      start = current;
	  sprite =2 ;
    } else if (grid[i].end) {
      end = grid[i];
    }
  }
}

function solveMaze() {
  startSolve = true;
}
function reset() {
location.reload();
}
function soundMaze(){
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
      song.stop();
      document.getElementById("myImg").src = "slike/buttons/music3.png";
    } else {
      song.play();
      document.getElementById("myImg").src = "slike/buttons/music2.png";
    }
  }
//SWEETALERT2 FOR INFOBOX AT STARTMENU
  function info(){
    Swal.fire({
        html:
        '<img src="slike/buttons/prenos.png" alt="start" height="64" width="64"><br/>'+
        '<p style="color:white">Ko klikneš na sliko demon prične sestavljati labirint</p><br/>'+
        '<img src="slike/buttons/refresh.png" alt="refresh" height="64" width="64"><br/>'+
        '<p style="color:white">Ko klikneš na sliko se stran osveži</p><br/>'+
        '<img src="slike/buttons/solve.png" alt="solve" height="64" width="64"><br/>' +
        '<p style="color:white">Ko klikneš na sliko vitez prične reševati labirint</p><br/>'+
        '<img src="slike/buttons/music2.png" alt="music" height="64" width="64"><br/>' +
        '<p style="color:white">Ko klikneš na sliko se glasba predvaja</p><br/>'+
        '<img src="slike/buttons/music3.png" alt="music" height="64" width="64"><br/>' +
        '<p style="color:white">Ko klikneš na sliko se glasba  neha predvajati</p>' +
        '<h1 style="color:white; height:50px;"> Credits </h1><br/>'+
        '<img src="slike/sheild1.png" alt="start" height="128" width="128"><br/>'+
        '<p style="color:white">Žan Perše 4. RA</p>'  ,
        background:'#323232',
    });
  }
  //SWEETALERT2 FOR  SOLVING THE MAZE
  function finish(){
    Swal.fire({
      html:'<img src="slike/treasure-chest.png" height="128" width="128">' +
      '<p style="color:white;font-size:26;">Našel si zaklad</p><br/>'

      ,
        background:'#323232',
    });
  }
