import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  position: 'right-top',
  rtl: false,
  timeout: 4000,
  fontSize: '15px',
  cssAnimationStyle: 'zoom',
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] === undefined || selectedDates[0].getTime() < Date.now()) {
      startBtn.setAttribute('disabled', '');

      selectedDates[0] === undefined
        ? Notify.failure('Please choose a date at all!')
        : Notify.failure('Please choose a date in the future!');
      return;
    }

    startBtn.removeAttribute('disabled');
  },
};

const fp = flatpickr('#datetime-picker', options);
let timerId = null;

const startBtn = document.querySelector('[data-start]');
const valueFields = document.querySelectorAll('.value');

startBtn.addEventListener('click', onStartBtn);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function onStartBtn(evt) {
  evt.target.setAttribute('disabled', '');

  timerId = setInterval(() => {
    const delta = fp.selectedDates[0].getTime() - Date.now();

    if (delta <= 0) {
      clearInterval(timerId);
      evt.target.removeAttribute('disabled');
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(delta);

    valueFields[0].textContent = addLeadingZero(days);
    valueFields[1].textContent = addLeadingZero(hours);
    valueFields[2].textContent = addLeadingZero(minutes);
    valueFields[3].textContent = addLeadingZero(seconds);
  }, 1000);
}
