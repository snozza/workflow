import Base from './Base';

export default class InvoicesAPI extends Base {
  list(params, headers, json) {
    return this.apiClient.get('invoice.api/current/', {}, params, headers, json);
  }
}
