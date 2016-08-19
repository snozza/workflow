require('dotenv').load({ silent: true });

const Express = require('express');
const fetch = require('node-fetch');
const co = require('co');
const { parseString } = require('xml2js');
const config = require('./config');
const app = new Express();

const options = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function parseXML(rawText) {
  return textPromise = new Promise((resolve, reject) => {
    parseString(rawText, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function* getJobs() {
  const path = '/job.api/current';
  const query = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}`;
  const response = yield fetch(config.workflowHost + path + query, options);
  const rawText = yield response.text();
  const resXML = yield parseXML(rawText);
  return resXML.Response.Jobs[0].Job;
}

function* getInvoices() {
  const path = `/invoice.api/current/`
  const query = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}&detailed=true`;
  const response = yield fetch(config.workflowHost + path + query, options);
  const rawText = yield response.text();
  const resXML = yield parseXML(rawText);
  return resXML.Response.Invoices[0].Invoice;
}

app.get('/', (req, res) => {
  const csvRows = [];
  co(function* () {
    const invoices = yield getInvoices();
    if (invoices) {
      yield invoices.map(invoice => {
        const job = invoice.Jobs[0].Job[0]; 
        let actualCosts = 0; 
        job.Costs[0].Cost.map(cost => {
          actualCosts += Number(cost.AmountIncludingTax[0]); 
        });
        const invoicedAmount = Number(invoice.AmountIncludingTax[0]); 
        const profit = invoicedAmount - actualCosts;
        const row = { 
          'Name': job.Name[0],
          'Invoiced': invoicedAmount,
          'Actual Costs': actualCosts,
          Profit: profit
        };
        csvRows.push(row);
      });
      console.log(csvRows);
    }
        
    res.send('OK');
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server is listening');
});
