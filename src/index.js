const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')
let addToy = false // UI state
let toys = [] // model state

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    
    toyForm.addEventListener('submit', event => {
      event.preventDefault()
      const formData = serializeFormData(event.target)
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(newToy => {
        toys.push(newToy)
        render(toys)
      })
    })

  } else {
    toyForm.style.display = 'none'
  }
})

toyCollection.addEventListener('click', event => {
  if (event.target.className.includes("like-btn")) {
    const toyId = event.target.dataset.id
    let likes = parseInt(event.target.dataset.likes)
    likes++
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: likes })
    })
      .then(response => response.json())
      .then(toy => {
        const toyIndex = toys.findIndex(toy => toy.id == toyId)
        toys.splice(toyIndex, 1, toy)
        render(toys)
      })
  }
})

const serializeFormData = (form) => {
  const formData = new FormData(form)
  const dataObj = {}
  formData.forEach((value,key) => {
    dataObj[key] = value
  })
  return dataObj
}

const getToys = () => {
  return fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(json => {
      toys = json
      return toys
    })
}

const render = (toys) => {
  toyCollection.innerHTML = toys.map(toy => 
    `<div class="card">
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes ? toy.likes : "0"} Likes </p>
      <button data-id=${toy.id} data-likes=${toy.likes ? toy.likes : "0"} class="like-btn">Like <3</button>
    </div>`
  ).join("")
}

getToys().then(toys => { render(toys) }) // render it allllll