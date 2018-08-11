import globals from '../globals';

export default class Minefield {
  constructor() {
    this.canvas = globals.canvas;
    this.context = globals.canvas.getContext('2d');
    this.width = globals.canvas.width;
    this.height = globals.canvas.height;
    this.cols = 0;
    this.rows = 0;
    this.colSize = 0;
    this.rowSize = 0;
    this.tileSize = 0;
    this.mines = 0;
    this.mineField = [];
    this.image = new Image(512,85);
    this.gameOver = false;
    this.subject = globals.subject;
  }

  init(cols, rows, mines) {
    this.cols = cols;
    this.colSize = this.width / cols;
    this.mines = mines;
    this.rows = rows;
    this.rowSize = this.height / rows;
    this.tileSize = (this.colSize+this.rowSize)/2;
    this.context.imageSmoothingEnabled = false;
    this.image.src = './img/windows.gif';

    this.image.onload = () => {
      this.clean();
    }

    this.subject.subscribe({
      next: value => {
        if (value.mines && value.gameOver) {
          globals.gameElem.classList.add('win');
        } else {
          globals.gameElem.classList.add('lose');
        }
      }
    });
  }

  clean() {
    this.gameOver = false;
    this.mineField = [];
    this.context.clearRect(0, 0, this.width, this.height);

    for (let r = 0; r<this.rows; ++r) {
      this.mineField[r] = [];
      for (let c = 0; c<this.cols; ++c) {
        this.mineField[r][c] = {
          bomb: 0,
          adjacent: 0,
          hidden: 1,
          flag: 0
        };
      }
    }

    this.mineField.forEach((v,c) => {
      this.mineField[c].forEach((v,r) => {
        this.drawTile(c,r);
      });
    })

    this.plantMines(this.mines);
  }

  reveal(x,y) {
    if (!this.gameOver) {
      this.mineField.forEach((v,c) => {
        this.mineField[c].forEach((tile,r) => {
          if (tile.flag && !tile.bomb) {
            tile.flag = 0;
            this.drawTile(c,r,'flag');
          } else {
            this.drawTile(c,r);
            tile.hidden = 0;
          }
        });
      });
      this.drawTile(x,y,'boom');
      this.subject.next(this);
      this.gameOver = true;
    }
  }

  revealArea(x,y) {
    let matrix = [
      [x-1,y-1],[x,y-1],[x+1,y-1],
      [x-1,y],[x,y],[x+1,y],
      [x-1,y+1],[x,y+1],[x+1,y+1]
    ];
    let clickedTile = this.mineField[x][y];

    if ((!clickedTile.hidden && this.proximityMine(x, y) && (this.proximityFlag(x, y) !== this.proximityMine(x, y))) || clickedTile.flag) {
    } else {
      matrix.forEach(([c,r]) => {
        if (c>=0 && r>=0 && c<this.cols && r<this.rows) {
          let tile = this.mineField[c][r];
          if ((tile.bomb && !(this.proximityFlag(c,r) == this.proximityMine(c,r))) || !tile.hidden || tile.flag) {
            return;
          } else {
            tile.hidden = 0;
            this.drawTile(c,r,'dig');
            if (!tile.adjacent) {
              this.revealArea(c,r);
            }
          };
        }
      });
    }

    this.checkEndGame();
  }

  checkEndGame() {
    let hidden = 0;
    let correct = 0;
    this.mineField.forEach((v,c) => {
      this.mineField[c].forEach((v,r) => {
        hidden += v.hidden;
        if (v.bomb && v.flag) {
          correct += 1;
        }
      });
    });

    if (this.mines == correct || this.mines == hidden) {
      this.gameOver = true;
      globals.gameElem.classList.add('win');
    };
  };

  drawTile(x,y,action = '') {
    const context = this.context;
    const tile = this.mineField[x][y];
    let coordX = 0;
    let spriteWidth = this.image.width/6;

    if (action === 'flag') {
      if (tile.flag) {
        coordX = 0;
      } else {
        coordX = spriteWidth*2;
      }
    } else if (action === 'boom') {
      coordX = spriteWidth*4;
    } else if (tile.bomb) {
      if (tile.flag) {
        coordX = spriteWidth*5;
      } else {
        coordX = spriteWidth*3;
      }
    } else if (action === 'dig') {
      coordX = spriteWidth;
    } else if (!tile.hidden) {
      coordX = spriteWidth;
    }


    context.drawImage(
      this.image,
      coordX,0,spriteWidth,this.image.height,
      this.colSize*x,this.rowSize*y,
      this.colSize,this.rowSize
    );

    if (tile.adjacent && !tile.hidden) {
      context.font = this.colSize/2+"px sans-serif";
      context.textAlign = 'center';
      context.textBaseLine = 'middle';
      context.fillStyle = '#'+ ('000000' + (tile.adjacent/100*0xFFFFFF<<0).toString(16)).slice(-6);

      context.fillText(tile.adjacent,
        (this.colSize*(x+1))-this.colSize/2,
        (this.rowSize*(y+1))-this.rowSize/3
      );
    }
  }


  plantMines(mines) {
    for (let m = 0; m<mines; ++m) {
      this.plantMine();
    }
    this.markAdjacentTiles();
  }

  plantMine() {
    let x = Math.floor(Math.random() * this.cols);
    let y = Math.floor(Math.random() * this.rows);

    if (this.mineField[x][y].bomb) {
      this.plantMine();
    } else {
      this.mineField[x][y].bomb = 1;
    }
  }

  flag(x,y) {
    const tile = this.mineField[x][y];

    if (tile.hidden) {
      this.drawTile(x,y,'flag');
      tile.flag = !tile.flag;
    }
  }

  hasMine(x,y) {
    if (x>=0 && y>=0 && x<this.cols && y<this.rows) {
      return this.mineField[x][y].bomb;
    } else {
      return;
    }
  }

  hasFlag(x,y) {
    if (x>=0 && y>=0 && x<this.cols && y<this.rows) {
      return this.mineField[x][y].flag;
    } else {
      return;
    }
  }

  proximityMine(x,y) {
    let matrix = [
      [x-1,y-1],[x,y-1],[x+1,y-1],
      [x-1,y],[x,y],[x+1,y],
      [x-1,y+1],[x,y+1],[x+1,y+1]
    ]
    if (x>=0 && y>=0 && x<this.cols && y<this.rows) {
      return matrix.filter(([x,y]) => this.hasMine(x,y)).length;
    } else {
      return;
    }
  }

  proximityFlag(x,y) {
    let matrix = [
      [x-1,y-1],[x,y-1],[x+1,y-1],
      [x-1,y],[x,y],[x+1,y],
      [x-1,y+1],[x,y+1],[x+1,y+1]
    ]
    if (x>=0 && y>=0 && x<this.cols && y<this.rows) {
      return matrix.filter(([x,y]) => this.hasFlag(x,y)).length;
    } else {
      return;
    }
  }

  markAdjacentTiles() {
    this.mineField.forEach((v,c) => {
      this.mineField[c].forEach((tile,r) => {
        let adjacent = this.proximityMine(c,r);
        if (adjacent && !this.hasMine(c,r)) {
          tile.adjacent = adjacent;
        }
      });
    });
  }
}
