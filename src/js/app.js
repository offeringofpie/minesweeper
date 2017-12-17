import Game from './classes/Game';
import globals from './globals';

let rows = 20;
let cols = 20;
let mines = 50;

const game = new Game(rows,cols,mines);

globals.buttons.forEach(button => {
  button.addEventListener('click',e => {
    switch (e.currentTarget.classList[0]) {
      case 'easy':
        rows = 15;
        cols = 15;
        mines = 30;
        break;
      case 'medium':
        rows = 20;
        cols = 20;
        mines = 50;
        break;
      case 'hard':
        rows = 50;
        cols = 50;
        mines = 250;
        break;
      default:
        break;
    }

    globals.gameElem.className = 'game';
    e.preventDefault();
    game.init(rows,cols,mines);
  });
})

game.init(rows,cols,mines);
