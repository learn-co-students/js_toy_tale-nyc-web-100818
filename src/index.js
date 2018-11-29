document.addEventListener('DOMContentLoaded', () => {

const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyContainer = document.querySelector('#toy-collection')
const searchBox = document.querySelector('#search-box')
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

// OR HERE!
//----------fetch---------//
  fetch('http://localhost:3000/toys', {method: 'GET'})
    .then(r => r.json())
    .then(toyArray => {
      //console.log(toyArray)
      toyArray.forEach((toy) =>
        toyContainer.innerHTML += renderSingleToy(toy)
    )//end of for each

      //   (toy) =>
      // //forEach b/c only displaying, no need to make new array
      //   toyContainer.innerHTML += `
      //     <div class="card" id="${toy.id}">
      //     <h2>${toy.name}</h2>
      //     <img src=${toy.image} class="toy-avatar" />
      //     <p>${toy.likes} Likes </p>
      //     <button class="like-btn">Like <3</button>
      //     </div>
      // `)//end of forEach
    })//end of fetch

//------------add new toy submit---------//
  toyForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e)
    const newToyName = e.target.querySelector('#toy-name').value
    const newToyImage = e.target.querySelector('#toy-image').value
    createToy(newToyName, newToyImage)
      .then((r) => r.json())
      .then((newToyObj) => {
        toyContainer.innerHTML += renderSingleToy(newToyObj)
      })//end of render toy on page
    e.target.reset()
  })//end of submit EventListener

//-------------like & delete button EventListener---------//
  toyContainer.addEventListener('click', e => {
    if (e.target.className === "like-btn"){
      // debugger
      const likesPTag = event.target.parentElement.querySelector('p')
      const likes = parseInt(likesPTag.innerText)
      const newLikes = likes + 1
      likesPTag.innerHTML = `${newLikes} Likes`
      //end of updating DOM
      const likeId = event.target.parentElement.id
      console.log(likeId, newLikes)
      fetch(`http://localhost:3000/toys/${likeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           "Accept": "application/json"
        },//end of header
        body: JSON.stringify({
           'likes': newLikes
        })//end of body
      })//end of fetch---> updating Server
      .then(r => r.json())
      .then((data)=>console.log(data))
    }//end of if click like

//------------------delete----------------//
    else if (e.target.className ==='delete-btn') {
      console.log(e.target);
      const toyCard = e.target.parentElement
      const toyCardId = toyCard.id
      console.log(toyCardId)
      pessimisticallyDeleteToy(toyCardId,toyCard)
    }//

  })//end of like click EventListener

  //------------pessimistically Delete---------------//
    const pessimisticallyDeleteToy = (id, toyCard) => {
      fetch(`http://localhost:3000/toys/${id}`, {method: 'DELETE'})//delete from database
        .then(r => {
          if(r.ok) {//if successfully delete from server
            toyContainer.removeChild(toyCard)//then delete from DOM
          }//end of if succesfully delete
        })//end of then
    }//end of delete

  //-----------search----------------------//
  searchBox.addEventListener('input', e =>{
    const userInput = e.target.value
    fetch('http://localhost:3000/toys')
      .then(res => res.json())
      .then(json => {
        const filteredToys = json.filter((toy) => {
          return toy.name.toLowerCase().includes(userInput) // filtered the array in memory
        })
        toyContainer.innerHTML = ''//clear the conatiner
        filteredToys.forEach((toy) =>
          toyContainer.innerHTML += renderSingleToy(toy)
        )//end of reder filterToy
      })//end of .teh
  })//end of input search


})//end of DOM Content

//---------------Helper render single toy------//
  function renderSingleToy(toy) {
    return `
      <div class="card" id="${toy.id}">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
      <button class="delete-btn">Delete T^T </button>
      </div>
  `
  }//end of render single toy helper

//--------------helper create Toy-------------//
  function createToy(name, image) {
    return fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', //data we are sending to the server
        'Accept': 'application/json' //data type we want back from the server
      },//end of header
      body: JSON.stringify({
        'name': name,
        'image': image,
        'likes': 0
      })//end of body
    })//end of fetch
  }//end of create toy helper
