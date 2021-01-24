// const { spawn } = require('child_process');
// const exe = spawn('node', ['src/gestureSensor/print.js'], { shell: true, detached: true });

// exe.stdout.on('data', data => console.log(`stdout: ${data}`));
// exe.stderr.on('data', data => console.log(`stderr: ${data}`));
// exe.on('close', code => console.log(`child process exited with code ${code}`));

const { spawn } = require('child_process');
const exe = spawn('node', ['src/gestureSensor/print.js']);
exe.stdout.on('data', data => console.log(`stdout: ${data}`));
exe.stderr.on('data', data => console.log(`stderr: ${data}`));
exe.on('close', code => console.log(`child process exited with code ${code}`));
