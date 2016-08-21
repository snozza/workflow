import { Router } from 'express';
import loadJobs from './loadJobs';
import loadCostsByJob from './loadCostsByJob';
import { loadInvoices } from '../invoices';
import json2csv from 'json2csv';

const router = Router();

async function addJobCosts(job, row) {
  const costs = await loadCostsByJob(job.ID[0]);
  if (costs) {
    costs.Cost.forEach(cost => {
      row['Actual Costs'] += Number(cost.Quantity) * Number(cost.UnitCost);
    });
  }
  return;
}

function addJobInvoices(job, invoices, row) {
  const jobInvoice = invoices.find(invoice => invoice.JobText[0] === job.ID[0]);
  if (jobInvoice) {
    row.Invoiced = Number(jobInvoice.AmountIncludingTax);
  }
  return;
}

async function constructJobData(req, res) {
  const csvRows = [];
  try {
    const jobs = await loadJobs();
    const invoices = await loadInvoices();
    if (jobs) {
      for (const job of jobs) {
        const row = {
          Name: job.Name[0],
          Invoiced: 0,
          'Actual Costs': 0,
          Profit: 0
        };

        await addJobCosts(job, row);
        addJobInvoices(job, invoices, row);
        row.Profit = row.Invoiced - row['Actual Costs'];
        csvRows.push(row);
      }
    }
    const csvOutput = csvRows.length ? json2csv({ data: csvRows }) : '';
    res.attachment('totals.csv');
    return res.send(csvOutput);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error');
  }
}

router.route('/jobs')
  .get(constructJobData);

export default router;
