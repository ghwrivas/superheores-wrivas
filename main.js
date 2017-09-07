var url_api = 'https://ironhack-characters.herokuapp.com/characters';

var rowEditSelected;

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

function toSubmit(form){
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

function deleteForPut(url) {
  var myHeader = new Headers();
  var myInit = {
    method: 'DELETE',
    headers: myHeader
  };
  return fetch(url, myInit).then((response) => [{'message':response}]);
}

function toSubmitUpdate(form){
  let editSuperHeroe = {
    name: rowEditSelected.row.cells[0].querySelector('input').value,
    weapon: rowEditSelected.row.cells[1].querySelector('input').value,
    occupation: rowEditSelected.row.cells[2].querySelector('input').value,
    debt: rowEditSelected.row.cells[3].querySelector('select').value
  };
  showOverlay(true);
  deleteForPut(url_api + '/' + rowEditSelected.id)
  .then(function(result){
    post(editSuperHeroe, url_api).then(function(response){
       if(response.status == 201){ //created
         localStorage.setItem('superheroe', JSON.stringify(editSuperHeroe))
         showMessage(`${editSuperHeroe.name} updated`)
         reset()
         getPersonajes().then(function(personajes){
           populatelist(personajes)
         });
         return null;
       }else if(response.status == 400){
         return response.json();
       }
    });
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
    let row = tbody.insertRow();

    let cell0 = row.insertCell(0);
    let inputName = document.forms[0].querySelector('input[name="name"]');
    let inputNameCloned = inputName.cloneNode(true);
    inputNameCloned.value = personajes[i].name;
    inputNameCloned.style.display = 'none';
    cell0.innerHTML = '<span>'+personajes[i].name+'</span>';
    cell0.appendChild(inputNameCloned);


    let cell1 = row.insertCell(1);
    let inputWeapon = document.forms[0].querySelector('input[name="weapon"]');
    let inputWeaponCloned = inputWeapon.cloneNode(true);
    inputWeaponCloned.value = personajes[i].weapon;
    inputWeaponCloned.style.display = 'none';
    cell1.innerHTML = '<span>'+personajes[i].weapon+'</span>';
    cell1.appendChild(inputWeaponCloned);


    let cell2 = row.insertCell(2);
    let inputOcc = document.forms[0].querySelector('input[name="occupation"]');
    let inputOccCloned = inputOcc.cloneNode(true);
    inputOccCloned.value = personajes[i].occupation;
    inputOccCloned.style.display = 'none';
    cell2.innerHTML = '<span>'+personajes[i].occupation+'</span>';
    cell2.appendChild(inputOccCloned);

    let cell3 = row.insertCell(3);
    let inputDebt = document.forms[0].querySelector('select[name="debt"]');
    let inputDebtCloned = inputDebt.cloneNode(true);
    inputDebtCloned.value = personajes[i].debt;

    inputDebtCloned.options[0].selected = inputDebtCloned.options[0].value == inputDebtCloned.value ? true : false;
    inputDebtCloned.options[1].selected = inputDebtCloned.options[1].value == inputDebtCloned.value ? true : false;
    inputDebtCloned.style.display = 'none';
    let label = personajes[i].debt == 'true' ? 'Yes' : 'No';
    cell3.innerHTML = '<span>'+label+'</span>';
    cell3.appendChild(inputDebtCloned);


    let cell = row.insertCell(4);
    cell.appendChild(createDeleteLink(personajes[i].id));
    cell.appendChild(createEditLink(personajes[i].id));
    cell.appendChild(createUpdateButton());
    cell.appendChild(createCancelUpdateLink(personajes[i].id))
  }
}

function  editItem(element, id) {
  var rowSelected = element.parentNode.parentNode;

  document.querySelectorAll("table tbody tr").forEach(function(e){

    if(rowSelected.rowIndex == e.rowIndex){

      e.cells[0].querySelector('span').style.display = 'none';
      e.cells[1].querySelector('span').style.display = 'none';
      e.cells[2].querySelector('span').style.display = 'none';
      e.cells[3].querySelector('span').style.display = 'none';

      for(let a of e.cells[4].querySelectorAll('a')){
        a.style.display = a.id != 'cancel-edit' ? 'none' : 'inline'
      }

      e.cells[0].querySelector('input').style.display = 'block';
      e.cells[1].querySelector('input').style.display = 'block';
      e.cells[2].querySelector('input').style.display = 'block';
      e.cells[3].querySelector('select').style.display = 'block';
      e.cells[4].querySelector('input').style.display = 'block';
    }else{
      e.cells[0].querySelector('span').style.display = 'block';
      e.cells[1].querySelector('span').style.display = 'block';
      e.cells[2].querySelector('span').style.display = 'block';
      e.cells[3].querySelector('span').style.display = 'block';

      for(let a of e.cells[4].querySelectorAll('a')){
        a.style.display = a.id != 'cancel-edit' ? 'inline' : 'none'
      }

      e.cells[0].querySelector('input').style.display = 'none';
      e.cells[1].querySelector('input').style.display = 'none';
      e.cells[2].querySelector('input').style.display = 'none';
      e.cells[3].querySelector('select').style.display = 'none';
      e.cells[4].querySelector('input').style.display = 'none';
    }

    rowEditSelected = {'id': id, 'row':rowSelected};
  });

}

function  cancelEdit(element, id) {
  var rowSelected = element.parentNode.parentNode.rowIndex;

  document.querySelectorAll("table tbody tr").forEach(function(e){

    if(rowSelected == e.rowIndex){
      e.cells[0].querySelector('span').style.display = 'block';
      e.cells[1].querySelector('span').style.display = 'block';
      e.cells[2].querySelector('span').style.display = 'block';
      e.cells[3].querySelector('span').style.display = 'block';

      for(let a of e.cells[4].querySelectorAll('a')){
        a.style.display = a.id != 'cancel-edit' ? 'inline' : 'none'
      }

      e.cells[0].querySelector('input').style.display = 'none';
      e.cells[1].querySelector('input').style.display = 'none';
      e.cells[2].querySelector('input').style.display = 'none';
      e.cells[3].querySelector('select').style.display = 'none';
      e.cells[4].querySelector('input').style.display = 'none';
    }

  });

}

function createUpdateButton(){
  var x = document.createElement("input");
  x.setAttribute("type", "submit");
  x.setAttribute("class", "input-button");
  x.setAttribute("style", "display: none;");
  return x;
}

function createCancelUpdateLink(id){
  var x = document.createElement("A");
  x.setAttribute("href", "#");
  x.setAttribute("onclick", `cancelEdit(this, ${id})`);
  x.innerHTML = 'Cancel'
  x.setAttribute('id', 'cancel-edit')
  x.style.display = 'none'
  return x;
}

function createEditLink(id){
  var x = document.createElement("A");
  x.setAttribute("href", "#");
  x.setAttribute("onclick", `editItem(this, ${id})`);

  var i = document.createElement("IMG");
  i.setAttribute("src", "https://cdn2.iconfinder.com/data/icons/snipicons/500/edit-24.png");
  i.setAttribute("alt", "Edit item");
  i.setAttribute("title", "Edit item");
  x.appendChild(i);

  return x;
}

function createDeleteLink(id){
  var x = document.createElement("A");
  x.setAttribute("href", "#");
  x.setAttribute("onclick", `deleteItem(${id}, showMessage)`);

  var i = document.createElement("IMG");
  i.setAttribute("src", "https://cdn0.iconfinder.com/data/icons/ikooni-outline-free-basic/128/free-27-24.png");
  i.setAttribute("alt", "Delete item");
  i.setAttribute("title", "Delete item");
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
