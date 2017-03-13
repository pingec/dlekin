// let Imap = require('imap');
// let MailParser = require("mailparser").MailParser;
import Imap = require('imap');
import { MailParser } from "mailparser";
import Promise = require("bluebird");
const simpleParser = Promise.promisify<any, string>(require('mailparser').simpleParser); //typings missing




export function getMail(imapConfig: Imap.Config, searchFilter: any[] = ['ALL'], mailFetched: (err:Error, mails: any[]) => void, ) {

  let imap = new Imap(imapConfig);

  imap.once("ready", execute);
  imap.once("error", function (err) {
    console.log("Connection error: " + err.stack);
  });
  imap.connect();

  function execute() {

    let parsedMails: Promise<any>[] = [];

    imap.openBox("INBOX", true, function (error, mailbox) {
      if (error) throw error;
      imap.search(['ALL', searchFilter], function (err, results) { //example of searchFilter: ['FROM', 'matej.drolc@pingec.si']
        let fetch = imap.fetch(results, { bodies: "" });
        fetch.on("message", processMessage);
        fetch.once("error", function (err) {
          throw error;
        });
        fetch.once("end", function () {
          // all mails are fetched (pasedMails is populated) but not necessarily parsed by now
          imap.end();
          Promise.map(parsedMails, (item) => item).then((values) => {
            // all mails are parsed now, unwrap promises and return values via cb
            mailFetched(error, values);
          });
        });
      });
    });

    function processMessage(msg: Imap.ImapMessage, seqNo: number) {
      msg.on("body", function (stream) {
        var buffer = '';
        stream.on('data', function (chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function () {
          let bla = buffer;
          let promise = simpleParser(buffer);
          parsedMails.push(promise);
        });
      });
    }
  }
}


