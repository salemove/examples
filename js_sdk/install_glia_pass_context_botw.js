// Client can choose how to pass the context from their backend to the frontend
var session_context = ...;

function getUrlVars() {
  var vars = {};
  url = window.location.href;
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function getUrlParam(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  url = window.location.href;
  if (url.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

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

    if (window.location.href.indexOf("EMAIL") > -1) {
      salemove.updateInformation(
        {
          "customAttributesUpdateMethod": 'merge',
          "customAttributes": {
              "EMAIL": getUrlParam('EMAIL')
          }
      }).then(function() {
          console.log("success");
      }).catch(function(error) {
          console.log("error adding EMAIL");
      });
    }

    if (window.location.href.indexOf("id") > -1) {
      salemove.updateInformation(
        {
          "customAttributesUpdateMethod": 'merge',
          "customAttributes": {
              "id": getUrlParam('id')
        }
      }).then(function() {
          console.log("success");
      }).catch(function(error) {
          console.log("error adding id");
      });
    }
    // Capture context
    var session_context = glia.getSessionContext();
    // Save the value of session_context using client's method of choice
  }
});