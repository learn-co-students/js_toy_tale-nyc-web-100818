document.addEventListener('DOMContentLoaded', function(){

////////////////////////////////////Fetch///////////////////////////////////////////////
const toyCollection = document.querySelector('#toy-collection')

let allToys = []

  function fetchToys(){
    fetch("http://localhost:3000/toys")
    .then(function(response){
      return response.json()
    })
    .then(function(toys){
      allToys = toys;
      renderToys(toys)
       grabLis()

    })
  } // end function fetch toys

  fetchToys()

  ////////////////////render onto page //////////////////////////////////////////////////////

  function renderToys(allToys){
    toyCollection.innerHTML =
      allToys.map(function(t){
        return `<div class="card" id=${t.id}>
                 <h2>${t.name}</h2>
                 <img src=${t.image} class="toy-avatar"/>
                 <p class= "likes"> Likes: ${t.likes}</p>
                 <li>
                 <button class="like-btn">Like</button>
                 <button id="${t.id}" data-id="edit">Edit</button><button data-id="delete" id="${t.id}">Delete</button><br>
                 </li>
                 </div>`
               }).join('')//end of map

             }//end of render gifts

/////////////////////like button////////////////////////////////////////////////////
toyCollection.addEventListener('click', function(e){
  if (e.target.className === 'like-btn'){
    currentToyIndex = parseInt(e.target.id)
    debugger
    // currentLikes = parseInt(e.target.parentElement.querySelector('p').innerText.split(' ')[1])
     currentLikes = parseInt(document.querySelector('.likes').innerHTML.split(' ')[2]) + 1

    // e.target.parentElement.querySelector('p').innerText = `Likes: ${currentLikes+1}`
    document.querySelector('.likes').innerHTML = `Likes: ${currentLikes}`
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


         }//end of if

    })//add event listener end

///////////////////////edit/delete button/////////////////////////////////////////////////////////////
// after render occurs
function grabLis(){

  const editToyNameInput = document.querySelector('#edit-toy-name-input')
  const editToyImageInput = document.querySelector('#edit-toy-image-input')

  toyCollection.addEventListener('click', function(event){

      selectedId = parseInt(event.target.id)
     foundToy = allToys.find(function(toy){
       if (toy.id === selectedId){
         return toy
       }
     })
    if(event.target.innerText === "Edit"){
      editToyNameInput.value = foundToy.name
    editToyImageInput.value = foundToy.image
    editToyForm.dataset.id = foundToy.id
       }else if (event.target.innerText === "Delete"){
         updatedAllToys = allToys.filter(function(toy){
           return toy.id != selectedId
         })
         allToys = updatedAllToys
         renderToys(updatedAllToys)

        fetch(`http://localhost:3000/gifts/${selectedId}`, {method: 'DELETE'})
       }

      })//end of Edit/delete
    }//end of grab list
////////////////////////////////////editform////////////////////////////////////////////////////////////
const editToyForm =  document.querySelector("#edit-toy-form")
editToyForm.addEventListener('submit', function(e){
  e.preventDefault()
  datasetIdEdit = parseInt(e.target.dataset.id)
  toyToEdit = allToys.find(function(toy){
     if (toy.id === datasetIdEdit){
       return toy
     }
  })

  let editToyNameInput = document.querySelector("#edit-toy-name-input").value
  let editToyImageInput = document.querySelector("#edit-toy-image-input").value

  toyToEdit.name = editToyNameInput
  // form edited values and replace with gift to found to edit in array
  toyToEdit.image = editToyImageInput
  let index = allToys.indexOf(toyToEdit)
  allToys.splice(index, 1, toyToEdit)
  renderToys(allToys)
  updateToyRequest(ToyToEdit.id)
  // down below
  }) // end of edit event listener

  function updateToyRequest(toyId) {
    fetch(`http://localhost:3000/gifts/${toyId}`,
      {method: 'PATCH',
      headers: {
        "Content-Type":"application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyToEdit.name,
        image: toyToEdit.image
      })
    })// end of fetch
    .then(function(response){
      return response.json()
    })
    .then(function(response){
      return response
    })
  }
/////////////////////new toy button//////////////////////////////////////////////////////////////////
const addBtn = document.querySelector('#new-toy-btn')
let addToy = false
const toyForm = document.querySelector('.container')
const toyCollectionDiv = document.querySelector('#toy-collection')

addBtn.addEventListener('click', () => {
   addToy = !addToy
   //if addbtn clicked then form displays
   if (addToy) {//form displays
     toyForm.style.display = 'block'//displays form
    toyForm.addEventListener('submit', (e) =>{//adding event listener to form submit button
      e.preventDefault() //prevents post
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
      <button id="${t.id}">Edit</button><button id="${t.id}">Delete</button><br>
      </div>`)
    }) // end of addEventListener on toyForm
  } else {
    toyForm.style.display = 'none'//else form does not show up
  }
})


/////////////////////end///////////////////////////
})//end of DOMContentLoaded



























//////////////////////////minhee s code////////////
// const addBtn = document.querySelector('#new-toy-btn')
// const toyForm = document.querySelector('.container')
// let addToy = false
// document.addEventListener('DOMContentLoaded', function() {
//   const toyCollectionDiv = document.querySelector('#toy-collection')
//   ///STEP 2: Fetch Andy's Toys!With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
//
// function fetchAllToys() {
//   fetch(`http://localhost:3000/toys`, {method: 'GET'})
//   .then(responseObject => responseObject.json())
//   .then(data => toyCollectionDiv.innerHTML = renderAllToys(data))
// }
// fetchAllToys()
//
//   ///STEP 3: Add toy info to the card!
//   function renderAllToys(data) {
//       return data.map(function(eachToy){
//         return `<div class="card" id=${eachToy.id}>
//         <h2>${eachToy.name}</h2>
//         <img src=${eachToy.image} class="toy-avatar"/>
//         <p>Likes: ${eachToy.likes}</p>
//         <button class="like-btn">Like <3</button>
//         </div>`
//       }).join('')//end of map
//   }//end of renderAllToys
//
//
// ///STEP 4: Add a new toy!
//
// addBtn.addEventListener('click', () => {
//   // hide & seek with the form
//   addToy = !addToy
//   if (addToy) {
//     toyForm.style.display = 'block'
//     toyForm.addEventListener('submit', (e) =>{
//       e.preventDefault()
//       console.log(e.target.name.value)
//       console.log(e.target.image.value)
//       fetch(`http://localhost:3000/toys`, {
//         method: 'POST',
//         headers:
//         {
//           "Content-Type": "application/json",
//           Accept: "application/json"
//         },
//         body: JSON.stringify(
//
//           {
//             "name": e.target.name.value,
//             "image": e.target.image.value,
//             "likes": 0
//           }
//         )
//       }) //end fetch
//       .then(responseObject => responseObject.json())
//       .then(data => toyCollectionDiv.innerHTML += `<div class="card" id=${data.id}>
//       <h2>${data.name}</h2>
//       <img src=${data.image} class="toy-avatar"/>
//       <p>Likes: ${data.likes}</p>
//       <button class="like-btn">Like <3</button>
//       </div>`)
//     }) // end of addEventListener on toyForm
//   } else {
//     toyForm.style.display = 'none'
//   }
// })
//
//
//   ///STEP 5: Increase toy's likes! // OPTIMISTIC RENDERING
//   toyCollectionDiv.addEventListener('click', (e) =>{
//
//     if (e.target.className === "like-btn"){
//       currentToyIndex = parseInt(e.target.parentElement.id)
//       currentLikes = parseInt(e.target.parentElement.querySelector('p').innerText.split(" ")[1])
//       e.target.parentElement.querySelector('p').innerText = `Likes: ${currentLikes+1}`
// debugger
//       console.log(currentToyIndex, currentLikes)
//       fetch(`http://localhost:3000/toys/${currentToyIndex}`, {
//         method: 'PATCH',
//         headers:
//         {
//           "Content-Type": "application/json",
//           Accept: "application/json"
//         },
//         body: JSON.stringify(
//
//           {
//             "likes": (currentLikes+1)
//           }
//         )
//       }) //end fetch
//     } //end of if
//   })//end addEventListenerfor toyCollectionDiv
//
// })//end of DOMContentLoaded
