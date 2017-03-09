import * as fs from "fs";
import * as moment from "moment";
import cheerio = require('cheerio');



function formatDayDate(momentToFormat: moment.Moment) {
  let date = momentToFormat.format("LLLL");
  let day = date.split(",")[0];
  date = date.replace(day, day.toUpperCase());
  let dateSplit = date.split(" ");
  dateSplit.pop(); //get rid of time
  date = dateSplit.join(" ");
  return date;
}

function generateBalanceRowsHtml(results: AccountBalanceReport[]) {
  let htmlChunk = "";
  let counter = 1;

  for (let balance of results) {
    let row = `
              <tr>
                <th scope="row">${counter++}</th>
                <td>${balance.date.format('DD.MM.YYYY')}</td>
                <td>${balance.balance} €</td>
                <td>${balance.available} €</td>
              </tr>`;

    htmlChunk += row;
  }
  return htmlChunk;
}

export function generateReport(results: AccountBalanceReport[], outPath : string) {

  fs.readFile("template.html", 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    let $ = cheerio.load(data);

    // set date in main header
    let header = $(".header-date");
    header.text(formatDayDate(moment()));

    // set battery status //TODO
    let batteryStatus = $(".battery-status");
    batteryStatus.empty();
    batteryStatus.append('<i class="fa fa-battery-full fa-2x"></i>');

    // set current account balance
    let accountBalance = $(".account-balance");
    accountBalance.empty();
    accountBalance.text(results[0].balance + " €");

    // set account balance history generateBalanceRowsHtml
    // kindle PW2 has space for 13 rows at maximum
    results = results.slice(0, 12);
    let rows = generateBalanceRowsHtml(results);
    let tbody = $(".account-balance-history");
    tbody.empty();
    tbody.append(rows);

    // set timestamp in footer
    let footerTimestamp = $(".footer-timestamp");
    footerTimestamp.empty();
    footerTimestamp.text(`Generirano: ${moment().format("D/M/YYYY H:m")}`);

    fs.writeFile("generated.html", $.html(), 'utf8', function (err) {
      if (err) throw err;
    });
  });

}

function getBalance(mails: any[]) {
  let balances = getBalances(mails);
  if (!balances.length) throw "account balance not found";

  let result = balances[0];
  for (let balance of balances)
    if (balance.date.isAfter(result.date))
      result = balance;

  return result;
}

interface AccountBalanceReport {
  date: moment.Moment,
  balance: string,
  account: string,
  product: string,
  overdraft: string,
  reserved: string,
  available: string
}

export function getBalances(mails: any[]) {

  let results: AccountBalanceReport[] = [];

  for (let mail of mails) {
    if (mail.html) {
      let $ = cheerio.load(mail.html);
      /*
      <p style="margin:5px 0 20px;">
      Dne 13.01.2017 je stanje na računih:
      </p>
      <strong>Št.računa: </strong>10100-00272121149    <br>
      <strong>Produkt: </strong>TRR e-račun                                       <br>
      <strong>Stanje: </strong>           1.532,62&nbsp;      EUR<br>
      <strong>Prekoračitev: </strong>               0,00<br>
      <strong>Rezervacije: </strong>              31,49<br>
      <strong>Razpoložljivo stanje: </strong>           1.501,13<br>
      <br>
      */

      let balanceNode = $("strong:contains('Stanje:')");
      if (balanceNode.length) {
        let balanceText = balanceNode[0].nextSibling.nodeValue;
        let balance = balanceText.replace("EUR", "").trim();

        let dateText = $("p:contains('stanje na računih')").text();
        dateText = /(\d\d)\.(\d\d)\.(\d\d\d\d)/.exec(dateText)[0];
        let date = moment(dateText, 'DD.MM.YYYY');

        let account = $("strong:contains('Št.računa:')")[0].nextSibling.nodeValue.trim();
        let product = $("strong:contains('Produkt:')")[0].nextSibling.nodeValue.trim();
        let overdraft = $("strong:contains('Prekoračitev:')")[0].nextSibling.nodeValue.trim();
        let reserved = $("strong:contains('Rezervacije:')")[0].nextSibling.nodeValue.trim();
        let available = $("strong:contains('Razpoložljivo stanje:')")[0].nextSibling.nodeValue.trim();

        results.push({
          date: date,
          balance: balance,
          account: account,
          product: product,
          overdraft: overdraft,
          reserved: reserved,
          available: available
        });
      }
    }
  }
  results.sort((a, b) => b.date.diff(a.date));
  return results;
}



