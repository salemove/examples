function request(method, url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', 'Token MY_SECRET_API_TOKEN');
    xhr.setRequestHeader('Accept', 'application/vnd.salemove.v1+json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function() { reject(xhr.statusText) };
    xhr.send();
  });
}

function filterAvailableOperators(data) {
  return data.operators.filter(function(operator) {
    return operator.available == true;
  });
};

request('GET', 'https://api.salemove.com/operators').then(function(result) {
  console.log(filterAvailableOperators(JSON.parse(result)));
}, function(error) {
  console.log('Error fetching data.');
});
