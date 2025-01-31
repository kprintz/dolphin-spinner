class Spinner {

  // todo: link this to index.html
  static CANVAS_SIZE = 500;

  settings = {
    showConfetti: true,
  };
  spinnerEl;
  spinnerCanvas;
  spinnerContext;
  settingsModalEl;
  names = [];
  namesEl;
  addButtonEl;
  clearButtonEl;
  spinButtonEl;
  confettiSettingsToggle;
  inputEl;
  winnerEl;
  selectedName;
  errorMsg = '';
  palette = [
    '#94d0f2',
    '#ddf1fc',
    '#969eca',
    '#f7efad',
    '#ece87a'
  ];
  confettiLib = require('canvas-confetti');
  confetti;
  confettiCanvas;
  confettiCanvasCtx;

  constructor() {
    this.init();
  }

  init() {
    // todo: add error handling as needed (missing canvas context)
    this.spinnerCanvas = document.getElementById("spinner");
    this.spinnerContext = this.spinnerCanvas.getContext("2d");
    this.spinnerEl = document.querySelector('.spinner');
    this.settingsButtonEl = document.querySelector('.settings');
    this.settingsButtonEl.addEventListener("click", this.showSettings.bind(this));
    this.settingsModalEl = document.querySelector('.settings-modal');
    this.namesEl = document.querySelector('.names');
    this.inputEl = document.querySelector('.name-input');
    this.winnerEl = document.querySelector('.winner');
    this.getStoredNames();
    this.addButtonEl = document.querySelector('.add');
    this.addButtonEl.addEventListener("click", this.addName.bind(this));
    this.inputEl.addEventListener("keypress", this.addName.bind(this));
    this.clearButtonEl = document.querySelector('.clear');
    this.clearButtonEl.addEventListener("click", this.clearNames.bind(this));
    this.spinButtonEl = document.querySelector('.spin');
    this.spinButtonEl.addEventListener("click", this.spin.bind(this));
    this.confettiSettingsToggle = document.getElementById('settings-confetti');
    this.confettiSettingsToggle.addEventListener("click", this.updateConfettiSetting.bind(this));
    this.checkSettings();
  }

  getStoredNames() {
    const storedNames = localStorage.getItem('names');
    if (storedNames) {
      this.names = storedNames.split(',');
      this.updateNamesDisplay();
    }
  }

  showSettings() {
    if (this.settingsModalEl.style.display === "none" || this.settingsModalEl.style.display === "") {
      this.settingsModalEl.style.display = "block";
    } else {
      this.settingsModalEl.style.display = "none"
    }
  }

  checkSettings() {
    this.getConfettiSetting();
  }

  getConfettiSetting() {
    this.settings.showConfetti = localStorage.getItem('confetti') === 'true';
    this.initializeConfettiOrNot();
  }

  updateConfettiSetting() {
    this.settings.showConfetti = !this.settings.showConfetti;
    localStorage.setItem('confetti', this.settings.showConfetti.toString());
    this.initializeConfettiOrNot();
  }

  initializeConfettiOrNot() {
    if (this.settings.showConfetti) {
      const confettiSettingsToggle = document.getElementById('settings-confetti');
      confettiSettingsToggle.checked = true;
      this.confettiCanvas = document.getElementById("confetti");
      this.confettiCanvasCtx = this.confettiCanvas.getContext("2d");
      this.confetti = this.confettiLib.create(this.confettiCanvas, { resize: true });
    } else {
      this.confettiCanvas = null;
      this.confettiCanvasCtx = null;
      this.confetti = null;
    }
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
    this.updateSpinner();
  }

  addName(event) {
    if (event.key === "Enter" || event.type === "click") {
      event.preventDefault();
      let form = document.querySelector('.input-container');
      this.names.push(document.getElementById('name-input').value);
      this.updateNamesDisplay();
      form.reset();
      this.updateNamesStorage();
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
    this.updateNamesStorage();
  }

  clearNames() {
    this.names = [];
    this.winnerEl.textContent = '';
    this.updateNamesDisplay();
    this.updateNamesStorage();
  }

  // todo: allow name editing instead of requiring the name to be deleted and re-added in case of typos
  updateName(idx, updatedName) {
    this.names[idx] = updatedName;
  }

  spin() {
    // todo: currently no error messages are displayed on page
    if (this.names.length) {
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
        if (this.settings.showConfetti) {
          this.confetti();
        }
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
      this.drawWedgeLines(i * (360 / this.names.length), strokeColor);
      this.drawNamesOnCanvas(i * (360 / this.names.length) + ((360 / this.names.length) / 2), strokeColor, this.names[i]);
    }
  }

  drawWedgeLines(angle, color) {
    let radians = angle / 180 * Math.PI;
    let x = (Spinner.CANVAS_SIZE / 2) + (Spinner.CANVAS_SIZE / 2) * Math.cos(radians);
    let y = (Spinner.CANVAS_SIZE / 2) - (Spinner.CANVAS_SIZE / 2) * Math.sin(radians);
    this.spinnerContext.save();
    this.spinnerContext.lineWidth = 3;
    this.spinnerContext.strokeStyle = color;
    this.spinnerContext.beginPath();
    this.spinnerContext.moveTo(Spinner.CANVAS_SIZE / 2, Spinner.CANVAS_SIZE / 2)
    this.spinnerContext.lineTo(x, y);
    this.spinnerContext.closePath();
    this.spinnerContext.stroke();
  }

  // todo: I think if I rotate the canvas as I draw the names and then reset after drawing each one, they will angle out instead of being horizontal
  drawNamesOnCanvas(angle, color, name) {
    let radians = angle / 180 * Math.PI;
    let x = (Spinner.CANVAS_SIZE / 2) + 100 * Math.cos(radians);
    let y = (Spinner.CANVAS_SIZE / 2) - 100 * Math.sin(radians);
    this.spinnerContext.save();
    this.spinnerContext.fillStyle = color;
    this.spinnerContext.font = "16px sans-serif";
    this.spinnerContext.fillText(name, x, y);
  }

  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  updateNamesStorage() {
    localStorage.setItem("names", this.names.toString());
  }
}

export default Spinner;
