const btnAddNewAlarm = document.getElementById("btn-add-new-alarm");
const wrapperAlarm = document.getElementById("wrapper-alarm");

btnAddNewAlarm.addEventListener("click", () => {
  const minutes = prompt("Podaj ilość minut:");
  if (!minutes) return;
  if (!Number(minutes)) {
    alert("Musisz wprowadzić liczbę");
    return;
  }
  if (Number(minutes) <= 0) {
    alert("Liczba minut musi być większa od 0");
    return;
  }
  if (!Number.isInteger(Number(minutes))) {
    alert("Liczba minut musi być liczbą całkowitą");
    return;
  }
  new Alarm(minutes);
});

class Alarm {
  #DOMwrapper;
  #DOMheaderValue;
  #DOMbtnPause;
  #DOMbtnResume;

  #minutes;
  #minutesCurrent;
  #secondsCurrent = 0;
  #isActive = true;
  #interval;

  #audio = new Audio("./ring.mp3");

  constructor(minutes) {
    this.#minutes = minutes;
    this.#minutesCurrent = minutes;

    this.#init();
  }

  #init() {
    this.#render();
    this.#startInterval();
    this.#addEventListeners();
  }

  #render() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("alarm");

    const headerValue = document.createElement("h1");
    headerValue.textContent = this.#getHeaderValue();

    const btnPause = document.createElement("button");
    btnPause.textContent = "Wstrzymaj";

    const btnResume = document.createElement("button");
    btnResume.textContent = "Wznów";
    btnResume.hidden = true;

    this.#DOMwrapper = wrapper;
    this.#DOMheaderValue = headerValue;
    this.#DOMbtnPause = btnPause;
    this.#DOMbtnResume = btnResume;

    wrapper.appendChild(this.#DOMheaderValue);
    wrapper.appendChild(this.#DOMbtnPause);
    wrapper.appendChild(this.#DOMbtnResume);

    wrapperAlarm.appendChild(wrapper);
  }

  #startInterval() {
    this.#interval = setInterval(() => this.#secondLeft(), 1000);
  }

  #addEventListeners() {
    this.#DOMbtnPause.addEventListener("click", () => {
      this.#isActive = false;
      this.#DOMbtnPause.hidden = true;
      this.#DOMbtnResume.hidden = false;
    });

    this.#DOMbtnResume.addEventListener("click", () => {
      this.#isActive = true;
      this.#DOMbtnPause.hidden = false;
      this.#DOMbtnResume.hidden = true;
    });
  }

  #secondLeft() {
    if (this.#isActive) {
      this.#secondsCurrent -= 1;

      if (this.#secondsCurrent < 0) {
        this.#minutesCurrent -= 1;
        this.#secondsCurrent = 59;

        if (this.#minutesCurrent < 0) {
          this.#minutesCurrent = 0;
          this.#secondsCurrent = 0;

          this.#DOMwrapper.classList.add("finished");
          this.#audio.loop = false;
          this.#audio.play();
          clearInterval(this.#interval);
        }
      }

      this.#renderHeaderValue();
    }
  }

  #getHeaderValue() {
    return `${this.#minutesCurrent}:${String(this.#secondsCurrent).padStart(
      2,
      "0"
    )}`;
  }

  #renderHeaderValue() {
    this.#DOMheaderValue.textContent = this.#getHeaderValue();
  }
}
