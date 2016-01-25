var setCurrentVisitorCustomAttribute = function(attribute, value, salemove) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.salemove.com/visitor');

    requestHeaders = salemove.getRequestHeaders();
    Object.keys(requestHeaders).forEach(function(key) {
      xhr.setRequestHeader(key, requestHeaders[key]);
    });

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function() { reject(xhr.statusText); };

    var customAttributes = {};
    customAttributes[attribute] = value;

    xhr.send(JSON.stringify({
      'note_update_method': 'append',
      'custom_attributes': customAttributes 
    }));
  });
}

sm.getApi().then(
  function(salemove) {
    console.log('I got the api!', salemove);
    setCurrentVisitorCustomAttribute('address', 'Winston', salemove).then(function(result) {
      console.log(result);
    }, function(error) {
      console.log('An error occurred: ', error);
    });
  },
  function(error) { console.log('Error fetching api: ', error); }
);
