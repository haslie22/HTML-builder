const path = require('path');
const { stdout } = process;
const { createReadStream } = require('fs');

const readStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readStream.on('data', data => stdout.write(data));
readStream.on('error', err => console.log(err.message));
