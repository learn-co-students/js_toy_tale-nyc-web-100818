// fetch toys
const fetchToys = () => {
  return fetch('http://localhost:3000/toys', { method: 'GET' })
  .then(response => response.json())
}
// patch toy - likes
const patchJSON = (id, likes) => {
  return fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: likes
    })
  })
}
// create toy
const createToy = (name, url) => {
  return fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: url,
      likes: 0
    })
  })
}
// render HTML
const renderToyHTML = (newToy) => {
  return `<div class='card'>
            <h2> ${newToy.name} </h2>
            <img class='toy-avatar' src=${newToy.image}>
            <p> ${newToy.likes} Likes </p>
            <button data-id="${newToy.id}" class="like-btn">Like <3</button>
          </div>`
}
