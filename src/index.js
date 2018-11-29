//DOM NODES

const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollectionDiv = document.querySelector('#toy-collection')
const nameInputField = document.querySelectorAll('.input-text')[0]
const imageInputField = document.querySelectorAll('.input-text')[1]

let addToy = false
let toys = []


//listens for clicks on the new toy button; if clicked it will toggle 'addToy' to show the toy form; event listener added to form so that when submit button clicked, addNewToy fn is invoked
addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'

    toyForm.addEventListener('submit', (event) => {
      event.preventDefault()
      addNewToy();
    })

  } else {
    toyForm.style.display = 'none'
  }
})

//event listener for addLike fn below
toyCollectionDiv.addEventListener('click', addLike)

//clears toys array, fetches data, parses it, pushes each toy object into the toy array, adds each toy object to the toy collection div by invoking the toyHTML fn on each
function getToys() {
  toys = []
  fetch('http://localhost:3000/toys/', { method: 'GET' })
    .then( resp => resp.json() )
    .then( (parsedToyJson) => {
      return parsedToyJson.map(function(toyObject) {
        toys.push(toyObject);
        toyCollectionDiv.innerHTML += toyHTML(toyObject)
      })
    } )
}

//html constructor that creates the HTML for each toy object
function toyHTML(toyObject) {
  return `
  <div class="card">
  <h2>${toyObject.name}</h2>
  <img src="${toyObject.image}" class="toy-avatar" />
  <h2 id="like-tally-${toyObject.id}">Likes: ${toyObject.likes}</h2>
  <button class="like-btn" id="like-${toyObject.id}">Like <3</button>
  </div>
  `
}

//creates a new toy object from data submitted in input fields, posts it to the db, logs new toy object, pushes it to toys array and creates toy HTML and adds it to the toy DIV
function addNewToy() {
  // console.log("in the addNewToy fn")
  let toy = {
    name: `${nameInputField.value}`,
    image: `${imageInputField.value}`,
    likes: 0
  }

  fetch(`http://localhost:3000/toys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  })
  .then(resp => {
    return resp.json()
  })
  .then( newToy => {
    console.log(newToy);
    toys.push(newToy);
    toyCollectionDiv.innerHTML += toyHTML(newToy);
  })

} // end addNewToy fn

//when click is heard to on toyCollectionDiv, this fn is invoked. If target is one of the like buttons, button is identified by id and the new like amount is determined using likes from toy array and displayed. Button behavior updated to be clicked many times. New amount is patched to the db and console logged.
function addLike(event) {
  if (event.target.className === "like-btn") {
    let id = event.target.id.split('-')[1]
    let tally = document.getElementById(`like-tally-${id}`)
    let toy = toys[id - 1]
    let newLikes = toy.likes + 1
    toy.likes++
    tally.innerHTML = `Likes: ${newLikes}`

    // if (newLikes === 1) {
    //   event.target.innerHTML = "1 Like"
    // } else {
    //   event.target.innerHTML = `${newLikes} Likes`
    // }

    fetch(('http://localhost:3000/toys/' + id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({likes: newLikes})
    })
    .then(resp => resp.json())
    .then(toy => {
      console.log(`${toy.name} increased likes to ${newLikes}`)
    })


  } //end if block


} //end addLike fn


getToys();
