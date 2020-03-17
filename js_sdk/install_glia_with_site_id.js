var installGlia = function(siteId, callback) {
  const gliaIntegrationScriptUrl = `https://api.salemove.com/salemove_integration.js?site_id=${siteId}`;
  const scriptTagName = 'script';
  var scriptElement = document.createElement(scriptTagName);

  scriptElement.async = 1;
  scriptElement.src = gliaIntegrationScriptUrl;
  scriptElement.type = "text/javascript";
  scriptElement.addEventListener("load", callback);
  
  document.body.append(scriptElement);
};


installGlia("11111111-2222-3333-4444-555555555555", function(){
  // Any post install configuration
});