import mail = require("./mail");
import Imap = require('imap'); // so we can reference Imap types
import htmlToImage = require("./htmlToImage");
let config = require("../config");
let imapConfig: Imap.Config = config.imap;
import * as reporter from "./balanceReporter";
import * as moment from "moment";
moment.locale('sl');


mail.getMail(imapConfig, (mails) => {
  let results = reporter.getBalances(mails);
  reporter.generateReport(results, config.imageExport.in);
  htmlToImage.generateImage(config.imageExport);
}, config.imapSearchFilter);




