import { jobs as jobsApi } from '../apiSingleton';
import { parseXML } from '../utils';
import config from '../../config';

const params = `?apiKey=${config.apiKey}&accountKey=${config.accountKey}&detailed=true`;
const headers = {
  Accept: 'application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded'
};

export default async function loadCostsByJob(id) {
  const costsRes = await jobsApi.showCosts(id, params, headers, false);
  const resXML = await parseXML(costsRes);
  return resXML.Response.Costs[0];
}
