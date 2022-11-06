const path = require('path');
const { mkdir, rm, readdir, copyFile } = require('node:fs/promises');
const { stdout } = require('process');

const dirName = 'files';

async function createDir(dir) {
    try {
        const inputDir = path.join(__dirname, dir);
        const outputDir = path.join(__dirname, `${dir}-copy`);

        await rm(outputDir, { recursive: true, force: true });
        await mkdir(outputDir, { recursive: true });
        stdout.write(`Directory ${dir}-copy created\n`);

        copyFiles(inputDir, outputDir);
    } catch (err) {
        console.log('\x1b[31m', 'Error: ', err.message);
    }
}

async function copyFiles(input, output) {
    try {
        const filesToCopy = await readdir(input, {withFileTypes: true});
        for (let item of filesToCopy) {
            if (item.isDirectory()) {
                await mkdir(path.join(output, item.name));
                stdout.write(`Directory ${item.name} created\n`);
                await copyFiles(path.join(input, item.name), path.join(output, item.name));
                stdout.write(`File ${item.name} created\n`);
            } else {
                await copyFile(path.join(input, item.name), path.join(output, item.name));
                stdout.write(`File ${item.name} created\n`);
            }
        }

    } catch (err) {
        console.log('\x1b[31m', 'Error: ', err.message);
    }
}

createDir(dirName);
