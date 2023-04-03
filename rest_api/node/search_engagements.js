#!/usr/bin/env node

import fetch from 'node-fetch';

const token = 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImZmYWZiY2Q1LWRmNjktNDRiMC1iMmUxLTQyYTViNTM0N2JmNiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzYzODQxMjIsImlhdCI6MTY3NjM4MDUyMiwiaXNzIjoiU2FsZU1vdmUgT3BlcmF0b3IgQXV0aCIsInJvbGVzIjpbeyJ0eXBlIjoic2FsZW1vdmVfYWRtaW4ifSx7Im9wZXJhdG9yX2lkIjoiNDAyNjhkOGUtMDNjMC00YmRiLTk2ZjEtNzU0MzExYjU1YzEwIiwidHlwZSI6Im9wZXJhdG9yIn0seyJyb2xlIjoic2FsZW1vdmVfYWRtaW4iLCJzaXRlX2lkIjoiNjQzNmVkMTgtZWJjZC00OGM3LWEyNzgtNjMyNTFmNTUzNjhhIiwidHlwZSI6InNpdGVfb3BlcmF0b3IifV0sInN1YiI6Im9wZXJhdG9yOjQwMjY4ZDhlLTAzYzAtNGJkYi05NmYxLTc1NDMxMWI1NWMxMCJ9.QDdSzE7fl5LQvj7K8VyCdCLFGpKgH3wJa7jInZm9X9MRlOoD8vfzcQL77kTDf48XLxB-xRy1dUdQ_rlLmporNw';
const siteId = '6436ed18-ebcd-48c7-a278-63251f55368a';

const perPage = 2;
const startDate = '2022-01-01T00:00:00Z';
const endDate = '2023-02-14T00:00:00Z';
const body = {
  site_ids: [siteId],
  from_start_time: startDate,
  to_start_time: endDate,
  per_page: perPage
};

console.log('Searching engagements', body);

function searchEngagementsBatch(url, body) {
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    json: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json'
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
searchEngagementsBatch('https://api.brandon-autrey.dev.samo.io/engagements/search', body)
  .then(engagements => console.log('Searched Engagements', engagements));
