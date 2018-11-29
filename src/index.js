const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.getElementById('toy-collection')
const addToyForm = document.querySelector(`.add-toy-form`)
const addToyFormName = addToyForm.getElementsByClassName(`input-text`)[0]
const addToyFormImage = addToyForm.getElementsByClassName(`input-text`)[1]
let allToys = []
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

addToyForm.addEventListener('submit', addToyToDB)

function getAllToys() {
  toyCollection.innerHTML = ''
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(parsedRes => {
    parsedRes.forEach((toy) => {
      allToys.push(toy)
      toyCollection.innerHTML += toyHTMLConstructor(toy)
    })
    bindLikeButtons()
  })
}

function bindLikeButtons() {
  likeButtons = Array.from(document.getElementsByClassName('like-btn'))
  likeButtons.forEach((button) => {
    button.addEventListener('click', likeToy)
  })
}

function toyHTMLConstructor(toy) {
  return `<div class='card' data-id='${toy.id}'>
            <h2>${toy.name}</h2>
            <img src='${toy.image}' class='toy-avatar'>
            <p>Likes: ${toy.likes}</p>
            <button class="like-btn">Like <3</button>
          </div>`
}

function addToyToDB(event) {
  event.preventDefault()
  toy = { name: `${addToyFormName.value}`, image: `${addToyFormImage.value}`, likes: 0 }
  fetch(`http://localhost:3000/toys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toy)
  })
  .then(res => res.json())
  .then(res => {
    console.log(res)
    getAllToys()
  })
}

function likeToy(event) {
  let likeCount = event.target.parentNode.querySelector('p')
  toyID = event.target.parentNode.dataset.id
  let likeNumCount = parseInt(likeCount.innerHTML.split('Likes: ')[1])
  likeCount.innerHTML = `Likes: ${likeNumCount + 1}`
  fetch(`http://localhost:3000/toys/${toyID}`, {
    method: `PATCH`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({likes: likeNumCount + 1})
  })
  .then(res => res.json())
  .then(res => console.log(res))

}

getAllToys()
