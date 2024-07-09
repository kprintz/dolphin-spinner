class Spinner {

  settings = {};
  names = [];
  namesEl;
  addButtonEl;
  clearButtonEl;
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
    this.addButtonEl = document.querySelector('.add-button');
    this.addButtonEl.addEventListener("click", this.addName.bind(this));
    this.inputEl.addEventListener("keypress", this.addName.bind(this));
    this.clearButtonEl = document.querySelector('.clear-button');
    this.clearButtonEl.addEventListener("click", this.clearNames.bind(this));
  }

  updateNamesDisplay() {
    let namesArr = [];
    this.names.forEach((name) => {
      let nameEl = document.createElement("div");
      nameEl.className = 'name';
      let nameText = document.createTextNode(name);
      nameEl.appendChild(nameText);
      namesArr.push(nameEl);
    })
    this.namesEl.replaceChildren(...namesArr);
    //this.inputEl.reset();
  }

  addName(event) {
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      let form = document.querySelector('.input-container');
      this.names.push(document.getElementById('name-input').value);
      this.updateNamesDisplay();
      form.reset();
    }
  }

  updateName(idx) {

  }

  removeName(idx) {

  }

  clearNames() {
    this.names = [];
    this.updateNamesDisplay();
  }

  spin() {

  }
}

export default Spinner;
