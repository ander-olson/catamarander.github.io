(function () {
  if (typeof Tetris === "undefined") {
    window.Tetris = {};
  }

  var Game = Tetris.Game = function () {
    this.board = new Tetris.Board();
    this.view = new Tetris.View(this.board);
  };

  Game.prototype.newGame = function () {
    var that = this;
    $( document ).one( "keydown", function (e) {
      if (e.keyCode == 13 ) {
        that.play();
      }
    })
  }

  Game.prototype.play = function () {
    var that = this;
    this.board.clearAllGrids();
    $('.screen').hide();
    var falling = setInterval(that.board.descend.bind(that.board), 160)
    var update = setInterval(that.board.updateGrid.bind(that.board), 50)
    var render = setInterval(that.view.render.bind(that.view), 100)
    var renderUpNext = setInterval(that.view.renderUpNext.bind(that.view), 500)
    var scoring = setInterval(that.view.renderScore.bind(that.view), 500)
    var gamePlay = setInterval(function () {
      if (that.board.isEnded) {
        clearInterval(falling);
        clearInterval(update);
        clearInterval(render);
        clearInterval(renderUpNext);
        clearInterval(gamePlay);
        clearInterval(scoring);
        $('.screen').show();
      }
    }, 50)
  };
})();
