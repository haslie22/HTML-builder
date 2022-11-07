const path = require('path');
const { stdin, stdout } = process;
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');

function endProgram() {
  lineReader.close();
  stdout.write('See ya!\n');
}

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const lineReader = createInterface({ 
  input: stdin,
  output: stdout
});

const outputFile = createWriteStream(filePath, 'utf-8');

lineReader.write('Hello!\nPlease type the text you\'d like to save:\n');
lineReader.on('SIGINT', () => endProgram());
lineReader.on('line', data => {
  data.trim().toLowerCase() === 'exit' ? endProgram() : outputFile.write(data + '\n');
});
