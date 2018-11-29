const addBtn = document.querySelector('#new-toy-btn')
const toyFormContainer = document.querySelector('.container')
const toyForm = document.querySelector('#toy-form')
const toyCollection = document.querySelector("#toy-collection")
let addToy = false
let toyCard = document.createElement('div')
toyCard.className = "card"
document.addEventListener("DOMContentLoaded", function (){

function getToysFromDb(){
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then((data) =>{
      showToys(data);
    })// end fetch
  }// end getToysFromDb()

  function addToyToDb(name, image) {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //data we are sending to the server
        'Accept': 'application/json' //data type we want back from the server
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
    getToysFromDb();
  }

  function deleteToy(id){
    fetch(`http://localhost:3000/toys/${id}`, {method: 'DELETE'})
      .then(getToysFromDb());
  }

  function increaseLike(id){
    let card = toyCollection.querySelector(`[data-id='${id}']`)
    let likeCount = parseInt(card.children[2].innerText)
    card.children[2].innerText = `${likeCount+1} likes`

    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', //data we are sending to the server
        'Accept': 'application/json' //data type we want back from the server
      },
      body: JSON.stringify({
        likes: likeCount+1
      })
    })
  }

  function showToys(toys){
    toyCollection.innerHTML = ""
    toys.forEach(function(toy){
      toyCollection.innerHTML += `
      <div class="card" data-id="${toy.id}">
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar">
        <p>${toy.likes} Likes </p>
        <button class="like-btn">Like <3</button>
        <button class="like-btn delete">Delete</button>
      </div>
      `
    })//End forEach
  }// End showToys()

  toyCollection.addEventListener('click', function(event){
    if (event.target.className === "like-btn delete"){
      deleteToy(event.target.parentElement.dataset.id)
    }else if(event.target.className === "like-btn") {
      increaseLike(event.target.parentElement.dataset.id)
    }
  })

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyFormContainer.style.display = 'block'
      toyForm.addEventListener("submit", function(event){
        event.preventDefault()
        addToyToDb(toyForm.name.value, toyForm.image.value)
      })
    } else {
      toyFormContainer.style.display = 'none'
    }
  })

  getToysFromDb()
})// End DOMContentLoaded
