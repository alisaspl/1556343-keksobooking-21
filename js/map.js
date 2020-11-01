'use strict';
(function () {

  const config = window.config;

  const el = {
    map: document.querySelector(`.map`),
    mapPinMain: document.querySelector(`.map__pin--main`),
    mapPins: document.querySelector(`.map__pins`),
  };

  let mapPinTemplate = document.querySelector(`#pin`);
  if (mapPinTemplate instanceof HTMLTemplateElement) {
    mapPinTemplate = mapPinTemplate.content;
  } else {
    throw new Error(`pin template not found`);
  }

  // Functions ////////////////////////////////////////

  function renderPinsOnMap(advsData) {
    el.mapPins.querySelectorAll(`button.map__pin`).forEach((element) => {
      if (element !== el.mapPinMain) {
        element.remove();
      }
    });

    const advContainer = document.createDocumentFragment();
    for (let i = 0; i < advsData.length; i++) {
      advContainer.appendChild(createHTMLPinElement(advsData[i]));
    }
    el.mapPins.appendChild(advContainer);
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

  window.map = {
    pin: el.mapPinMain,
    renderPinsOnMap,
    show: (show) => {
      if (show) {
        el.map.classList.remove(`map--faded`);
      } else {
        el.map.classList.add(`map--faded`);
      }
    },
  };

})();
