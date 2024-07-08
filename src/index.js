class Spinner {

  settings = {};
  names = [];
  namesEl;
  buttonEl;
  inputEl;
  selectedNameIdx = 0;
  inputPlaceholderText = 'Input name here...';

  constructor() {
    this.init();
  }

  init() {
    this.namesEl = document.querySelector('.names');
    this.inputEl = document.querySelector('.name-input');
    this.updateNamesDisplay();
    this.buttonEl = document.querySelector('.add-button');
    this.buttonEl.addEventListener("click", this.addName.bind(this));
    console.log('initialized');
  }

  updateNamesDisplay() {
    let namesArr = [];
    this.names.forEach((name) => {
      let nameEl = document.createElement("div");
      let nameText = document.createTextNode(name);
      nameEl.appendChild(nameText);
      namesArr.push(nameEl);
    })
    this.namesEl.replaceChildren(...namesArr);
    //this.inputEl.reset();
  }

  addName(event) {
    event.preventDefault();
    let form = document.querySelector('.input-container');
    this.names.push(document.getElementById('name-input').value);
    this.updateNamesDisplay();
    form.reset();
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
