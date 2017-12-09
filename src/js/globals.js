import { Subject } from 'rxjs/Subject';

export default {
  buttons: [
    document.querySelector('button.face'),
    document.querySelector('button.easy'),
    document.querySelector('button.medium'),
    document.querySelector('button.hard')
  ],
  canvas: document.getElementById('screen'),
  gameElem: document.querySelector('.game'),
  subject: new Subject()
}
