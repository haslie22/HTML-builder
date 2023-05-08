const path = require('path');
const { mkdir, rm, readdir, readFile, writeFile, copyFile } = require('node:fs/promises');
const { createWriteStream } = require('fs');
const { stdout } = require('process');

const settings = {
  dirName: 'project-dist',
  dirPath: path.join(__dirname, 'project-dist'),

  sourceTemplateFile: 'template.html',
  sourceComponentsDir: 'components',
  sourceCSSDir: 'styles',
  assetsDir: 'assets',

  outputHTMLFile: 'index.html',
  outputCSSFile: 'style.css',

  stylesExtension: '.css',
  htmlExtension: '.html',
  charset: 'utf-8',
};

function filterAppropriateFiles(files) {
  return files.filter(file => file.isFile() && path.extname(file.name) === '.css');
}

async function createDir(inputDir, outputDir, dir) {
  try {
    await rm(outputDir, { recursive: true, force: true });
    await mkdir(outputDir, { recursive: true });
    stdout.write(`Directory ${dir} created\n`);

    copyFiles(inputDir, outputDir);
  } catch (err) {
    console.log('\x1b[31m', 'Error from createDir: ', err.message);
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
    console.log('\x1b[31m', 'Error from copyFiles: ', err.message);
  }
}

async function createHTML(templateFile, componentsDir) {
  try {
    const template = await readFile(path.join(__dirname, templateFile));
    const templateReadable = template.toString();
    const componentTemplates = templateReadable.match(/{{([^}]+)}}/gi);
    let replacedHTML = templateReadable;

    if (componentTemplates) {
      for (let item of componentTemplates) {
        const fileName = `${item.replace(/{{([^}]+)}}/gi, '$1')}${settings.htmlExtension}`;
        const fileContent = await readFile(path.join(__dirname, componentsDir, fileName));

        replacedHTML = replacedHTML.replace(item, fileContent.toString());
      }

      writeFile(path.join(settings.dirPath, settings.outputHTMLFile), replacedHTML);
      stdout.write(`File ${settings.outputHTMLFile} in ${settings.dirName} created\n`);
    }
  } catch (err) {
    console.log('\x1b[31m', 'Error from createHTML: ', err.message);
  }
}

async function createCSS() {
  try {
    const writeStream = createWriteStream(path.join(settings.dirPath, settings.outputCSSFile), settings.charset);
    const allFiles = await readdir(path.join(__dirname, settings.sourceCSSDir), { withFileTypes: true });
    const selectedFiles = filterAppropriateFiles(allFiles);

    for (let file of selectedFiles) {
      const fileContent = await readFile(path.join(path.join(__dirname, settings.sourceCSSDir), file.name), settings.charset);
      writeStream.write(fileContent + '\n');
    }

    stdout.write(`File ${settings.outputCSSFile} created\n`);
  } catch (err) {
    console.log('\x1b[31m', 'Error from createCSS: ', err.message);
  }
}

async function createProject() {
  try{
    await rm(settings.dirPath, { force: true, recursive: true });
    await mkdir(settings.dirPath, { recursive: true });

    await createDir(path.join(__dirname, settings.assetsDir), path.join(settings.dirPath, settings.assetsDir), settings.assetsDir);
    await createHTML(settings.sourceTemplateFile, settings.sourceComponentsDir, settings.dirPath);
    await createCSS();
  } catch (err) {
    console.log('\x1b[31m', 'Error from createProject: ', err.message);
  }
}

createProject();