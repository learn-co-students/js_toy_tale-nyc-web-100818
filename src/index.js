let allToys = []


document.addEventListener("DOMContentLoaded", () => {

const url = 'http://localhost:3000/toys'
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyName = document.getElementById('toy-name')
const toyImage = document.getElementById('toy-image')

const toyContainer = document.getElementById('toy-collection')
const likeTracker = {} // create empty hash to store clicked like

let addToy = false

//callback fn to get btns to append onto each card after being rendered onto page
function addLikeBtnToToy() {
  let likeBtns = document.querySelectorAll(".like-btn") // [<btn>, <btn>]
  likeBtns.forEach(btn => {
    btn.addEventListener("click", event => {
      // console.log(btn.dataset.id);
      currentToy = allToys.find( each => each.id == btn.dataset.id)
      currentToy.likes += 1
      // console.log("NEW LIKES", currentToy.likes)
      index = allToys.indexOf(currentToy)
      // console.log("INDEX OF THE TOY IN ARR", index);
      allToys.splice(index, 1, currentToy)
      let toy = document.querySelector(`[data-id="${currentToy.id}"]`)
      // console.log(toy);
      let likeCount = toy.querySelector('#image-likes-count')
      // console.log(likeCount);
      likeCount.innerText = `${currentToy.likes} likes`
      updateLikeDOM()

    })
  })
}


function updateLikeDOM() {

  fetch(`http://localhost:3000/toys/${currentToy.id}`, {
      method: 'PATCH',
      headers:
      {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify ({
        "likes": currentToy.likes
      })
    })
    .then((response) => response.json())
    .then(res => console.log);

}
/*****************************************************************************
## STEP 2: Fetch Andy's Toys!
  * On load fetch all toys
  ****************************************************************************/

function getAllToys() {
  fetch(url)
  .then(response => response.json())
  .then(toyData => {
    allToys = toyData,
    showToysOnPage(toyData)
    addLikeBtnToToy() //callback fn to get btns to append onto each card after being rendered onto page
    // console.table(allToys);
  })
} getAllToys()

/*****************************************************************************

## STEP 3: Add toy info to the card!
  * SHOW ALL TOYS ONTO PAGE
  ****************************************************************************/


function showToysOnPage(toyData) {
  allToys.forEach((toy) => {
    // console.log(toy);
    addToysToPage(toy)
    // let toyCard = document.querySelector('.card')
    // let likeButton = toyCard.querySelector('#like-btn')
  })
}

//// FN TO ADD EACH toy onto container FROM showToysOnPage fn ///
function addToysToPage(toy){
  toyContainer.innerHTML += `
  <div class="card", data-id=${toy.id}>
    <h2 class="center-text">${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p id="image-likes-count">${toy.likes} likes</p>
    <button class="like-btn" data-id="${toy.id}">Like <3</button>
  </div>
  `
}

/*****************************************************************************
## STEP 4: Add a new toy!
  *BUTTON EVENT LISTENER FOR ADD A NEW TOY! button
  ****************************************************************************/

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


/*****************************************************************************
  * Create a new toy with form
  ****************************************************************************/

  toyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // console.log(e.target.name.value);
    // console.log(e.target.image.value);

    fetch(url,
      {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "name": e.target.name.value,
          "image": e.target.image.value,
          "likes": 0
        })
      })
      .then((response) => response.json())
      .then((newToy => addToysToPage(newToy)))

  })

})//end of DOMContentLoaded
