// Reference: https://developer.glia.com/docs/engagements/engagements#get-engagement
// Reference: https://nodejs.org/en/download/
// Reference: https://www.npmjs.com/package/wget-improved

// Running the code snippet below allows to download multiple Glia audio recording urls per engagementId
// PS. One engagement can have multiple audio recordings so all of them will be included in the results

// JavaScript Node.js run-time environment needs to be set up first in order to run the code snippet
// wget-improved package needs to be installed to retrieve file from URL
// The required parameters that needs to be configured are the list of engagementIds and personal API token

const wget = require('wget-improved');
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
        var sourceURL = `${s3Url.url}`;

        // Regex to capture the file name from the audio recording URL
        var outputFile = (`${s3Url.url}`).match(/[/]([^?]*)[?].*$/)[1].substring((`${s3Url.url}`).match(/[/]([^?]*)[?].*$/)[1].lastIndexOf('/') + 1);
        console.log('');
        console.log('Downloaded recording file is: ' + outputFile);
        console.log('');

        // Downloading the audio recording URL as an audio file to local storage
        wget.download(sourceURL, outputFile);
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
