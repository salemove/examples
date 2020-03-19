var installGlia = function(siteId, callback) {
  var gliaIntegrationScriptUrl = 'https://api.salemove.com/salemove_integration.js?site_id=' + siteId;
  var scriptElement = document.createElement('script');

  scriptElement.async = 1;
  scriptElement.src = gliaIntegrationScriptUrl;
  scriptElement.type = 'text/javascript';
  if (typeof(callback) === 'function') {
    scriptElement.addEventListener('load', callback);
  }
  
  document.body.append(scriptElement);
};

var siteId = '11111111-2222-3333-4444-555555555555'; 
/* 
This is a UUID for your site that needs to be requested from your Client Success Manager 
or via our Service Desk https://salemove.atlassian.net/servicedesk/customer/portal/1 
*/

installGlia(siteId, function(){
  // Any post install configuration
});
