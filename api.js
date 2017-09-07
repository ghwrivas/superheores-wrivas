var api = function(){

  var url_api = 'https://ironhack-characters.herokuapp.com/characters';

  var $http = http();

  function getList() {
    return $http.get(url_api).then(
      (dataEnJson) => {
        let arrayPersonajes = [];
        dataEnJson.forEach(data => {
          arrayPersonajes.push(Object.assign({}, data))
        });
        return arrayPersonajes;
      }
    );
  }

  function deleteEntity(id){
    return $http.delete(url_api + '/' + id)
  }

  return {
    list: getList,
    remove: deleteEntity
  }
}
