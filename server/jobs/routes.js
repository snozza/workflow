import { Router } from 'express';
import loadJobs from './loadJobs';
import loadCostsByJob from './loadCostsByJob';
import { loadInvoices } from '../invoices';
import json2csv from 'json2csv';

const router = Router();

async function constructJobData(req, res) {
  const csvRows = [];
  const jobs = await loadJobs();
  const invoices = await loadInvoices();
  if (jobs) {
    await jobs.map(async (job) => {
      const row = {
        Name: job.Name[0],
        Invoiced: 0,
        'Actual Costs': 0,
        Profit: 0
      };
      const costs = await loadCostsByJob(job.ID[0]);
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
      return csvRows.push(row);
    });
  }
  const csvOutput = json2csv({ data: csvRows });
  res.attachment('totals.csv');
  return res.send(csvOutput);
}

router.route('/jobs')
  .get(constructJobData);

export default router;
