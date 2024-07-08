class Spinner {

  settings = {};
  names = ['kat', 'dex', 'jack', 'henry'];
  namesEl;
  selectedNameIdx = 0;

  constructor() {
    this.init();
  }

  init() {
    this.namesEl = document.querySelector('.names');
    this.names.forEach((name) => {
      let nameEl = document.createElement("div");
      let nameText = nameEl.createTextNode(name);
      nameEl.appendChild(nameText);
      this.namesEl.appendChild(nameEl);
    })
    console.log('initialized');
  }

  addName(event) {
    event.preventDefault();
    let formData = new FormData(document.querySelector('.input-container'));
    console.log(formData);
    // this.names.push(event.target.value);
    // console.log('added: ' + event.target.value);
  }

  updateName(idx) {

  }

  removeName(idx) {

  }

  clearNames() {
    this.names = [];
  }

  spin() {

  }
}

export default Spinner;
