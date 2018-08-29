#!/usr/bin/env node

'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var fs = require('fs');
var os = require('os');

const TODO_FILE_LOCATION = `${os.homedir()}/.todo-cli-db.txt`;

const COMMAND_ADD = 'add';
const COMMAND_LS = 'ls';
const COMMAND_CHECK = 'check';
const COMMAND_UNCHECK = 'uncheck';
const COMMAND_RM = 'rm';
const COMMAND_MV = 'mv';
const COMMAND_CLEAR = 'clear';

const STATUS_COMPLETE = 'c';
const STATUS_UNCOMPLETE = 'u';

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse example'
});

var subparsers = parser.addSubparsers({
  title: 'subcommands',
  dest: 'subcommand',
});

var bar = subparsers.addParser(COMMAND_ADD, { addHelp: true });
bar.addArgument(
  [ 'todoName' ],
  {
    action: 'store',
    help: 'foo3 bar3',
  }
);

let lsSubparser = subparsers.addParser(COMMAND_LS, { addHelp: true });

let rmSubparser = subparsers.addParser(COMMAND_RM, { addHelp: true });
rmSubparser.addArgument(
  ['todoIndex'],
  {
    type: 'int',
    help: 'remove todo at index'
  },
);

let checkSubparser = subparsers.addParser(COMMAND_CHECK, { addHelp: true });
checkSubparser.addArgument(
  ['todoIndex'],
  {
    type: 'int',
    help: 'check todo at index'
  },
);

let uncheckSubparser = subparsers.addParser(COMMAND_UNCHECK, { addHelp: true });
uncheckSubparser.addArgument(
  ['todoIndex'],
  {
    type: 'int',
    help: 'uncheck todo at index'
  },
);

let clearSubparser = subparsers.addParser(COMMAND_CLEAR, { addHelp: true });

let mvSubparser = subparsers.addParser(COMMAND_MV, { addHelp: true });
mvSubparser.addArgument(
  ['todoIndex'],
  {
    type: 'int',
    help: 'move todo at index to index'
  },
);
mvSubparser.addArgument(
  ['desiredTodoIndex'],
  {
    type: 'int',
    help: 'remove todo at index'
  },
);

const doesTodoFileExist = () => fs.existsSync(TODO_FILE_LOCATION);

const getTodosFromFile = () => fs.readFileSync(TODO_FILE_LOCATION, 'utf-8').split('\n').slice(0, -1);

const initializeTodoFile = () => fs.writeFileSync(TODO_FILE_LOCATION, '');

const addTodo = (todo) => {
  fs.appendFileSync(TODO_FILE_LOCATION, `${STATUS_UNCOMPLETE}${todo}\n`);
};

const changeTodoStatus = (todoIndex, isComplete) => {
  const newFileString = getTodosFromFile()
    .map((todo, index) => {
      if (index === todoIndex) return `${isComplete ? STATUS_COMPLETE: STATUS_UNCOMPLETE}${todo.slice(1)}`
      else return todo;
    })
    .join('\n')
    .concat('\n');
  fs.writeFileSync(TODO_FILE_LOCATION, newFileString);
}

const listTodos = () => {
  getTodosFromFile().forEach((todo, i) => {
    const todoStatus = todo[0];
    const todoName = todo.slice(1);
    const todoString = `${i} ${todoStatus === STATUS_COMPLETE ? '[x]' : '[ ]'} ${todoName}`;
    console.log(todoString);
  })
}

const deleteTodo = (todoIndex) => {
  const newFileString = getTodosFromFile().filter((elem, index) => index !== todoIndex).join('\n') + '\n';
  fs.writeFileSync(TODO_FILE_LOCATION, newFileString);
};

const moveTodo = (src, dest) => {
  let todos = getTodosFromFile();
  if (src < dest) {
    todos = [...todos.slice(0, src), ...todos.slice(src + 1, dest + 1), todos[src], ...todos.slice(dest + 1)];
  } else {
    todos = [...todos.slice(0, dest), todos[src], ...todos.slice(dest, src), ...todos.slice(src + 1)];
  }
  const newFileString = todos.join('\n') + '\n';
  fs.writeFileSync(TODO_FILE_LOCATION, newFileString);
}

const clearTodos = () => {
  fs.writeFileSync(TODO_FILE_LOCATION, '');
}

if (!doesTodoFileExist()) {
  initializeTodoFile();
}

var args = parser.parseArgs();

switch (args.subcommand) {
  case (COMMAND_LS):
    listTodos();
    break;
  case (COMMAND_ADD):
    addTodo(args.todoName);
    listTodos();
    break;
  case (COMMAND_RM):
    deleteTodo(args.todoIndex);
    listTodos();
    break;
  case (COMMAND_CHECK):
    changeTodoStatus(args.todoIndex, true);
    listTodos();
    break;
  case (COMMAND_UNCHECK):
    changeTodoStatus(args.todoIndex, false);
    listTodos();
    break;
  case (COMMAND_MV):
    moveTodo(args.todoIndex, args.desiredTodoIndex);
    listTodos();
    break;
  case (COMMAND_CLEAR):
    clearTodos();
    break;
}
