// Reference:
// https://js-sdk-docs.salemove.com/class/Engagement.html
// Running the code snippet below before starting an engagement
// allows to call out engagement object properties (e.g. ID, type, startingMedia)
// and methods (e.g. end, upgrade) during the engagement

// Examples: engagement.engagementId; engagement.end();

var engagement;

sm.getApi({version: 'v1'}).then(function(salemove) {
  var onEngagementStarted = function(eng) {
    engagement = eng;
  }
  salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_START, onEngagementStarted);
});
