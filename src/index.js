const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.getElementById('toy-collection')
const newToyForm = document.querySelector('.add-toy-form')

let addToy = false

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

// Load All Toys From DB
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => {
      // console.table(toys)
      toys.forEach((toy) => {
        toyCollection.innerHTML += `
          <div class="card" data-id="${toy.id}">
            <h2>${toy.name}</h2>
            <img src=${toy.image} class="toy-avatar" />
            <div>
              <span id='toy-likes'>${toy.likes}</span> Likes
            </div>
            <button data-id="${toy.id}" class="like-btn">Like <3</button>
          </div>
        `
      })
    })

  //Helper Methods
  postToy = (name, image) => {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
  }

  patchLikes = (id, newLikes) => {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
  }

  //Event Listeners
  newToyForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const toyNameInput = event.target.querySelector('input[name="name"]').value
    const toyImageInput = event.target.querySelector('input[name="image"]').value

    toyCollection.innerHTML += `
          <div class="card">
            <h2>${toyNameInput}</h2>
            <img src=${toyImageInput} class="toy-avatar" />
            <div>
              <span id='toy-likes'>0</span> Likes
            </div>
            <button class="like-btn">Like <3</button>
          </div>
        `

    postToy(toyNameInput, toyImageInput)
  })

  toyCollection.addEventListener('click', (event) => {
    let likes = event.target.parentElement.querySelector('#toy-likes')
    
    if (event.target.className === 'like-btn') {
      likes.innerText = parseInt(likes.innerText) + 1
    }
    patchLikes(event.target.dataset.id, likes.innerText)
  })

}) //end of DOM Content Loaded
