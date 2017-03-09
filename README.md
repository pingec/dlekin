# dlekin
Parses gmail for bank account balance and generates a report to display on Kindle PW2

Tested on Windows and Linux

## Dependencies
The following dependecies must be preinstalled:
1. NodeJs
1. wkhtmltoimage (part of wkhtmltopdf) 
1. imagemagick (convert)

## Instructions
1. ```git clone https://github.com/pingec/dlekin.git && cd dlekin```
1. Create a config.js file in the root directory, see config.js.sample
1. ```npm install``` to install dependencies and tsc
1. ```npm run compile``` to compile ts /src to js in /bin
1. ```npm start``` to start /bin/main.js

If for any reason tsc fails during those steps you can also try using a globally installed tsc or VSCode for compilation (check the compile script inside package.json to see how it is called from npm or buildtsc task inside .vscode/tasks.json to see how vscode compiles it).
