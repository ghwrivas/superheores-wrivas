var http = function(){

  function httpPost(url, data) {
    var myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    return fetch(url, {
      method: 'POST',
      headers: myHeader,
      body: JSON.stringify(data)
    });
  }

  function httpGet(url) {
    return fetch(url, {
      method: 'GET',
      headers: new Headers()
    }).then((response) => response.json());
  }

  function httpDelete(url) {
    return fetch(url, {
      method: 'DELETE',
      headers: new Headers()
    }).then((response) => [{'message':response}]);
  }

  return {
    post: httpPost,
    get: httpGet,
    delete: httpDelete
  }
}
