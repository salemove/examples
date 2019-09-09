// Reference: https://developer.glia.com/docs/engagements/engagements#get-engagement
// Reference: https://nodejs.org/en/download/

// Running the code snippet below allows to download multiple Glia audio recording urls per engagementId
// PS. One engagement can have multiple audio recordings so all of them will be included in the results

// JavaScript Node.js run-time environment needs to be set up first in order to run the code snippet
// The required parameters that needs to be configured are the list of engagementIds and personal API token

const request = require('request');
const rp = require('request-promise');
const numeral = require('numeral');

'use strict';

const token = '$personalAPIToken';
const endpoint = 'https://api.salemove.com';
const exampleEngagementIds = ['$firstEngagementId',
  '$secondEngagementId'
];
var i = 0;

function getURLs() {
  engagementId = exampleEngagementIds[i];

  getEngagement = (engagementId) => {
    const options = {
      url: `${endpoint}/engagements/` + engagementId,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.salemove.v1+json'
      },
      method: 'GET',
      json: true
    };
    return rp(options);
  };

  const getRecordingS3Url = (url) => {
    const options = {
      url: url,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.salemove.v1+json'
      },
      method: 'GET',
      json: true
    };
    return rp(options);
  };

  const getRecordings = (engagement) => {
    const recordin_urls = engagement['audio_recording_urls'];
    const promises = recordin_urls.map(getRecordingS3Url);
    return Promise.all(promises);
  };

  getEngagement(engagementId)
    .then(getRecordings)
    .then((s3Urls) => {
      console.log('');
      console.log('Engagement ID: ' + engagementId + ' recording urls are:');
      console.log('====================================================================================================\n');
      s3Urls.map((s3Url) => {
        console.log(`${s3Url.url}\n`);
      });
    });

  if (i < (exampleEngagementIds.length - 1)) {
    i++;
  } else {
    clearInterval(x);
    return false;
  }
}

var x = setInterval(getURLs, 2000);
