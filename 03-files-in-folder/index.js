const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = require('process');

const dirPath = path.join(__dirname, 'secret-folder');
const options = { withFileTypes: true };

function convertBytesToKb (amount, franctionalPartLength) {
  return `${(amount / 1024).toFixed(franctionalPartLength)}kB`;
}

async function getFilesInfo(path, opts) {
  try {
    const files = await readdir(path, opts);
    files.filter(file => !file.isDirectory()).forEach(file => logFilesInfo(file));
  } catch (err) {
    console.log('\x1b[31m', 'Error: ', err.message);
  }
}

async function logFilesInfo(fileToLog) {
  const filePath = path.join(dirPath, fileToLog.name);
  try {
    const fileStats = await stat(filePath);
    let fileInfoArr = path.basename(filePath).split('.');
    if (fileInfoArr.length > 1) {
      let ext = '';
      if (fileInfoArr[0] !== '') {
        ext = fileInfoArr.pop();
      }
      const name = fileInfoArr.join('.');
      fileInfoArr = [name, ext];
    }

    fileInfoArr.push(convertBytesToKb(fileStats.size));
    [fileInfoArr] = [fileInfoArr.map(item => item.padEnd(15, ' '))];
    stdout.write(`${fileInfoArr.join(' ')}\n`);
  } catch (err) {
    console.log('\x1b[31m', 'Error: ', err.message);
  }
}

getFilesInfo(dirPath, options);