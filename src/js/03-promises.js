import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  position: 'right-bottom',
  rtl: true,
  timeout: 4000,
  fontSize: '15px',
  cssAnimationStyle: 'zoom',
});

const form = document.querySelector('.form');
const {
  elements: { delay, step, amount },
} = form;

form.addEventListener('submit', evt => {
  evt.preventDefault();

  runPromises({
    delay: Number(delay.value),
    step: Number(step.value),
    amount: Number(amount.value),
  });

  evt.currentTarget.reset();
});

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function runPromises({ delay, step, amount }) {
  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });

    delay += step;
  }
}
