var url_api = 'https://ironhack-characters.herokuapp.com/characters';

var newSuperHeroe = {
  id: 1,
  name: '',
  occupation: '',
  weapon: '',
  debt: false
};

/*
 * Reset form
*/
function reset(){
  let inputs = document.querySelectorAll('.input-text,.input-select');
  for(let input of inputs){
    input.value = input.name != 'debt' ? '' : false;
  }
}

function toSubmit(){
   post(newSuperHeroe, url_api).then(function(response){
     if(response.status == 201){ //created
       reset()
       getPersonajes().then(function(personajes){
         populatelist(personajes)
       });
     }
   }).catch(function(e){
     console.log('error al guardar ' + e.message)
   }).then(function(){

   })
   return false;
}

function getPersonajes() {
  return get(url_api).then(
    (dataEnJson) => {
      let arrayPersonajes = [];
      dataEnJson.forEach(data => {
        arrayPersonajes.push(Object.assign({}, data))
      })
      return arrayPersonajes;
    }
  );
}

function populatelist(personajes){
  clearList();
  console.log(personajes)
  var tbody = document.getElementById("tbody-personajes");

  for(let i = 0; i < personajes.length; i++){
    var row = tbody.insertRow();

    row.insertCell(0).innerHTML = personajes[i].name;
    row.insertCell(1).innerHTML = personajes[i].weapon;
    row.insertCell(2).innerHTML = personajes[i].occupation;
    row.insertCell(3).innerHTML = personajes[i].debt ? 'Yes' : 'No';
    row.insertCell(4).innerHTML = '';

  }


}

function clearList(){
  document.querySelectorAll("table tbody tr").forEach(function(e){
    e.remove()
  });
}

function deletePersonaje(id, callback) {
  var url = "https://ironhack-characters.herokuapp.com/characters/" + id;
  return deleteFromAPI(url, callback);
}



function get(url) {
  var myHeader = new Headers();
  var myInit = {
    method: 'GET',
    headers: myHeader
  };
  return fetch(url, myInit).then((response) => response.json());
}

function post(data, url) {
  var myHeader = new Headers();
  myHeader.append("Content-Type", "application/json");
  var datos = JSON.stringify(data);
  var myInit = {
    method: 'POST',
    headers: myHeader,
    body: datos
  };
  return fetch(url, myInit);
}

function remove(url, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.open("DELETE", url);
  httpRequest.onreadystatechange = (response) => {
    if (httpRequest.readyState === 4 || httpRequest.readyState === 200) {
      callback(httpRequest.responseText);
    }
  }
  httpRequest.send();
}

window.onload = function(){
  var inputs = document.querySelectorAll('.input-text,.input-select');

  for(let input of inputs){
    input.addEventListener('change', function(e){
      newSuperHeroe[e.target.name] = e.target.value;
    })
  }

  reset()
  getPersonajes().then(function(personajes){
    populatelist(personajes)
  });
}
