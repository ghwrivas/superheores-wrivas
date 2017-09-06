var url_api = 'https://ironhack-characters.herokuapp.com/characters';

var newSuperHeroe = {
  id: 1,
  name: '',
  occupation: '',
  weapon: '',
  debt: false
};

function reset(){
  let inputs = document.querySelectorAll('.input-text,.input-select');
  for(let input of inputs){
    input.value = input.name != 'debt' ? '' : false;
  }
}

function toSubmit(){
  showOverlay(true);
  post(newSuperHeroe, url_api).then(function(response){
     if(response.status == 201){ //created
       localStorage.setItem('superheroe', JSON.stringify(newSuperHeroe))
       showMessage(`${newSuperHeroe.name} added to list`)
       reset()
       getPersonajes().then(function(personajes){
         populatelist(personajes)
       });
       return null;
     }else if(response.status == 400){
       return response.json();
     }
  }).catch(function(e){
     showMessage(e.message, true)
  }).then(function (badData){
     if(badData)
      showMessage(badData.error, true);
  }).then(function(){
     showOverlay(false)
  });
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
  var tbody = document.getElementById("tbody-personajes");
  for(let i = 0; i < personajes.length; i++){
    var row = tbody.insertRow();
    row.insertCell(0).innerHTML = personajes[i].name;
    row.insertCell(1).innerHTML = personajes[i].weapon;
    row.insertCell(2).innerHTML = personajes[i].occupation;
    row.insertCell(3).innerHTML = personajes[i].debt ? 'Yes' : 'No';
    row.insertCell(4).appendChild(createDeleteLink(personajes[i].id));
  }

}

function createDeleteLink(id){
  var x = document.createElement("A");
  //var t = document.createTextNode("Delete");
  x.setAttribute("href", "#");
  x.setAttribute("onclick", `deleteItem(${id}, showMessage)`);
  //x.appendChild(t);

  var i = document.createElement("IMG");
  i.setAttribute("src", "https://cdn0.iconfinder.com/data/icons/ikooni-outline-free-basic/128/free-27-24.png");
  i.setAttribute("alt", "Delete item");
  x.appendChild(i);

  return x;
}

function clearList(){
  document.querySelectorAll("table tbody tr").forEach(function(e){
    e.remove()
  });
}

function deleteItem(id, callback) {
  if(confirm('Are you sure?')){
    var url = "https://ironhack-characters.herokuapp.com/characters/" + id;
    return remove(url, callback);
  }
}

function remove(url, callback) {
  showOverlay(true);
  var httpRequest = new XMLHttpRequest();
  httpRequest.open("DELETE", url);
  httpRequest.onreadystatechange = (response) => {
    if (httpRequest.readyState === 4 || httpRequest.readyState === 200) {
      callback(httpRequest.responseText);
      getPersonajes().then(function(personajes){
        populatelist(personajes);
        showOverlay(false);
      });
    }
  }
  httpRequest.send();
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
  myHeader.append('Content-Type', 'application/json');
  var datos = JSON.stringify(data);
  var myInit = {
    method: 'POST',
    headers: myHeader,
    body: datos
  };
  return fetch(url, myInit);
}

function showMessage(message, error){
  var x = document.getElementById('snackbar')
  x.innerHTML = message;
  x.className = error ? 'showError' : 'showSuccess';
  setTimeout(function(){
    x.className = x.className.replace('show', '');
  }, 3000);
}

window.onload = function(){
  var inputs = document.querySelectorAll('.input-text,.input-select');

  for(let input of inputs){
    input.addEventListener('change', function(e){
      newSuperHeroe[e.target.name] = e.target.value;
    })
  }

  loadCache();
  showOverlay(true);
  getPersonajes().then(function(personajes){
    populatelist(personajes);
    showOverlay(false);
  });
}

/*
 * Reset form
*/
function loadCache(){
  let inputs = document.querySelectorAll('.input-text,.input-select');
  let cache = JSON.parse(localStorage.getItem('superheroe'))
  for(let input of inputs){
    let value;
    if(cache){
      value = cache[input.name];
    }else{
      value = input.name != 'debt' ? '' : false;
    }
    newSuperHeroe[input.name] = value;
    input.value = value;
  }
}

function showOverlay(show){
  if(show){
    document.getElementById("overlay").style.display = "block";
  }else{
    document.getElementById("overlay").style.display = "none";
  }
}
