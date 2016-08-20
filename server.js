require('dotenv').load({ silent: true });

const Express = require('express');
const fetch = require('node-fetch');
const co = require('co');
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const compression = require('compression');
const json2csv = require('json2csv');
const { parseString } = require('xml2js');
const config = require('./config');
const app = new Express();

const options = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function parseXML(rawText) {
  return new Promise((resolve, reject) => {
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
  const url = '/job.api/current/';
  const query = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}&detailed=true`;
  const response = yield fetch(config.workflowHost + url + query, options);
  const rawText = yield response.text();
  const resXML = yield parseXML(rawText);
  return resXML.Response.Jobs[0].Job;
}

function* getInvoices() {
  const url = '/invoice.api/current/';
  const query = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}&detailed=true`;
  const response = yield fetch(config.workflowHost + url + query, options);
  const rawText = yield response.text();
  const resXML = yield parseXML(rawText);
  return resXML.Response.Invoices[0].Invoice;
}

function* getCostsByJob(jobId) {
  const url = `/job.api/costs/${jobId}`;
  const query = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}&detailed=true`;
  const response = yield fetch(config.workflowHost + url + query, options);
  const rawText = yield response.text();
  const resXML = yield parseXML(rawText);
  return resXML.Response.Costs[0];
}

app.set('views', path.join(__dirname, './views'));
app.engine('.hbs', handlebars({
  defaultLayout: path.join(__dirname, './views/layouts/main'),
  extname: '.hbs',
  partialsDir: path.join(__dirname, './views/partials'),
}));
app.set('view engine', '.hbs');

app.use(compression());
app.use(bodyParser.json());
app.use(Express.static('dist'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/jobs', (req, res) => {
  const csvRows = [];
  co(function* () {
    const jobs = yield getJobs();
    const invoices = yield getInvoices();
    if (jobs) {
      yield jobs.map(function* (job) {
        const row = {
          Name: job.Name[0],
          Invoiced: 0,
          'Actual Costs': 0,
          Profit: 0
        };
        const costs = yield getCostsByJob(job.ID[0]);
        if (costs) {
          costs.Cost.forEach(cost => {
            row['Actual Costs'] += Number(cost.Quantity) * Number(cost.UnitCost);
          });
          const jobInvoice = invoices.find(invoice => invoice.JobText[0] === job.ID[0]);
          if (jobInvoice) {
            row.Invoiced = Number(jobInvoice.AmountIncludingTax);
          }
          row.Profit = row.Invoiced - row['Actual Costs'];
        }
        csvRows.push(row);
      });
      const csvOutput = json2csv({ data: csvRows });
      res.attachment('totals.csv');
      return res.send(csvOutput);
    }
    return res.send('OK');
  }).catch(err => {
    console.log(err);
    return res.sendStatus(500);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server is listening');
});
