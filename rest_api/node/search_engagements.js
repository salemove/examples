#!/usr/bin/env node

// Browsers have `fetch` built-in.
import fetch from 'node-fetch';

const token = 'YOUR BEARER TOKEN';
const siteId = 'YOUR SITE ID';


const perPage = 50;
const startDate = '2023-01-01T00:00:00Z';
const endDate = '2023-02-01T00:00:00Z';
const body = {
  site_ids: [siteId],
  from_start_time: startDate,
  to_start_time: endDate

};

console.log('Searching engagements', body);

function searchEngagementsBatch(url, body) {
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    json: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())
}

function searchEngagements(url, body) {
  return searchEngagementsBatch(url, body)
    .then(response => {
      if (response['next_page']) {
        // Fetch next page
        console.log('Fetching next page')
        return searchEngagements(response['next_page'])
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
// 'https://api.salemove.com/engagements/search'
searchEngagements('https://api.brandon-autrey.dev.samo.io/engagements/search', body).then(engagements => console.log('Searched Engagements', engagements));
