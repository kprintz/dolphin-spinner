class Spinner {

  settings = {};
  names = [];
  namesEl;
  addButtonEl;
  clearButtonEl;
  inputEl;

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
    this.names.forEach((name, nameIdx) => {
      let nameEl = document.createElement("div");
      nameEl.className = 'name';
      nameEl.setAttribute("id", `${name}-${nameIdx}`);
      let nameText = document.createTextNode(name);
      nameEl.appendChild(nameText);
      namesArr.push(nameEl);
    })
    this.namesEl.replaceChildren(...namesArr);
    this.addNameDeleteButtons();
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

  addNameDeleteButtons() {
    this.names.forEach((name, nameIdx) => {
      let deleteButtonEl = document.createElement("button");
      deleteButtonEl.className = "delete-name";
      deleteButtonEl.setAttribute("id", `delete-${nameIdx}`);
      let deleteText = document.createTextNode('X');
      deleteButtonEl.appendChild(deleteText);
      deleteButtonEl.addEventListener("click", this.deleteName.bind(this, name));
      let nameEl = document.getElementById(`${name}-${nameIdx}`);
      nameEl.insertAdjacentElement('afterend', deleteButtonEl);
    })
  }

  deleteName(deletedName) {
    this.names = this.names.filter((name) => name !== deletedName);
    this.updateNamesDisplay();
  }

  clearNames() {
    this.names = [];
    this.updateNamesDisplay();
  }

  // todo: allow name editing instead of requiring the name to be deleted and re-added in case of typos
  updateName(idx, updatedName) {
    this.names[idx] = updatedName;
  }

  spin() {

  }
}

export default Spinner;
