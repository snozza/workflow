import Base from './Base';

export default class JobsAPI extends Base {
  list(params, headers, json) {
    return this.apiClient.get('job.api/current/', {}, params, headers, json);
  }

  showCosts(id, params, headers, json) {
    return this.apiClient.get(`job.api/costs/${id}`, {}, params, headers, json);
  }
}
