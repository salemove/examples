var installGlia = function(callback) {
  var gliaIntegrationScriptUrl = 'https://api.salemove.com/salemove_integration.js';
  var scriptElement = document.createElement('script');
  scriptElement.async = 1;
  scriptElement.src = gliaIntegrationScriptUrl;
  scriptElement.type = 'text/javascript';
  if (typeof(callback) === 'function') {
   scriptElement.addEventListener('load', callback);
  }
  document.body.append(scriptElement);
};

installGlia(function(){
  sm.getApi({ version: 'v1' }).then(function (glia) {
    glia.updateInformation(
      {
        customAttributes: {
         opCode : "CLR_CACHE"
        }   
      }
   ​ ).then(function () {
      // Capture context
      var session_context = glia.getSessionContext();
      // Save the value of session_context using client's method of choice
    }).catch(function (error) {
      //Callback fired when the request for updating the
    });
  }
});