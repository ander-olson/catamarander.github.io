(function () {
  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var View = Tetris.View = function (board) {
    this.board = board;
    this.queue = this.board.queue;
    this.createViews(".up-next", "up-next-row", "up-next-cell", 17, 6);
    this.createViews(".board", "tetris-row", "tetris-cell", 20, 10);
  };

  View.prototype.createViews = function (el, outerName, innerName, height, width) {
    for (var i = 2; i < height + 2; i++) {
      var $row = $('<div>');
      $row.attr({ class: outerName, y: i });

      for (var j = 0; j < width; j++) {
        var $cell = $('<div>');
        $cell.attr({ x: j, class: innerName });

        $row.append($cell)
      }

      $(el).append($row)
    }
  };

  View.prototype.renderScore = function () {
    $('.score').text(this.board.score);
  };

  View.prototype.setCell = function (el, x, y, shapeClass) {
    var $cell = $(el).find("[y=" + y + "]").find("[x=" + x + "]")
    $cell.addClass(shapeClass)
  };

  View.prototype.unSetCell = function (el, x, y, className) {
    var $cell = $(el).find("[y=" + y + "]").find("[x=" + x + "]")
    $cell.attr({class: className})
  };

  View.prototype.render = function () {
    for (var i = 0; i < this.board.grid.length; i++) {
      for (var j = 0; j < this.board.grid[i].length; j++) {
        this.unSetCell('.board', j, i, 'tetris-cell')
        if (this.board.grid[i][j] != 0) {
          this.setCell('.board', j, i, this.board.grid[i][j])
        } else {
        }
      }
    }
  };

  View.prototype.clearUpNext = function () {
    for (var i = 0; i < 18; i++) {
      for (var j = 0; j < 7; j++) {
        this.unSetCell('.up-next', j, i, 'up-next-cell')
      }
    }
  };

  View.prototype.renderUpNext = function () {
    this.clearUpNext();
    var that = this;
    for (var i = 0; i < 4; i++) {
      var shape = this.queue.upNext[i];
      var shapeName = shape.shapeName;
      shape.layouts[0].forEach(function (arr) {
        var buffer = 3;
        if (shapeName === "i") {
          buffer = 4;
        }
        that.setCell('.up-next', arr[1] - 2, (arr[0] + (4 * i + buffer)), shapeName )
      })
    }
  }
})();
