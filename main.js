var $api = api();

var rowEditSelected;

function toSubmit(form){
  let inputs = form.querySelectorAll('.input-text,.input-select');
  let newSuperHeroe = {}
  for(let input of inputs){
    newSuperHeroe[input.name] = input.value
  }
  showOverlay(true);
  $api.save(newSuperHeroe).then(function(response){
     if(response.status == 201){ //created
       localStorage.setItem('superheroe', JSON.stringify(newSuperHeroe))
       showMessage(`${newSuperHeroe.name} added to list`)
       reset()
       $api.list().then(function(personajes){
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

function toSubmitUpdate(form){
  let editSuperHeroe = {
    name: rowEditSelected.row.cells[0].querySelector('input').value,
    weapon: rowEditSelected.row.cells[1].querySelector('input').value,
    occupation: rowEditSelected.row.cells[2].querySelector('input').value,
    debt: rowEditSelected.row.cells[3].querySelector('select').value
  };
  showOverlay(true);
  $api.remove(rowEditSelected.id).then(function(result){
    $api.save(editSuperHeroe).then(function(response){
       if(response.status == 201){ //created
         localStorage.setItem('superheroe', JSON.stringify(editSuperHeroe))
         showMessage(`${editSuperHeroe.name} updated`)
         reset()
         $api.list().then(function(personajes){
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

function deleteItem(id, callback) {
  if(confirm('Are you sure?')){
    showOverlay(true)
    $api.remove(id).then(function(response){
      $api.list().then(function(personajes){
        populatelist(personajes)
      })
      return response
    }).then(function(response){
      callback(response)
    }).then(function(){
      showOverlay(false)
    })
  }
}

function reset(){
  let inputs = document.forms[0].querySelectorAll('.input-text,.input-select');
  for(let input of inputs){
    input.value = input.name != 'debt' ? '' : false;
  }
}

function clearList(){
  document.querySelectorAll("table tbody tr").forEach(e => e.remove());
}

function showMessage(message, error){
  let x = document.getElementById('snackbar')
  x.innerHTML = message;
  x.className = error ? 'showError' : 'showSuccess';
  setTimeout(() => x.className = '', 3000);
}

function showOverlay(show){
  if(show){
    document.getElementById("overlay").style.display = "block";
  }else{
    document.getElementById("overlay").style.display = "none";
  }
}

window.onload = function(){
  let inputs = document.forms[0].querySelectorAll('.input-text,.input-select');
  let cache = JSON.parse(localStorage.getItem('superheroe'))
  for(let input of inputs){
    if(cache){
      input.value = cache[input.name];
    }else{
      input.value = input.name != 'debt' ? '' : false;
    }
  }
  showOverlay(true);
  $api.list().then(function(personajes){
    populatelist(personajes);
    showOverlay(false);
  });
}
