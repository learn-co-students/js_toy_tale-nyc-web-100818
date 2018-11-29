document.addEventListener('DOMContentLoaded', () => {

const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyContainer = document.querySelector('#toy-collection')
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

//-------------like button EventListener---------//
  toyContainer.addEventListener('click', e => {
    if (e.target.className === "like-btn"){
      const likesPTag = event.target.parentElement.querySelector('p')
      const likes = parseInt(likesPTag.innerText)
      const newLikes = likes + 1
      likesPTag.innerHTML = `${newLikes} Likes`
      //end of updating DOM
      const likeId = event.target.parentElement.id
      console.log(likeId)
      fetch(`http://localhost:3000/toys/${likeId}`, {
        method: "PATCH",
        header: {
          "Content-Type": "application/json",
           Accept: "application/json"
        },//end of header
        body: JSON.stringify({
          "likes": newLikes
        })//end of body
      })//end of fetch---> updating Server
      .then(r => r.json())
      .then(updatedToy)
    }//end of if click like

  })//end of like click EventListener

})//end of DOM Content

//---------------Helper render single toy------//
  function renderSingleToy(toy) {
    return `
      <div class="card" id="${toy.id}">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
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
