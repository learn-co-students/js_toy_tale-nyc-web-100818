// *****GLOBAL VARIABLES & DOM Elements ***********
const addBtn = document.querySelector("#new-toy-btn");
const toyForm = document.querySelector(".container");
const realForm = document.querySelector(".add-toy-form");
const toyContainer = document.querySelector("#toy-collection");
const allToysURL = "http://localhost:3000/toys";
let addToy = false;

// YOUR CODE HERE

addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyForm.style.display = "block";
    // submit listener here
    realForm.addEventListener("submit", createToy);
  } else {
    toyForm.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", init);
// Use event delegation to make the child elements of body have access to the click event listener and increaseLikes function
document.body.addEventListener("click", increaseLikes);

function init() {
  console.log("Welcome to Toy Tale");
  fetchToys();
}
function fetchToys() {
  fetch(allToysURL, { method: "GET" })
    .then(r => {
      console.log(r);
      return r.json();
    })
    .then(toyData => {
      console.table(toyData);
      let allToys = toyData;
      toyContainer.innerHTML = toyData.map(function(toy) {
        return `<div data-id ="${toy.id}" class = "card">
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar">
        <p>${toy.likes} Like(s)</p>
        <button class="like-btn">Like ❤️</button>
        </div>`;
      });
    });
}

function createToyCard(toy) {
  toyContainer.innerHTML += ` 
    <div data-id="${toy.id}" class="card">
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar">
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
    </div>
  `;
}

function createToy(e) {
  e.preventDefault();

  let formInputs = document.querySelectorAll(".input-text");
  let nameInput = formInputs[0].value;
  let imageInput = formInputs[1].value;
  let toyData = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  // !Optimistic Rendering - Works!
  createToyCard(toyData);

  fetch(allToysURL, {
    method: "POST",
    body: JSON.stringify(toyData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  // !Pessimistic Rendering
  // .then(r => r.json())
  // .then(createToyCard);
}

function increaseLikes(e) {
  if (e.target.className === "like-btn") {
    // e.target is the like button, we need to access its parent element the toyCard div
    // we need to get the attributes of our toy card through its like button
    let id = e.target.parentElement.dataset.id;
    let like = e.target.previousElementSibling;
    let likeCount = parseInt(e.target.previousElementSibling.innerText);
    like.innerText = `${likeCount++} Like(s)`;

    // !Optimistic rendering -How ????

    return (
      fetch(`${allToysURL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: likeCount
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        // !pessimistic rendering
        .then(r => r.json())
        .then(console.log)
    );
  }
}

// OR HERE!
