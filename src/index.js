document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content is Loaded');
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollectionDiv = document.querySelector('#toy-collection')
  const createToyForm = document.querySelector('.add-toy-form')
  const nameInputValue = document.querySelector('.input-text')
  const imageInputValue = document.querySelector('.input-text')

  let addToy = false


  fetchAllToys = () => {
    fetch(`http://localhost:3000/toys`,{ method: 'GET' })
    .then(response => response.json())
    .then(json => {
      console.table(json);
      toyCollectionDiv.innerHTML = ""
      json.forEach(function(toy) {
        toyCollectionDiv.innerHTML += `
          <div class="card" data-id="${toy.id}">
            <h2>${toy.name}</h2>
            <img src=${toy.image} class="toy-avatar" height="200" width="200" align="middle"/>
            <div>
              <span id='toy-likes'>${toy.likes}</span> Likes
            </div>
            <button data-id="${toy.id}" class="like-btn">Like <3</button>
          </div>`
      })
    })
  }
  fetchAllToys()

  createtToy = (name, image) => {
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


  addBtn.addEventListener('click', () => {
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      // submit listener here

      createToyForm.addEventListener('submit', function(event) {
        event.preventDefault()
        const NameInput = event.target.querySelector('input[name="name"]').value
        const ImageInput = event.target.querySelector('input[name="image"]').value
        toyCollectionDiv.innerHTML += `
          <div class="card">
            <h2>${NameInput}</h2>
            <img src=${ImageInput} class="toy-avatar" height="200" width="200" align="middle"/>
            <div>
              <span id='toy-likes'>0</span> Likes
            </div>
            <button class="like-btn">Like <3</button>
          </div>`
        createtToy(NameInput, ImageInput)
      })

      toyCollectionDiv.addEventListener('click', (event) => {
        console.log(event.target);
        
        let likes = event.target.parentElement.querySelector('#toy-likes')
        if (event.target.className === 'like-btn') {
          likes.innerText = parseInt(likes.innerText) + 1
        }
        patchLikes(event.target.dataset.id, likes.innerText)
      })

    } else {
      toyForm.style.display = 'none'
    }
  })

})
