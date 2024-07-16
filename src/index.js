class Spinner {

  settings = {};
  spinnerEl;
  spinnerCanvas;
  spinnerContext;
  names = [];
  namesEl;
  addButtonEl;
  clearButtonEl;
  spinButtonEl;
  inputEl;
  winnerEl;
  selectedName;
  errorMsg = '';
  mikeModeEl;
  mikeMode = false;
  palette = [
    '#94d0f2',
    '#ddf1fc',
    '#969eca',
    '#f7efad',
    '#ece87a'
  ];

  constructor() {
    this.init();
  }

  init() {
    // todo: add error handling as needed (missing canvas context)
    this.spinnerCanvas = document.getElementById("spinner");
    this.spinnerContext = this.spinnerCanvas.getContext("2d");
    this.spinnerEl = document.querySelector('.spinner');
    this.namesEl = document.querySelector('.names');
    this.inputEl = document.querySelector('.name-input');
    this.winnerEl = document.querySelector('.winner');
    this.updateNamesDisplay();
    this.addButtonEl = document.querySelector('.add');
    this.addButtonEl.addEventListener("click", this.addName.bind(this));
    this.inputEl.addEventListener("keypress", this.addName.bind(this));
    this.clearButtonEl = document.querySelector('.clear');
    this.clearButtonEl.addEventListener("click", this.clearNames.bind(this));
    this.mikeModeEl = document.getElementById('mike-mode');
    this.mikeModeEl.addEventListener("click", this.setMikeMode.bind(this));
    this.spinButtonEl = document.querySelector('.spin');
    this.spinButtonEl.addEventListener("click", this.spin.bind(this));
  }

  setMikeMode(event) {
    this.mikeMode = event.target.checked;
  }

  updateNamesDisplay() {
    let namesArr = [];
    this.names.forEach((name, nameIdx) => {
      let nameContainerEl = document.createElement("div");
      nameContainerEl.className = 'name-container';
      let nameEl = document.createElement("div");
      nameEl.className = 'name';
      nameEl.setAttribute("id", `${name}-${nameIdx}`);
      let nameText = document.createTextNode(name);
      nameEl.appendChild(nameText);
      nameContainerEl.appendChild(nameEl);
      namesArr.push(nameContainerEl);
    })
    this.namesEl.replaceChildren(...namesArr);
    this.addNameDeleteButtons();
  }

  addName(event) {
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      let form = document.querySelector('.input-container');
      this.names.push(document.getElementById('name-input').value);
      if (this.mikeMode) {
        this.names.push('Mike');
      }
      this.updateNamesDisplay();
      form.reset();
      this.updateSpinner();
    }
  }

  addNameDeleteButtons() {
    this.names.forEach((name, nameIdx) => {
      let deleteButtonEl = document.createElement("button");
      deleteButtonEl.className = "delete-name";
      deleteButtonEl.classList.add('button');
      deleteButtonEl.classList.add('delete-button');
      deleteButtonEl.setAttribute("id", `delete-${nameIdx}`);
      let deleteText = document.createTextNode('x');
      deleteButtonEl.appendChild(deleteText);
      deleteButtonEl.addEventListener("click", this.deleteName.bind(this, name));
      let nameEl = document.getElementById(`${name}-${nameIdx}`);
      nameEl.insertAdjacentElement('afterend', deleteButtonEl);
    })
  }

  deleteName(deletedName) {
    this.names = this.names.filter((name) => name !== deletedName);
    this.updateNamesDisplay();
    this.updateSpinner();
  }

  clearNames() {
    this.names = [];
    this.winnerEl.textContent = '';
    this.updateNamesDisplay();
    this.updateSpinner();
  }

  // todo: allow name editing instead of requiring the name to be deleted and re-added in case of typos
  updateName(idx, updatedName) {
    this.names[idx] = updatedName;
  }

  reassignMike() {
    let newMike = this.names[this.getRandomNumber(this.names.length)];
    this.names.forEach((name, nameIdx) => {
      if (name.toLowerCase() === 'mike') {
        this.names[nameIdx] = newMike;
      }
    })
    this.updateNamesDisplay();
    this.updateSpinner();
  }

  spin() {
    // todo: currently no error messages are displayed on page
    if (this.names.length) {
      if (this.mikeMode) {
        if (this.getRandomNumber(2) % 2 !== 0) {
          this.reassignMike();
        }
      }
      this.winnerEl.textContent = '';
      let randomNum = this.getRandomNumber(this.names.length);
      this.selectedName = this.names[randomNum];
      this.spinnerEl.classList.add('rotate');
      setTimeout(() => {
        this.spinnerEl.classList.remove('rotate');
        let wedgeAngle = 360 / this.names.length;
        this.spinnerEl.style.transform = ('rotate(0deg)');
        this.spinnerEl.style.transform = (`rotate(${wedgeAngle * randomNum}deg)`);
        let winnerTxt = document.createTextNode(this.selectedName);
        this.winnerEl.appendChild(winnerTxt);
      }, 1000);
    } else {
      this.errorMsg = 'Error: Add names to spin!';
      console.log(this.errorMsg);
    }
  }

  updateSpinner() {
    this.spinnerEl.style.transform = ('rotate(0deg)');
    this.spinnerContext.clearRect(0, 0, this.spinnerCanvas.width, this.spinnerCanvas.height);
    for (let i = 0; i < this.names.length; i++) {
      let strokeColor = this.palette[this.getRandomNumber(4)];
      this.drawWedgeLines(250, 250, 250, i * (360 / this.names.length), strokeColor);
      this.drawNamesOnCanvas(250, 250, 200, i * (360 / this.names.length) + ((360 / this.names.length) / 2), strokeColor, this.names[i]);
    }
  }

  drawWedgeLines(x, y, length, angle, color) {
    let radians = angle / 180 * Math.PI;
    let endX = x + length * Math.cos(radians);
    let endY = y - length * Math.sin(radians);
    this.spinnerContext.save();
    this.spinnerContext.lineWidth = 3;
    this.spinnerContext.strokeStyle = color;
    this.spinnerContext.beginPath();
    this.spinnerContext.moveTo(x, y)
    this.spinnerContext.lineTo(endX, endY);
    this.spinnerContext.closePath();
    this.spinnerContext.stroke();
  }

  drawNamesOnCanvas(x, y, length, angle, color, name) {
    let radians = angle / 180 * Math.PI;
    let endX = x + length * Math.cos(radians);
    let endY = y - length * Math.sin(radians);
    this.spinnerContext.save();
    this.spinnerContext.fillStyle = color;
    this.spinnerContext.font = "16px sans-serif";
    this.spinnerContext.fillText(name, endX, endY);
  }

  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }
}

export default Spinner;
