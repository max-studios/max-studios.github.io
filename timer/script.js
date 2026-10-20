const btnRun = document.getElementById('btn-run');
const btnStop = document.getElementById('btn-stop');
const pagesettimer = document.querySelector('.page-set-timer');
const pagerunningtimer = document.querySelector('.page-running-timer');
const pagesettings = document.querySelector('.page-settings');
const btnSettings = document.getElementById('btn-settings');
const btnSave = document.getElementById('btn-save');

check_settings();

// stop timer variable
let allow_timer = true;
// check if timer is running
let timerrunning = false;

btnSettings.addEventListener('click', function () {
  changeSection(pagesettimer, pagesettings);
});

btnSave.addEventListener('click', function () {
  // alarm sfx
  let inpAlarm = document.getElementById('inp-alarm').value;
  if (inpAlarm == 'default') {
    localStorage.setItem('alarm', 'default.mp3');
  }
  // oled mode
  let inpOled = document.getElementById('inp-oled').value;
  localStorage.setItem('oled', inpOled);

  // back to menu
  changeSection(pagesettings, pagesettimer);
});

btnRun.addEventListener('click', function () {
  allow_timer = true;
  changeSection(pagesettimer, pagerunningtimer);
  let inpHours = Number(document.getElementById('input-time-hour').value) || 0;
  let inpMinutes =
    Number(document.getElementById('input-time-minute').value) || 0;
  let inpSeconds =
    Number(document.getElementById('input-time-second').value) || 0;

  // clear inputfields
  document.getElementById('input-time-minute').value = '';
  document.getElementById('input-time-second').value = '';
  document.getElementById('input-time-hour').value = '';
  // all in seconds
  let timerSeconds = inpSeconds + inpMinutes * 60 + inpHours * 3600;

  // run timer
  timer(timerSeconds);
});

btnStop.addEventListener('click', function () {
  changeSection(pagerunningtimer, pagesettimer);
  location.reload();
});

// oled mode
let oledIndex = 0;
addEventListener('mousemove', async function () {
  document.body.style.backgroundColor = 'rgb(38, 38, 38)';
  document.body.style.cursor = 'default';
  btnStop.style.display = 'block';
  if (localStorage.getItem('oled') == 'true') {
    if (oledIndex == 0) {
      oledIndex++;
      await new Promise((resolve) => setTimeout(resolve, 10000));
      oledIndex--;
      if (timerrunning) {
        document.body.style.backgroundColor = 'black';
        btnStop.style.display = 'none';
        document.body.style.cursor = 'none';
      }
    }
  }
});

// timer
async function timer(totalseconds) {
  let pHours = document.getElementById('display-hours');
  let pMinutes = document.getElementById('display-minutes');
  let pSeconds = document.getElementById('display-seconds');
  // set timerrunning to true
  timerrunning = true;
  // oled mode
  for (let i = 0; i <= totalseconds; i++) {
    // disable timer
    if (!allow_timer) {
      break;
      return;
    }
    // all in units
    let currenttotalseconds = totalseconds - i;
    let hours = Math.floor(currenttotalseconds / 60 / 60);
    let minutes = Math.floor(currenttotalseconds / 60) - hours * 60;
    let seconds = currenttotalseconds % 60;
    // remove 0
    if (hours == 0) {
      pHours.style.display = 'none';
    }
    if (minutes == 0 && hours == 0) {
      pMinutes.style.display = 'none';
    }
    // display
    pHours.innerHTML = hours;
    pMinutes.innerHTML = minutes;
    pSeconds.innerHTML = seconds;
    // last 10 sec -> red
    if (seconds <= 10 && seconds > 3 && pMinutes.style.display == 'none') {
      pSeconds.style.color = '#ff7575';
    }
    if (seconds <= 3 && pMinutes.style.display == 'none') {
      pSeconds.style.color = '#ff0000';
    }
    // wait 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  // finished timer
  [pHours, pSeconds].forEach((e) => {
    e.innerHTML = '';
  });
  pMinutes.innerHTML = 'Timer finished';
  pMinutes.style.display = 'block';
  playSound();
}

function playSound() {
  let audioname = localStorage.getItem('alarm');
  let audio = new Audio('sounds/' + audioname);
  audio.play();
  idleSound(audio);
}

function idleSound(audio) {
  btnStop.addEventListener('click', function () {
    stopSound(audio);
  });
}

function stopSound(audio) {
  audio.pause();
}

function check_settings() {
  if (localStorage.getItem('alarm') == null) {
    localStorage.setItem('alarm', 'default.mp3');
  }
  if (localStorage.getItem('oled') == null) {
    localStorage.setItem('oled', 'true');
  }
}

function changeSection(oldSection, newSection) {
  oldSection.style.display = 'none';
  newSection.style.display = 'block';
}
