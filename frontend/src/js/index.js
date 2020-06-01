fetch('http://node:8081/api/')
  .then(function(response) {
    return response.json();
  }).then(function(myJson) {
    console.log(myJson);
  });