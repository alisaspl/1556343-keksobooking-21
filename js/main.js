'use strict';

// Config //////////////////////////

const config = {
  maxPrice: 20000,
  maxRooms: 20,
  maxGuests: 500,
  map: {
    minX: 0,
    maxX: 1000,
    minY: 130,
    maxY: 630,
  },
  pin: {
    w: 50,
    h: 70,
  },
  mainPin: {
    w: 62,
    h: 74,
  },
};

const state = {
  map: null,
};

const types = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`,
];

const times = [
  `12:00`,
  `13:00`,
  `14:00`,
];

const features = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`,
];

let mapPinTemplate = document.querySelector(`#pin`);
if (mapPinTemplate instanceof HTMLTemplateElement) {
  mapPinTemplate = mapPinTemplate.content;
} else {
  throw new Error(`pin template not found`);
}

const el = {
  map: document.querySelector(`.map`),
  form: document.querySelector(`.ad-form`),
  filters: document.querySelector(`.map__filters`),
  mapPin: document.querySelector(`.map__pin--main`),
  submitForm: {
    addressInput: document.querySelector(`input#address`),
    roomsInput: document.querySelector(`select#room_number`),
    guestsInput: document.querySelector(`select#capacity`),
  },
};

// Mock data ///////////////////////////////

