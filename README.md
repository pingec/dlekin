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

## Notes

Useful with imap problems: http://stackoverflow.com/questions/20337040/gmail-smtp-debug-error-please-log-in-via-your-web-browser

Headless debian Jessie requires:
Node v6.x (7 is problematic)
xvfb-run -- /usr/local/bin/wkhtmltoimage --zoom 1.5 --height 1024 --width 758 --quality 100 --disable-smart-width generated.html page.jpg

### Poor reverse proxy (php)


```php
<?php
    $url = 'http://127.0.0.1:8080/' . $_GET['file_name'];
    header('Content-type: image/png');
    imagepng(imagecreatefrompng($url));
?>
```

Access through ```http://path/to/script?file_name=bg_medium_ss00.png``` which will fetch from ```http://127.0.0.1:8080/bg_medium_ss00.png```