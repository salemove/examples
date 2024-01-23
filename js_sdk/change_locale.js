// Reference:
// https://sdk-docs.glia.com/visitor-js-api/current/Salemove.html#setLocale
// Sets the locale for the Glia Visitor App. Upon initialization the Visitor App 
// is set to the default locale configured for the site. This function can be used
// to change the locale of the Visitor App at any time after initialization.

sm.getApi({ version: 'v1' }).then(function (api) {
    api.setLocale('en-US'); //Set the locale key here
  });
  