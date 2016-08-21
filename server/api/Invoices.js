import Base from './Base';

export default class InvoicesAPI extends Base {
  list(params) {
    return this.apiClient.get('invoice.api/current/', {}, params);
  }
}
