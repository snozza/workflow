import apiSingleton from '../apiSingleton';
import { parseXML } from '../utils';
import config from '../../config';

const { jobs: jobsApi } = apiSingleton;

const params = {
  apiKey: config.apiKey,
  accountKey: config.accountKey,
  detailed: true
};
const headers = {
  Accept: 'application/x-www-form-urlencoded',
  'Content-Type': 'application/x-www-form-urlencoded'
};

export default async function loadJobs() {
  const jobsRes = await jobsApi.list(params, headers, false);
  const resXML = await parseXML(jobsRes);
  return resXML.Response.Jobs[0].Job;
}
