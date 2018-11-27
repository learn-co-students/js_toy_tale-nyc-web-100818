const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const newToyName = toyForm.querySelectorAll('.input-text')[0].value
const newToyUrl = toyForm.querySelectorAll('.input-text')[1].value
const toyDiv = document.getElementById('toy-collection')

let addToy = false

// new toy button
addBtn.addEventListener('click', () => {
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
})
// add likes and patch json
toyDiv.addEventListener('click', (event) => {
  let eventId = event.target.dataset.id
  let eventClassName = event.target.className
  let eventParent = event.target.parentElement
  if (eventClassName == "like-btn") {
    let toy = toyz.find(toy => (toy.id == eventId));
    toy.likes += 1;
    patchJSON(toy.id, toy.likes);
    eventParent.querySelector('p').innerText = `${toy.likes} Likes`
  }
})
// create & save new toy
toyForm.addEventListener('submit', (event) => {
  event.preventDefault()
  createToy(newToyName, newToyUrl)
  .then(response => response.json())
  .then(toy => {
    let newToy = new Toy(toy)
    toyDiv.innerHTML += renderToyHTML(newToy)
  })
})
//render and construct toys from JSON
document.addEventListener('DOMContentLoaded', () => {
  fetchToys()
  .then(toys => {
    toys.forEach(toy => {
      let newToy = new Toy(toy)
      toyDiv.innerHTML += renderToyHTML(newToy)
    })
  })
})
