const crypto = require('crypto');
const chalk = require('chalk');
const fs = require('fs');
const fstream = require('fstream');
const targz = require('tar.gz');
const zlib = require('zlib');
const path = require('path');

function encrypt(file, password) {
    if (!fs.existsSync(file)) {
        throw "O aquivo nao existe.";
    }
    const status = fs.statSync(file);
    let input = status.isDirectory()
    ? targz().createReadStream(file)
    : fs.createReadStream(file);

    const cipher = crypto.createCipher('aes-256-cbc', password);
    const output = fs.createWriteStream(file + '.enc');

    input.pipe(cipher).pipe(output);
    output.on('finish', () => {
        console.log(chalk.green('O arquivo foi encriptado com sucesso!'));
    });
}

function decrypt(file, password) {
    if (!fs.existsSync(file)) {
        throw "O aquivo nao existe.";
    }
    const rpF = file.replace(/\.enc$/, '');
    const cipher = crypto.createDecipher('aes-256-cbc', password);
    let input = fs.createReadStream(file);
    const output = path.extname(rpF) === '' ? targz().createWriteStream(path.dirname(rpF)) : fs.createWriteStream(rpF);
    
    input.pipe(cipher).pipe(output);
    output.on('finish', () => {
        console.log(chalk.green('O arquivo foi decriptado com sucesso!'));
    });
}

module.exports = { encrypt, decrypt };