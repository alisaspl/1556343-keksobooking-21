'use strict';
(function () {

  const config = window.config;
  const card = window.card;

  const el = {
    map: document.querySelector(`.map`),
    mapPinMain: document.querySelector(`.map__pin--main`),
    mapPins: document.querySelector(`.map__pins`),
    htmlTag: document.getElementsByTagName(`html`)[0],
  };

  let mapPinTemplate = document.querySelector(`#pin`);
  if (mapPinTemplate instanceof HTMLTemplateElement) {
    mapPinTemplate = mapPinTemplate.content;
  } else {
    throw new Error(`pin template not found`);
  }

  el.mapPinMain.addEventListener(`mousedown`, onMouseDown);


  // Functions ////////////////////////////////////////

  function onMouseDown() {
    document.addEventListener(`mouseup`, onMouseUp);
    document.addEventListener(`mousemove`, onMouseMove);
  }
  function onMouseUp() {
    document.removeEventListener(`mouseup`, onMouseUp);
    document.removeEventListener(`mousemove`, onMouseMove);
  }

  function onMouseMove(evt) {
    const x = evt.pageX - config.mainPin.w / 2 - (el.htmlTag.clientWidth - el.map.clientWidth) / 2;
    const y = evt.pageY - config.mainPin.h - (el.htmlTag.clientHeight - el.map.clientHeight) / 2;

    const minX = config.map.minX - config.mainPin.w / 2;
    const maxX = el.map.clientWidth - config.mainPin.w / 2;

    if (x > minX && x < maxX) {
      el.mapPinMain.style.left = x + `px`;
    } else {
      if (x < minX) {
        el.mapPinMain.style.left = minX + `px`;
      } else {
        el.mapPinMain.style.left = maxX + `px`;
      }
    }

    if (y > config.map.minY && y < config.map.maxY) {
      el.mapPinMain.style.top = y + `px`;
    } else {
      if (y < config.map.maxY) {
        el.mapPinMain.style.top = config.map.minY + `px`;
      } else {
        el.mapPinMain.style.top = config.map.maxY + `px`;
      }
    }
  }

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
    const template = mapPinTemplate.firstElementChild.cloneNode(true);
    template.style = `
      left: ${advData.location.x + (config.pin.w / 2) + config.map.minX}px;
      top: ${advData.location.y - config.pin.h + config.map.minY}px
    `;
    template.firstElementChild.src = advData.author.avatar;
    template.firstElementChild.alt = advData.offer.title;

    template.addEventListener(`click`, () => {
      card.render(advData);
    });

    return template;
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
