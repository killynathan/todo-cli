## installation
requires Node.js 3.2+ 
```
$ npm i -g mytodos
```

## usage
```
todo -h                      Lists the available commands
todo add "Go shopping"       Create a new todo item
todo ls                      Print all pending todo items
todo check 1                 Mark #1 as completed
todo mv 1 42                 Change the id of given todo
todo uncheck 1               Revert #1 to pending
todo rm 1                    Remove #1 item
todo clear                   Destroy all todo items
```

## todos
1. add todo to speficied index
2. running todo by itself prints todos
3. @tags
4. ls --done
5. clear --done
6. specifiy db path
7. multi list
8. flow type
9. add tests