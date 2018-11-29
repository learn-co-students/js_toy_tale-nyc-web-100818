  document.addEventListener('DOMContentLoaded', e => {
    // *********** DOM ELEMENTS **********
    const addBtn = document.querySelector('#new-toy-btn')
    const toyForm = document.querySelector('.container')
    let toyCont = document.getElementById('toy-collection')
    const toyCards = document.getElementsByClassName('className')
    // ********** VARIABLES *************
    let addToy = false
    const url = 'http://localhost:3000/toys'
    // ********** FETCHES/EVENT LISTENERS **********
    fetch(url, { method: 'GET' })
      .then(r => r.json()) // parse the json
      .then(arrayofToyObj => {
        arrayofToyObj.forEach((toy) => {
          // find the container to append each toy to which we got above (toyCont)
          renderOneToy(toy)
        })
      })
    /////////////////////// GIVEN TO US /////////////////////////////
    addBtn.addEventListener('click', () => {
      // hide & seek with the form
      addToy = !addToy
      if (addToy) {
        toyForm.style.display = 'block'
        // submit listener here
        toyForm.addEventListener('submit', (e) => {
          e.preventDefault()
          // grab the inputs from the user creating a new toy...
          let newName = document.getElementById('toy-name').value
          let newURL = document.getElementById('toy-image').value
          let newLikes = 0

          e.target.reset() // reset input field so u don't have to backspace
          // optimistically render these changes...show immediately
          toyCont.innerHTML += `<div id="toy-${id}" class="card">
                                  <h2>${newName}</h2>
                                  <img src=${newURL} class="toy-avatar" />
                                  <p>${newLikes} Likes </p>
                                  <button id="toy-${id}" class="like-btn">Like <3</button>
                                </div>`
         // fetch to update API
         fetch(url, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Accept: 'application/json'
           },
           body: JSON.stringify({
             "name": newName,
             "image": newURL,
             "likes": newLikes
           })
         })
        })
      } else {
        toyForm.style.display = 'none'
      }
    })

    // Increase likes --> add EVENT listener to the CONTAINER/PARENT of all the  buttons bc parent knows about its children
    toyCont.addEventListener('click', e => {
      let foundToy = ''
    // specify the click event for the like button
      if (e.target.className === 'like-btn') {
        let likeButtonId = e.target.id
        // debugger
        let foundToyId = parseInt(likeButtonId.split('-')[1])
        // find the element on the page with this id! each div has one of these
        let foundToy = document.getElementById(`${likeButtonId}`)
        // find this foundToy's p tag where it lists the likes
        let foundPTag = foundToy.querySelector('p')
        let likesCounter = parseInt(foundPTag.innerText)
        let newLikes = likesCounter + 1
        // optimistically render
        foundPTag.innerHTML = `${newLikes} likes`
        // now send a PATCH to the server
        fetch(`http://localhost:3000/toys/${foundToyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            "likes": newLikes
          })
        })
      } // end of if statement
    }) // end of event listener


    ////////////////////// HELPERS ////////////////////////////
    function renderOneToy(toy) {
      // return - not necessary
      toyCont.innerHTML += `<div id="toy-${toy.id}" class="card">
                              <h2>${toy.name}</h2>
                              <img src=${toy.image} class="toy-avatar" />
                              <p>${toy.likes} Likes </p>
                              <button id="toy-${toy.id}" class="like-btn">Like <3</button>
                            </div>`
    }

  }) // end of DOMContentLoaded



// OR HERE!
