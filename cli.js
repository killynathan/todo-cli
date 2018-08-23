#!/usr/bin/env node

'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var fs = require('fs');

const TODO_FILE_LOCATION = './todo.txt';

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Argparse example'
});
// parser.addArgument(
//   [ 'add' ],
//   {
//     help: 'list all todos'
//   }
// );
// parser.addArgument(
//   [ 'add' ],
//   {
//     help: 'add [your todo here]'
//   }
// )
var args = parser.parseArgs();

const doesTodoFileExist = () => fs.existsSync(TODO_FILE_LOCATION);

const initializeTodoFile = () => fs.writeFileSync(TODO_FILE_LOCATION, '');

const addTodo = (todo) => {
  fs.appendFileSync(TODO_FILE_LOCATION, `${todo}\n`);
};

const listTodos = () => {
  const fileString = fs.readFileSync(TODO_FILE_LOCATION, 'utf-8');
  const fileArray = fileString.split('\n');
  fileArray.forEach((line, i) => {
    console.log(`${i} ${line}`)
  })
}
if (!doesTodoFileExist()) {
  initializeTodoFile();
}
// addTodo('random');

listTodos();

// console.dir(args);
