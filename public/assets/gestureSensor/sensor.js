const keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key && key.name === 'c' && key.ctrl) process.exit();
  switch (key.name) {
    case 'a':
      console.log('Left');
      break;
    case 'd':
      console.log('Right');
      break;
    case 'w':
      console.log('Up');
      break;
    case 's':
      console.log('Down');
      break;
    case 'q':
      console.log('AntiClockwise');
      break;
    case 'e':
      console.log('Clockwise');
      break;
    case 'x':
      console.log('Wave');
      break;
    default:
      console.log(key.name);
      break;
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
