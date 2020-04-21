#!/usr/bin/env node

// Browsers have `fetch` built-in.
const fetch = require('node-fetch');

const token = 'YOUR BEARER TOKEN';
const siteId = 'YOUR SITE ID';

const perPage = 50;
const startDate = '2020-04-01T00:00:00Z';
const endDate = '2020-05-01T00:00:00Z';

console.log('Fetching engagements', {perPage, startDate, endDate});

function fetchEngagementsBatch(url) {
  return fetch(url, {
    method: 'get',
    json: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())
}

function fetchEngagements(url) {
  return fetchEngagementsBatch(url)
    .then(response => {
      if (response['next_page']) {
        // Fetch next page
        console.log('Fetching next page')
        return fetchEngagements(response['next_page'])
          .then(engagements => {
            // Merge current engagements and engagements from the next pages
            return Promise.resolve(response['engagements'].concat(engagements))
          });
      } else {
        console.log('No next_page, stopping.')
        return Promise.resolve(response['engagements']);
      }
    });
}

fetchEngagements(`https://api.salemove.com/engagements?per_page=${perPage}&start_date=${startDate}&end_date=${endDate}&site_ids[]=${siteId}`)
  .then(engagements => console.log('Fetched Engagements', engagements));
