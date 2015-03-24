(function () {
  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  Array.prototype.shuffleFY = function() {
    for (var i = this.length - 1; i > 0; i-- ) {
        var j = Math.floor( Math.random() * i );

        var swap = this[i];
        this[i]  = this[j];
        this[j]  = swap;
    }

    return this;
  };

  var Queue = Tetris.Queue = function () {
    this.upNext = [];
    this.minimumLength = 4;
    this.add(4);
  };

  Queue.prototype.append = function (arr) {
    var that = this;
    arr.forEach(function (el) {
      that.upNext.push(el)
    })
  };

  Queue.prototype.add = function (num) {
    var that = this;
    var shapes = ["i", "j", "l", "o", "s", "t", "z"].shuffleFY().slice(0, 4);
    var tetrominos = [];
    shapes.forEach( function (shape) {
      tetrominos.push(new Tetris.Tetromino(false, shape))
    })
    this.append(tetrominos)
  };

  Queue.prototype.next = function () {
    var next = this.upNext.shift()
    if (this.upNext.length < this.minimumLength) {
      this.add(4);
    }
    return next
  }
})();