const photos = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`,
];

const hotels = [
  {
    title: `Арарат Парк Хаятт Москва`,
    description: `Пятизвездочный отель «Арарат Парк Хаятт Москва» расположен в историческом и культурном центре Москвы, в 5 минутах ходьбы от Красной площади, рядом с Большим театром и ЦУМом.`,
  },
  {
    title: `Рэдиссон Коллекшен Отель Москва`,
    description: `Роскошный отель расположен в сталинской высотке в Москве, на пересечении Кутузовского проспекта и улицы Новый Арбат.`,
  },
  {
    title: `Гостиница Измайлово Бета`,
    description: `Гостиница «Измайлово Бета» расположена рядом с Измайловским парком, в 3 минутах ходьбы от станции метро «Партизанская». `,
  },
  {
    title: ` AZIMUT Отель Олимпик Москва`,
    description: `Этот отель бизнес-класса с современными номерами и полным спектром услуг расположен в 5 минутах ходьбы от спортивного комплекса «Олимпийский». В отеле есть представительский этаж и представительский лаундж.`,
  },
  {
    title: `Рэдиссон Блу Олимпийский`,
    description: `Отель Radisson Blu Olympiyskiy с потрясающим видом на столицу расположен в тихом месте в центре города, рядом с проспектом Мира.`,
  },
  {
    title: `Свиссотель Красные Холмы`,
    description: `Этот отель с панорамным видом на город расположен в центре Москвы, в 5 минутах ходьбы от станции метро «Павелецкая». `,
  },
  {
    title: `Арбат Хаус`,
    description: `Этот отель находится в самом центре Москвы, в 5 минутах ходьбы от станции метро «Арбатская».`,
  },
  {
    title: `Гостиница Альфа Измайлово`,
    description: `Этот отель с элегантными номерами находится в зеленой зоне Измайловского парка. От гостиницы «Измайлово Альфа» до станции МЦК «Измайлово» можно дойти за 2 минуты. Расстояние до станции метро «Партизанская» составляет 50 метров, а до центра Москвы — 15 минут езды`,
  },
];

// Runtime ////////////////////

const mockData = [];
for (let i = 0; i < 8; i++) {
  mockData.push(generateMockObject(i));
}

deactivate();
fillAddressInput(el.mapPin);
disableGuests();
validateGuests();

el.mapPin.addEventListener(`mousedown`, function (ev) {
  if (ev.button === 0) {
    fillAddressInput(el.mapPin);
    activate();
  }
});

el.mapPin.addEventListener(`keydown`, function (ev) {
  if (ev.key === `Enter`) {
    activate();
  }
});

el.submitForm.roomsInput.addEventListener(`change`, function () {
  disableGuests();
  validateGuests();
});

el.submitForm.guestsInput.addEventListener(`change`, function () {
  validateGuests();
});

// Functions ///////////////////////

function validateGuests() {
  const input = el.submitForm.guestsInput;
  if (input.options[input.selectedIndex].disabled) {
    input.setCustomValidity(`error`);
  } else {
    input.setCustomValidity(``);
  }
}

function disableGuests() {
  const roomsNumber = parseInt(el.submitForm.roomsInput.value, 10);
  const guests = el.submitForm.guestsInput;

  for (let i = 0; i < guests.options.length; i++) {
    const guestsNumber = parseInt(guests.options[i].value, 10);
    if (roomsNumber === 100 && guestsNumber !== 0) {
      guests.options[i].disabled = true;
    } else if (guestsNumber > roomsNumber || (guestsNumber === 0 && roomsNumber !== 100)) {
      guests.options[i].disabled = true;
    } else {
      guests.options[i].disabled = false;
    }
  }
}

function fillAddressInput(element) {
  const x = element.offsetLeft + config.mainPin.w / 2 + config.map.minX;
  let y = element.offsetTop + config.map.minY;

  if (state.map) {
    y += config.mainPin.h;
  } else {
    y += config.mainPin.w / 2;
  }

  el.submitForm.addressInput.value = `${x}, ${y}`;
}

function activate() {
  state.map = true;
  renderPinsOnMap(mockData);
  el.map.classList.remove(`map--faded`);
  el.form.classList.remove(`ad-form--disabled`);
  el.filters.classList.remove(`ad-form--disabled`);
  toggleDisableInputs(el.form, false);
  toggleDisableInputs(el.filters, false);
}

function deactivate() {
  state.map = false;
  el.map.classList.add(`map--faded`);
  el.form.classList.add(`ad-form--disabled`);
  el.filters.classList.add(`ad-form--disabled`);
  toggleDisableInputs(el.form, true);
  toggleDisableInputs(el.filters, true);
}

function toggleDisableInputs(form, disable) {
  const inputs = form.querySelectorAll(`input,select,textarea`);
  for (let i = 0; i < inputs.length; i++) {
    const fieldset = inputs[i].closest(`fieldset`);
    if (fieldset) {
      fieldset.disabled = disable;
    } else {
      inputs[i].disabled = disable;
    }
  }
}

function renderPinsOnMap(advsData) {
  const advContainer = document.createDocumentFragment();
  for (let i = 0; i < advsData.length; i++) {
    advContainer.appendChild(createHTMLPinElement(advsData[i]));
  }
  document.querySelector(`.map__pins`).appendChild(advContainer);
}

function createHTMLPinElement(advData) {
  const t = mapPinTemplate.firstElementChild.cloneNode(true);
  t.style = `
    left: ${advData.location.x + (config.pin.w / 2) + config.map.minX}px;
    top: ${advData.location.y - config.pin.h + config.map.minY}px
  `;
  t.firstElementChild.src = advData.author.avatar;
  t.firstElementChild.alt = advData.offer.title;
  return t;
}

function getRandomInteger(max) {
  return Math.floor(Math.random() * max);
}

function getRandomArrayElement(array) {
  return array[getRandomInteger(array.length)];
}

function getRandomArrayElements(array) {
  const numberOfElements = getRandomInteger(array.length);
  const arrayCopy = array.concat();
  for (let index = 0; index < numberOfElements; index++) {
    arrayCopy.splice(getRandomInteger(arrayCopy.length), 1);
  }
  return arrayCopy;
}

function generateMockObject(i) {
  const x = getRandomInteger(config.map.maxX + 1);
  const y = getRandomInteger(config.map.maxY - config.map.minY + 1) + config.map.minY;

  return {
    author: {
      avatar: `img/avatars/user0${i + 1}.png`,
    },
    offer: {
      title: hotels[i].title,
      address: `${x}, ${y}`,
      price: getRandomInteger(config.maxPrice + 1),
      type: getRandomArrayElement(types),
      rooms: getRandomInteger(config.maxRooms + 1),
      guests: getRandomInteger(config.maxGuests + 1),
      checkin: getRandomArrayElement(times),
      checkout: getRandomArrayElement(times),
      features: getRandomArrayElements(features),
      description: hotels[i].description,
      photos: getRandomArrayElements(photos),
    },
    location: {x, y},
  };
}
