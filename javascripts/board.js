(function () {
  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Board = Tetris.Board = function () {
    this.queue = new Tetris.Queue(4);
    this.isEnded = false;
    this.score = 0;
    this.grid = this.createGrid();
    this.landedGrid = this.createGrid();
    this.generateTetromino();
  };

  Board.prototype.createGrid = function () {
    var grid = [];
    for (var i = 0; i < 22; i++) {
      grid[i] = [];
      for (var j = 0; j < 10; j++) {
        grid[i].push(0);
      }
    }

    return grid;
  };

  Board.prototype.set = function (grid, x, y, val) {
    grid[y][x] = val;
  };

  Board.prototype.generateTetromino = function () {
    this.activeTetromino = this.queue.next();
    if (this.checkCollisions("descend")) {
      this.end();
    }
  };

  Board.prototype.toRight = function () {
    if (!this.checkCollisions("move", "right")) {
      this.activeTetromino.move("right")
      this.displayFall();
    }
  };

  Board.prototype.toLeft = function () {
    if (!this.checkCollisions("move", "left")) {
      this.activeTetromino.move("left")
      this.displayFall();
    }
  };

  Board.prototype.displayFall = function () {
    var landTet = new Tetris.Tetromino({
      shape: this.activeTetromino.shape,
      rotation: this.activeTetromino.rotation,
      layouts: this.activeTetromino.layouts
    })

    this.displayTet = landTet;
    this.fakeSuperDescend();
  }

  Board.prototype.fakeSuperDescend = function () {
    while (!this.fakeCheckCollisions("descend")) {
      this.fakeDescend();
    }
  }

  Board.prototype.fakeDescend = function () {
    this.displayTet.descend();
  }

  Board.prototype.fakeCheckCollisions = function () {
    var possibleTet = new Tetris.Tetromino({
      shape: this.displayTet.shape,
      rotation: this.displayTet.rotation,
      layouts: this.displayTet.layouts
    })

    possibleTet.descend();

    var board = this,
      occupied = false;

    possibleTet.currentLayout().forEach(function (pos) {
      if (pos[0] >= 22 || board.landedGrid[pos[0]][pos[1]] != 0) {
        occupied = true;
      }
    })

    if (occupied) { return true }
    return false
  }

  Board.prototype.superDescend = function() {
    while (!this.checkCollisions("descend")) {
      this.score += 5;
      this.descend();
    }
  };

  Board.prototype.descend = function () {
    if (this.checkCollisions("descend")) {
      this.addToLandedGrid(this.activeTetromino);
      this.generateTetromino();
      return
    }

    var tet = this.activeTetromino,
      that = this,
      stillFalling = true;

    tet.currentLayout().forEach(function (pos) {
      if (pos[0] > 20) {
        that.addToLandedGrid(that.activeTetromino);
        that.generateTetromino();
        stillFalling = false;
        return
      }
    })

    if (stillFalling) {
      this.activeTetromino.descend();
      this.updateGrid();
    }
  };

  Board.prototype.addToLandedGrid = function (tetromino) {
    var that = this;
    tetromino.currentLayout().forEach( function (pos) {
      that.set(that.landedGrid, pos[1], pos[0], tetromino.shapeName)
    })
    this.checkLine();
  };

  Board.prototype.rotate = function () {
    if (!this.checkCollisions("rotate")) {
      this.activeTetromino.rotate();
      this.displayFall();
    }
  };

  Board.prototype.clearAllGrids = function () {
    for (var i = 0; i < this.landedGrid.length; i++) {
      for (var j = 0; j < this.landedGrid[i].length; j++) {
        this.landedGrid[i][j] = 0;
        this.grid[i][j] = 0;
      }
    }
  }

  Board.prototype.clearGrid = function () {
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        if (this.landedGrid[i][j] === 0) {
          this.grid[i][j] = 0;
        }
      }
    }
  };

  Board.prototype.updateGrid = function () {
    this.clearGrid();
    this.displayFall();
    var layout = this.activeTetromino.currentLayout(),
      shape = this.activeTetromino.shapeName,
      dispLayout = this.displayTet.currentLayout(),
      that = this;

    dispLayout.forEach( function (pos) {
      that.set(that.grid, pos[1], pos[0], "white")
    })

    layout.forEach( function (pos) {
      that.set(that.grid, pos[1], pos[0], shape)
    })

  };

  Board.prototype.checkCollisions = function (callback, options) {
    var possibleTet = new Tetris.Tetromino({
      shape: this.activeTetromino.shape,
      rotation: this.activeTetromino.rotation,
      layouts: this.activeTetromino.layouts
    })

    possibleTet[callback](options);

    var board = this,
      occupied = false;

    possibleTet.currentLayout().forEach(function (pos) {
      if (pos[0] >= 22 || board.landedGrid[pos[0]][pos[1]] != 0) {
        occupied = true;
      }
    })

    if (occupied) { return true }
    return false
  };

  Board.prototype.checkLine = function () {
    var completeLine = true
      that = this,
      landed = this.landedGrid;

    for (var i = landed.length - 1; i > 1; i--) {
      completeLine = true;
      landed[i].forEach ( function (cell) {
        if (cell == 0) {
          completeLine = false
        }
      })
      if (completeLine) {
        that.shiftRowsDown(i)
        i++;
      }
    }
  };

  Board.prototype.shiftRowsDown = function (y_index) {
    this.landedGrid.splice(y_index, 1);
    this.grid.splice(y_index, 1);
    this.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.landedGrid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.score += 100;
  };

  Board.prototype.end = function () {
    this.isEnded = true;
  };

  Board.prototype.isEnded = function () {
    return this.isEnded;
  }

  Board.prototype.printGrid = function () {
    this.grid.forEach( function (row) {
      console.log("\n" + row)
    })
  };

  Board.prototype.printLanded = function () {
    this.landedGrid.forEach( function (row) {
      console.log("\n" + row)
    })
  };
})();
