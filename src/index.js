const addBtn = document.querySelector('#new-toy-btn');
const toyForm = document.querySelector('.container');
let addToy = false

const newToyForm = document.querySelector(".add-toy-form");

//get access to like button
// const likeBtn = document.getElementById(`toy-${toyObject.id}-likes`);


// YOUR CODE HERE

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


// OR HERE!

document.addEventListener('DOMContentLoaded', () => {

  const toyCollection = document.getElementById("toy-collection");

//show all toy cards on the page
  fetch('http://localhost:3000/toys')
  .then((responseObject) => responseObject.json())
  .then((toyJSONData) => {
    allToyData = toyJSONData
    toyCollection.innerHTML = renderAllToys(allToyData);
  });

  //add a toy card to the page
  newToyForm.addEventListener('submit', function(event){
    //prevent form from submitting
    event.preventDefault();
    //grab name value of new toy
    const newToyName = event.target.name.value;
    //grab url of new toy image
    const newToyImage = event.target.image.value;
    createToy(newToyName, newToyImage) //call create toy function which is a helper function that send off a 'POST' request to my server
    .then((r) => r.json())
    .then((newToyJSON) => {
      toyCollection.innerHTML += renderSingleToy(newToyJSON)
    })


    // .then((response) => response.json())
    // .then(r => toyCollection.innerHTML +=
    //   `
    //   <div class="card">
    //   <h2>${r.name}</h2>
    //   <img src=${r.image} class="toy-avatar" />
    //   <p>${r.likes} Likes </p>
    //   <button class="like-btn">Like <3</button>
    //   </div>
    //   `
    // )
  //  event.target.reset();

  })

  //like button event
  toyCollection.addEventListener('click', function(event){
    if (event.target.className === 'like-btn'){
      console.log('clicked')

      const clickedToyId = event.target.id
      let likes = parseInt(event.target.dataset.likes)
      let toyDiv = event.target.parentElement
      let likesTag = toyDiv.querySelector("#numLikes")
      // debugger
      let updatedLikes = likes + 1
      event.target.dataset.likes = updatedLikes

      console.log('LIKES', likes)
      console.log('------')
      console.log('UPDATEDLIKES', updatedLikes)
      likesTag.innerText = `${updatedLikes} Likes`
      // debugger
      addLike(clickedToyId, updatedLikes)
      // .then((r) => r.json())
      // .then((updatedToyJSON) => {
      //   // debugger
      //   // updatedToyJSON.innerHTML = updatedToyJSON.likes;
      // })
    }
  })



// debugger
// event.target.previousElementSibling.innerText = event.target.dataset.likes + " Likes"



// fetch(`http://localhost:3000/toys/${clickedToyId}`)
// // getSingleToyData(clickedToyId)
// .then((response) => response.json())
// .then((clickedToyJSON) => {
  //   // event.target.name = clickedToyJSON.name;
  //   // event.target.image = clickedToyJSON.image;
  //   event.target.likes = clickedToyJSON.likes += 1;
  //
  //   event.target.previousElementSibling.innerHTML = event.target.likes + " Likes"
  //  addLike(clickedToyId

    //  ${toyObject.name}-${toyObject.id}
    // event.target.parentElement.likes += 1;
    // debugger
    //  })
    //event.target.previousElementSibling.

  });



//****************************
//******HELPER FUNCTIONS******
//****************************


//render sigle toy image
function renderSingleToy(toyObject) {
  return `
  <div class="card">
  <h2 id=${toyObject.name}-${toyObject.id}>${toyObject.name}</h2>
  <img src=${toyObject.image} class="toy-avatar" />
  <p id="numLikes">${toyObject.likes} Likes </p>
  <button class="like-btn" id=${toyObject.id} data-likes=${toyObject.likes} >Like <3</button>
  </div>
  `
}
//render all toy images on the page
function renderAllToys(toyArray){
  return toyArray.map((renderSingleToy)).join('')
}



// function getSingleToyData(toyId) {
//   return fetch(`http://localhost:3000/toys/${toyId}`, { method: 'GET' })
// }

//create a toy function
function createToy(name, image){
  return fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', //data we are sending to the server
      'Accept': 'application/json' //data we want back from the server
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
}

//add like to Toy
function addLike(toyId, likes) {
  return fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', //data we are sending to the server
      'Accept': 'application/json' //data we want back from the server
    },
    body: JSON.stringify({
      likes: likes
    })
  })
}
