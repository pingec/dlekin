import mail = require("./mail");
import Imap = require('imap'); // so we can reference Imap types
import htmlToImage = require("./htmlToImage");
let config = require("../config");
let imapConfig: Imap.Config = config.imap;
import * as reporter from "./balanceReporter";
import * as Promise from "bluebird";
import * as moment from "moment";
moment.locale('sl');

import http = require("http");
import url = require("url");
import fs = require("fs");



http.createServer(function (req, res) {
  let request = url.parse(req.url, true);
  let action = request.pathname;

  if (action == '/' + config.grayscaleConvert.out) {

    generateAll((error, data) => {
      if(error) throw error;

      let imgName = data; // should be equal to config.grayscaleConvert.out
      let img = fs.readFileSync(imgName);
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(img, 'binary');
    });
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found \n');
  }
}).listen(8080, '127.0.0.1');



function generateAll(imageGenerated: (err: Error, data:string) => void) {

  mail.getMail(imapConfig, config.imapSearchFilter, (error, mails) => {
    let results = reporter.getBalances(mails);

    reporter.generateReport(results, config.htmlExport.out, () => {

      htmlToImage.generateImage(config.imageExport, config.grayscaleConvert, (error, data) => {
        imageGenerated(error, data);
      });
    });
  });
}


