'use strict';

window.state = {
  map: null,
};

window.config = {
  maxPrice: 20000,
  maxRooms: 20,
  maxGuests: 500,
  dataRequest: {
    url: `https://21.javascript.pages.academy/keksobooking/data`,
    method: `GET`,
    timeout: 5 * 1000,
  },
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
  types: [
    `palace`,
    `flat`,
    `house`,
    `bungalow`,
  ],
  times: [
    `12:00`,
    `13:00`,
    `14:00`,
  ],
  features: [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`,
  ],
};
