import apiSingleton from '../apiSingleton';
import { parseXML } from '../utils';
import config from '../../config';

const { invoices: invoicesApi } = apiSingleton;

const params = {
  apiKey: config.apiKey,
  accountKey: config.accountKey,
  detailed: true
};
const headers = {
  Accept: 'application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded'
};

export default async function loadInvoices() {
  const invoicesRes = await invoicesApi.list(params, headers, false);
  const resXML = await parseXML(invoicesRes);
  return resXML.Response.Invoices[0].Invoice;
}
