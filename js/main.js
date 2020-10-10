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
  }
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
renderPinsOnMap(mockData);

// Functions ///////////////////////

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

function random(max) {
  return Math.floor(Math.random() * max);
}

function generateMockObject(i) {
  const x = random((config.map.maxX + 1));
  const y = random((config.map.maxY - config.map.minY + 1)) + config.map.minY;

  const numberOfFeatures = random(features.length);
  const featuresCopy = features.concat();
  for (let index = 0; index < numberOfFeatures; index++) {
    featuresCopy.splice(random(featuresCopy.length), 1);
  }

  const numberOfPhotos = random(photos.length);
  const photosCopy = photos.concat();
  for (let index = 0; index < numberOfPhotos; index++) {
    photosCopy.splice(random(photosCopy.length), 1);
  }

  return {
    author: {
      avatar: `img/avatars/user0${i + 1}.png`,
    },
    offer: {
      title: hotels[i].title,
      address: `${x}, ${y}`,
      price: random(config.maxPrice + 1),
      type: types[random(types.length)],
      rooms: random(config.maxRooms + 1),
      guests: random(config.maxGuests + 1),
      checkin: times[random(times.length)],
      checkout: times[random(times.length)],
      features: featuresCopy,
      description: hotels[i].description,
      photos: photosCopy,
    },
    location: {x, y},
  };
}
