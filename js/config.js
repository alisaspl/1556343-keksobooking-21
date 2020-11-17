'use strict';
(function () {

  window.state = {
    map: null,
  };

  window.config = {
    mouseEventButtonType: {
      left: 0,
    },
    filterDebounceTimeout: 500,
    maxPrice: 10000000,
    maxRooms: 20,
    maxGuests: 500,
    dataRequest: {
      url: `https://21.javascript.pages.academy/keksobooking/data`,
      method: `GET`,
      timeout: 5 * 1000,
    },
    submitRequest: {
      timeout: 5 * 1000,
    },
    map: {
      minX: 0,
      maxX: 1000,
      minY: 130,
      maxY: 630,
    },
    pin: {
      width: 50,
      height: 70,
      heightWithoutPointer: 50,
    },
    mainPin: {
      width: 62,
      height: 74,
    },
    types: [
      `palace`,
      `flat`,
      `house`,
      `bungalow`,
    ],
    typesTranslation: [
      `Дворец`,
      `Квартира`,
      `Дом`,
      `Бунгало`,
    ],
    typesMinPrice: [
      10000,
      1000,
      5000,
      0,
    ],
    priceTypes: {
      any: {
        min: 0,
        max: 0,
      },
      low: {
        min: 0,
        max: 9999,
      },
      middle: {
        min: 10000,
        max: 49999,
      },
      high: {
        min: 50000,
        max: 0,
      },
    },
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

  window.config.priceTypes.any.max = window.config.maxPrice;
  window.config.priceTypes.high.max = window.config.maxPrice;

})();
