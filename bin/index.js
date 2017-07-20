#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const prompt = inquirer.createPromptModule();
const path = require('path');
const actions = require('../lib');
const version = require('../package.json').version;

console.log(chalk.cyan(`Datacrypt v${version}`));

prompt([{
    type: 'list',
    name: 'acao',
    message: 'O que vc quer fazer?',
    choices: [
        {
            name: 'criptografar',
            value: 'encrypt'
        },
        {
            name: 'descriptografar',
            value: 'decrypt'
        }
    ]
},
{
    type: 'input',
    name: 'file',
    message: 'Caminho do o arquivo'
},
{
    type: 'password',
    name: 'pass',
    message: 'Senha',
    mask: '*'
}
]).then(({acao, file, pass})=>{
    file = path.resolve(process.cwd(), file);
    actions[acao].call(null, file, pass);
}).catch((err)=>{
    console.log(chalk.red.inverse('error'), chalk.red(err));
});

process.on('uncaughtException', (err)=>{
    if(/06065064/.test(err)){
        console.log(chalk.red.inverse('Error'), chalk.red('Deu pau na senha!'));
    }else{
        console.log(chalk.red.inverse('Error'), chalk.red(err));
    }
    process.exit(1);
});