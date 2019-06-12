// Reference:
// https://js-sdk-docs.salemove.com/class/Salemove.html#updateInformation-dynamic
// Update custom attributes after the window is loaded to ensure sm is loaded
// and methods are present

window.onload = function () { 
  sm.getApi({version: 'v1'}).then(function(salemove) {
    salemove.updateInformation({
      "externalId":"some_external_id",
      "customAttributes": {"one":"1", "two":"2"},
      "name": "John Smith"
    });
  });
};