const toyz = [];

class Toy {
  constructor(toy) {
    this.id = toy.id;
    this.name = toy.name;
    this.image = toy.image;
    (toy.likes == 0) ? (this.likes = 0) : (this.likes = toy.likes);
    toyz.push(this);
  }
}
