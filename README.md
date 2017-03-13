# dlekin

**This is a working prototype, code is unpolished. Some parts are very specific to my needs but should be easy to replace.**

## Description

[![Screenshot 2](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_49+0100_320.png)](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_49+0100.png)
[![Screenshot 1](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_43+0100_320.png)](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_43+0100.png)

[![Screenshot 3](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T21_37_23+0100_320.png)](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T21_37_23+0100.png)
[![Photo of kindle with dlekin running](https://raw.githubusercontent.com/pingec/dlekin/master/demo/IMG_20170314_005141_320.jpg)](https://raw.githubusercontent.com/pingec/dlekin/master/demo/IMG_20170314_005141.jpg)



Kindle makes the perfect device as dashboard or report viewer with great battery autonomy. Because of its e-ink display it uses no energy to keep the information on the screen.

This solution repurposes a kindle (PW2 in my case) as a bank account balance monitor. My grandfather has problems with menus and buttons and cables. This solution has none of those.

There are two componenets:
* a server-side nodejs solution 
* a client-side kindle script (installable as a kual extension)

The kindle wakes up on configurable intervals, uses the wifi to request a new image from the server, displays it as screensaver and goes back to sleep. With refresh interval set to every 6 hours I expect the battery to last about a month.

## dlekin-server

### What the server component does
1. Listens for http requests on http://127.0.0.1:8080/{someimage}.png
1. Connects to gmail imap
1. Fetches banking emails
1. Parses out information
1. Produces a report as a html page
1. Uses wkhtmltoimage to render the html to an image
1. Uses imagemagick to convert the image to a kindle-compatible format
1. Serves back {someimage}.png


Tested on Windows 10 and Debian Jessie

### Dependencies
The following dependecies must be preinstalled:

1. NodeJs
1. wkhtmltoimage (part of wkhtmltopdf) 
1. imagemagick (convert)

### Instructions
1. ```git clone https://github.com/pingec/dlekin.git && cd dlekin/server```
1. Create a **config.js** file in the root directory, see config.js.sample
1. ```npm install``` to install dependencies and tsc
1. ```npm run compile``` to compile ts /src to js in /bin
1. ```npm start``` to start /bin/main.js

If for any reason tsc fails during those steps you can also try using a globally installed tsc or VSCode for compilation (check the compile script inside package.json to see how it is called from npm or buildtsc task inside .vscode/tasks.json to see how vscode compiles it).

### Notes

Useful with imap problems: http://stackoverflow.com/questions/20337040/gmail-smtp-debug-error-please-log-in-via-your-web-browser

Headless debian Jessie requires:
Node v6.x (7 is problematic)
xvfb-run -- /usr/local/bin/wkhtmltoimage --zoom 1.5 --height 1024 --width 758 --quality 100 --disable-smart-width generated.html page.jpg

#### A poor reverse proxy (php)

```php
<?php
    $url = 'http://127.0.0.1:8080/' . $_GET['file_name'];
    header("Content-type: image/png");
    $homepage = file_get_contents($url);
    echo $homepage;
?>
```

Access through ```http://path/to/script?file_name=bg_medium_ss00.png``` which will fetch from ```http://127.0.0.1:8080/bg_medium_ss00.png```

## dlekin-client (kindle script)

### Dependencies
1. jailbroken kindle with ssh access (tested with PW2)
1. kual 2.x launcher

### Instructions
1. ```git clone https://github.com/pingec/dlekin.git && cd dlekin```
1. Copy the contents of /kindle/dlekin/* to /mnt/us/ on kindle
1. Empty /usr/share/blanket/screensaver/*
1. You can now use the kual launcher to start/stop dlekin

[![dlekin kual menu](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_57+0100_320.png)](https://raw.githubusercontent.com/pingec/dlekin/master/demo/screenshot_2017_03_13T23_11_57+0100.png)

#### Uninstall
1. Stop dlekin from kual launcher
1. Remove /mnt/us/dlekin and /mnt/us/extensions/dlekin

### What it does

1. Wakes up the kindle
1. Wget image from server
1. Set it as new screensaver
1. Go sleep for some period of time
1. Repeat

## todo
- make battery status work
- implement low battery warning

## Credits
My script is based on peterson's examples from https://www.mobileread.com/forums/showthread.php?p=2789335