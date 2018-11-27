//This uses both pes and opt rendering...
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyBox = document.querySelector('#toy-collection')
const toyFormInputs = toyForm.getElementsByTagName('input')
const toyNameInput = toyFormInputs[0]
const toyImageInput = toyFormInputs[1]
let addToy = false
let toyData;

document.addEventListener('DOMContentLoaded', fetchFest().then(placeToys))

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    toyForm.addEventListener('submit', createToy)
  } else {
    toyForm.style.display = 'none'
  }
})

function fetchFest () {
  return fetch('http://localhost:3000/toys')
  .then(r => r.json())
  .then(p => toyData = p)
}

function placeToys() {
  toyBox.innerHTML = ''
  toyData.forEach(function (toy) {
    const toyItem = document.createElement('div')
    const toyImg = document.createElement('img')
    const toyLikes = document.createElement('p')
    const toyLikeBtn = document.createElement('button')
    const toyDel = document.createElement('button')
    toyDel.innerText = 'delete', toyDel.id = toy.id;
    toyLikeBtn.id = toy.id, toyLikeBtn.innerText = 'PLS LIKE ME', toyLikes.innerText = `Likes: ${toy.likes}`
    toyImg.src = toy.image, toyImg.style = 'max-width: 200px;';
    toyItem.innerHTML = `<h2>${toy.name}</h2>`, toyItem.class = 'card'
    toyItem.append(toyImg), toyItem.append(toyLikes), toyItem.append(toyLikeBtn), toyItem.append(toyDel)
    toyBox.appendChild(toyItem);
    toyLikeBtn.addEventListener('click', likeToy);
    toyDel.addEventListener('click', removeToy)
  })
}

function likeToy (event) {
  comparisonId = parseInt(event.target.id)
  index = toyData.indexOf(toyData.find(toy => toy.id === comparisonId))
  likedToy = toyData.find(toy => toy.id === comparisonId)
  console.log(likedToy)
  likedToy.likes += 1
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: 'PATCH',
    headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
    body: JSON.stringify(likedToy)
  })
  .then(r => r.json())
  .then(p => console.log(p))
  toyData[index] = likedToy
  console.log(toyData)
  placeToys()
}

function removeToy (event) {
  const del = event.target.id
  index = toyData.indexOf(toyData.find(toy => toy.id = del))
  fetch(`http://localhost:3000/toys/${del}`, {
    method: 'delete'
  })
  .then(r => r.json())
  .then(p=> console.log(p))

  toyData.splice(index, 1)
  event.target.parentNode.remove();
}

function createToy(event) {
  event.preventDefault()
  let myToyId = toyData[toyData.length-1].id + 1
  let createdToy = {
    name: toyNameInput.value,
    image: toyImageInput.value,
    likes: 0,
    id: myToyId
  }
  fetch('http://localhost:3000/toys', {
    method: "post",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createdToy)
  })
  .then(r => r.json())
  .then(p => console.log(p))
  toyData.push(createdToy)
  placeToys()
  toyNameInput.value = '', toyImageInput.value = ''
  toyForm.style.display = 'none'
}
