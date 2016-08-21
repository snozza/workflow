import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

export default class ApiClient {
  constructor({ prefix = 'api/v1' } = {}) {
    this.prefix = prefix;
  }

  get(requestUrl, payload = {}, params = {}, headers, json = true) {
    return this.request({
      url: requestUrl,
      method: 'get',
      body: payload,
      headers,
      json,
      params
    });
  }

  put(requestUrl, payload = {}, headers, json = true) {
    return this.request({
      url: requestUrl,
      method: 'put',
      headers,
      json,
      body: payload
    });
  }

  patch(requestUrl, payload = {}, headers, json = true) {
    return this.request({
      url: requestUrl,
      method: 'put',
      headers,
      json,
      body: payload
    });
  }

  post(requestUrl, payload = {}, headers, json = true) {
    return this.request({
      url: requestUrl,
      method: 'post',
      headers,
      json,
      body: payload
    });
  }

  delete(requestUrl, headers, json = true) {
    return this.request({
      url: requestUrl,
      method: 'delete',
      json,
      headers
    });
  }

  async request({ url, method, params = {}, headers, body, json }) {
    const urlWithQuery = `${url}?${queryString.stringify(params)}`;
    const init = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    if (headers) {
      init.headers = { ...init.headers, headers };
    }

    if (method !== 'get' && method !== 'head' && method !== 'delete') {
      init.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.prefix}/${urlWithQuery}`, init);
    if (!response.ok) {
      throw new Error('Bad response from server');
    }
    if (json) {
      return await response.json();
    }
    return await response.text();
  }
}
