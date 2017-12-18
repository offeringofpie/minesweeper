import Field from './Minefield';
import globals from '../globals';
import {Observable, Subject} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';

export default class Game {
  constructor(cols, rows, mines) {
    this.canvas = globals.canvas;
    this.context = globals.canvas.getContext('2d');
    this.firstRun = true;
    this.cols = cols;
    this.rows = rows;
    this.mines = mines;
    this.field = new Field();
  }

  init(cols = this.cols, rows = this.rows, mines = this.mines) {
    if (cols && rows && mines) {
      this.cols = cols;
      this.rows = rows;
      this.mines = mines;
    }

    this.field.clean();
    this.field.init(this.cols, this.rows, this.mines);

    if (this.firstRun) {
      Observable
        .fromEvent(this.canvas, 'mousedown')
        .subscribe(e => {
          this.click(e);
        });

      Observable
        .fromEvent(this.canvas, 'touchstart')
        .subscribe(e => {
          this.click(e);
        });

      Observable
        .fromEvent(this.canvas, 'mouseup')
        .subscribe(e => {
          globals.gameElem.classList.remove('click');
        });

      this.canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
      });

      this.firstRun = false;
    }
  }

  click(e) {
    let x = Math.floor(e.offsetX*this.cols/this.canvas.clientWidth);
    let y = Math.floor(e.offsetY*this.rows/this.canvas.clientHeight);

    const gameClasses = globals.gameElem.classList;
    if (!gameClasses.contains('lose') && !gameClasses.contains('win')) {
      gameClasses.add('click');
    }

    if (e.buttons === 1) {
      if (!this.field.hasFlag(x,y)) {
        console.log(this.field.mineField[x][y])
        if (this.field.hasMine(x,y)) {
          this.field.reveal(x,y,'boom');
        } else {
          this.field.revealArea(x,y);
        }
      }
    } else if (e.buttons === 2) {
      this.field.flag(x,y);
      this.field.checkEndGame();
    }
  }
}
