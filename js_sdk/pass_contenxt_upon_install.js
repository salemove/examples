// Client can choose how to pass the context from their backend to the frontend
var session_context = ...;

var installGlia = function(session_context, callback) {
  var gliaIntegrationScriptUrl = 
    `https://api.salemove.com/salemove_integration.js?session_context=${session_context}`;
  var scriptElement = document.createElement('script');
  scriptElement.async = 1;
  scriptElement.src = gliaIntegrationScriptUrl;
  scriptElement.type = 'text/javascript';
  if (typeof(callback) === 'function') {
    scriptElement.addEventListener('load', callback);
  }
  document.body.append(scriptElement);
};

installGlia(session_context, function(){
  sm.getApi({ version: 'v1' }).then(function (glia) {
    // Capture context
    var session_context = glia.getSessionContext();
    // Save the value of session_context using client's method of choice
  }
});