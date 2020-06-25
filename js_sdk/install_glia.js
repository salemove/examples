const installGlia = function(callback) {
  const gliaIntegrationScriptUrl = 'https://api.salemove.com/salemove_integration.js';
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
  // Any post install configuration
});
