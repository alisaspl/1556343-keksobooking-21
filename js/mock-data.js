'use strict';

(function () {

  const config = window.config;

  // Mock data ///////////////////////////////////

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

  // Functions ///////////////////////////////

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
        type: getRandomArrayElement(config.types),
        rooms: getRandomInteger(config.maxRooms + 1),
        guests: getRandomInteger(config.maxGuests + 1),
        checkin: getRandomArrayElement(config.times),
        checkout: getRandomArrayElement(config.times),
        features: getRandomArrayElements(config.features),
        description: hotels[i].description,
        photos: getRandomArrayElements(photos),
      },
      location: {x, y},
    };
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

  window.mockData = {
    generateMockObject
  };

})();
