const path = require('path');
const { createWriteStream, rm } = require('fs');
const { readFile, readdir } = require('fs/promises');

const settings = {
    inputPath: path.join(__dirname, 'styles'),
    outputPath: path.join(__dirname, 'project-dist', 'bundle.css'),
    filesExt: '.css',
    charset: 'utf-8',
}

function filterAppropriateFiles(files) {
    return files.filter(file => file.isFile() && path.extname(file.name) === '.css');
}

async function mergeStyles() {
    try {
        const writeStream = createWriteStream(settings.outputPath, settings.charset);
        const allFiles = await readdir(settings.inputPath, { withFileTypes: true });
        const selectedFiles = filterAppropriateFiles(allFiles);

        for (let file of selectedFiles) {
            const fileContent = await readFile(path.join(settings.inputPath, file.name), settings.charset);
            writeStream.write(fileContent + '\n');
        }
        console.log('\x1b[32m', 'Bundle created!\n');
    } catch (err) {
        console.log('\x1b[31m', 'Error: ', err.message);
    }
}

mergeStyles();
