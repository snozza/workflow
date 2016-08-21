import ApiClient from './ApiClient';
import JobsAPI from './Jobs';
import InvoicesAPI from './Invoices';

export default function ({ apiPrefix } = {}) {
  if (!apiPrefix) {
    throw new Error('[apiPrefix] required');
  }

  const api = new ApiClient({ prefix: apiPrefix });

  return {
    apiClient: api,
    jobs: new JobsAPI({ apiClient: api }),
    invoices: new InvoicesAPI({ apiClient: api })
  };
}

