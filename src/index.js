
// YOUR CODE HERE
document.addEventListener("DOMContentLoaded", function(){

  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollection = document.getElementById('toy-collection')
  const createToyForm = document.querySelector('.add-toy-form')

  let addToy = false

//STEP TWO: fetching all of the toys and rendering it on the page
  function fetchAllToys() {
    fetch(`http://localhost:3000/toys`, {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        console.table(data)
        toyCollection.innerHTML = showAllToys(data)
      })
  }

//STEP THREE: showing the specifics for each toy card on the page
  function showAllToys(data) {
    return data.map(function(eachToy){
    return `<div class="card" id=${eachToy.id}>
        <h2>${eachToy.name}</h2>
        <img src=${eachToy.image} class="toy-avatar"/>
        <p>Likes: ${eachToy.likes}</p>
        <button class="like-btn">Like <3</button>
        </div>`
    }).join("")
  }
  fetchAllToys()

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    //STEP FOUR: Creating Toys that add on to the page
    console.log(createToyForm);
    createToyForm.addEventListener('submit', (e) => {
      e.preventDefault()
      console.log(e.target.name.value)
      console.log(e.target.image.value)
      fetch(`http://localhost:3000/toys`, {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
           {
            "name": e.target.name.value,
            "image": e.target.image.value,
            "likes": 0
          }
        )
      })
        .then(responseObject => responseObject.json())
        .then(data => toyCollection.innerHTML += `<div class="card" id=${data.id}>
        <h2>${data.name}</h2>
        <img src=${data.image} class="toy-avatar"/>
        <p>Likes: ${data.likes}</p>
        <button class="like-btn">Like <3</button>
        </div>`)
    })

  } else {
    toyForm.style.display = 'none'
  }
})


//STEP FIVE: Adding likes to each toy card
toyCollection.addEventListener('click', (e) =>{ //make an event listener for the click of the like button
    if (e.target.className){
      selectedToy = parseInt(e.target.parentElement.id)
      console.log(`The id of the toy you selected is ${selectedToy}`);
      currentLikes = parseInt(e.target.parentElement.querySelector('p').innerText.split(" ")[1])
      console.log(`The toy you selected has ${currentLikes} likes`);
      e.target.parentElement.querySelector('p').innerText = `Likes: ${currentLikes+1}`
      fetch(`http://localhost:3000/toys/${selectedToy}`, {
        method: 'PATCH',
        headers:
        {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
           {
            "likes": (currentLikes+1)
          }
        )
      })
    }
  })//end of eventListener for toyCollection

})//end of DOMContentLoaded
