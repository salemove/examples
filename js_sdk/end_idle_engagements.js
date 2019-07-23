// Reference:
// https://js-sdk-docs.salemove.com/class/Engagement.html
// Running the code snippet below before starting an engagement
// allows to track Visitor activity to end the ongoing engagement
// when Visitor has been idle (no mouse or keyboard event recorded)
// for some given amount of time

sm.getApi({version: 'v1'}).then(function(salemove) {
  var onEngagementStarted = function(engagement) {
    var idleTime = 0;
    var timerIncrement = function() {
      idleTime = idleTime + 1;
      if (idleTime >= 29) {
        engagement.end();
      }
    }
    var idleInterval = setInterval(timerIncrement, 1000);
    window.onmousemove = function(e) {
      idleTime = 0;
    };
    window.onmousedown = function(e) {
      idleTime = 0;
    };
    window.ontouchstart = function(e) {
      idleTime = 0;
    };
    window.onclick = function(e) {
      idleTime = 0;
    };
    window.onkeypress = function(e) {
      idleTime = 0;
    };
    salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_END, function() {
      clearInterval(idleInterval);
    });
  }
  salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_START, onEngagementStarted);
});
