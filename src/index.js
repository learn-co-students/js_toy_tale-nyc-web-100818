const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false
document.addEventListener('DOMContentLoaded', function() {
  const toyCollectionDiv = document.querySelector('#toy-collection')
  ///STEP 2: Fetch Andy's Toys!With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.

function fetchAllToys() {
  fetch(`http://localhost:3000/toys`, {method: 'GET'})
  .then(responseObject => responseObject.json())
  .then(data => toyCollectionDiv.innerHTML = renderAllToys(data))
}
fetchAllToys()

  ///STEP 3: Add toy info to the card!
  function renderAllToys(data) {
      return data.map(function(eachToy){
        return `<div class="card" id=${eachToy.id}>
        <h2>${eachToy.name}</h2>
        <img src=${eachToy.image} class="toy-avatar"/>
        <p>Likes: ${eachToy.likes}</p>
        <button class="like-btn">Like <3</button>
        </div>`
      }).join('')//end of map
  }//end of renderAllToys


///STEP 4: Add a new toy!

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    toyForm.addEventListener('submit', (e) =>{
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
      }) //end fetch
      .then(responseObject => responseObject.json())
      .then(data => toyCollectionDiv.innerHTML += `<div class="card" id=${data.id}>
      <h2>${data.name}</h2>
      <img src=${data.image} class="toy-avatar"/>
      <p>Likes: ${data.likes}</p>
      <button class="like-btn">Like <3</button>
      </div>`)
    }) // end of addEventListener on toyForm
  } else {
    toyForm.style.display = 'none'
  }
})


  ///STEP 5: Increase toy's likes! // OPTIMISTIC RENDERING
  toyCollectionDiv.addEventListener('click', (e) =>{

    if (e.target.className === "like-btn"){
      currentToyIndex = parseInt(e.target.parentElement.id)
      currentLikes = parseInt(e.target.parentElement.querySelector('p').innerText.split(" ")[1])
      e.target.parentElement.querySelector('p').innerText = `Likes: ${currentLikes+1}`
debugger
      console.log(currentToyIndex, currentLikes)
      fetch(`http://localhost:3000/toys/${currentToyIndex}`, {
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
      }) //end fetch
    } //end of if
  })//end addEventListenerfor toyCollectionDiv

})//end of DOMContentLoaded
