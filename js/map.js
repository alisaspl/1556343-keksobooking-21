'use strict';
(function () {

  const config = window.config;
  const card = window.card;
  const form = window.form;
  let filter;

  const element = {
    map: document.querySelector(`.map`),
    mapPinMain: document.querySelector(`.map__pin--main`),
    mapPinsContainer: document.querySelector(`.map__pins`),
    htmlTag: document.getElementsByTagName(`html`)[0],
  };

  let mapPinTemplate = document.querySelector(`#pin`);
  if (mapPinTemplate instanceof HTMLTemplateElement) {
    mapPinTemplate = mapPinTemplate.content;
  } else {
    throw new Error(`pin template not found`);
  }

  element.mapPinMain.addEventListener(`mousedown`, onMouseDown);

  function onMouseDown(evt) {
    if (evt.button === config.mouseEventButtonType.left) {
      filter.reset();
      document.addEventListener(`mouseup`, onMouseUp);
      document.addEventListener(`mousemove`, onMouseMove);
    }
  }
  function onMouseUp() {
    document.removeEventListener(`mouseup`, onMouseUp);
    document.removeEventListener(`mousemove`, onMouseMove);
  }

  function onMouseMove(evt) {
    const xCoordinate = evt.pageX - config.mainPin.width / 2 - (element.htmlTag.clientWidth - element.map.clientWidth) / 2;
    const yCoordinate = evt.pageY - config.mainPin.height / 2;

    const minXCoordinate = config.map.minX - config.mainPin.width / 2;
    const maxXCoordinate = element.map.clientWidth - config.mainPin.width / 2;

    if (xCoordinate > minXCoordinate && xCoordinate < maxXCoordinate) {
      element.mapPinMain.style.left = xCoordinate + `px`;
    } else {
      if (xCoordinate < minXCoordinate) {
        element.mapPinMain.style.left = minXCoordinate + `px`;
      } else {
        element.mapPinMain.style.left = maxXCoordinate + `px`;
      }
    }

    if (yCoordinate > config.map.minY && yCoordinate < config.map.maxY) {
      element.mapPinMain.style.top = yCoordinate + `px`;
    } else {
      if (yCoordinate < config.map.maxY) {
        element.mapPinMain.style.top = config.map.minY + `px`;
      } else {
        element.mapPinMain.style.top = config.map.maxY + `px`;
      }
    }

    form.fillAddressInput(element.mapPinMain);
  }

  function removePins() {
    element.mapPinsContainer.querySelectorAll(`button.map__pin`).forEach((pin) => {
      if (pin !== element.mapPinMain) {
        pin.remove();
      }
    });
  }

  function renderPinsOnMap(advsData) {
    removePins();
    const advContainer = document.createDocumentFragment();
    for (let i = 0; i < advsData.length; i++) {
      advContainer.appendChild(createHTMLPinElement(advsData[i]));
    }
    element.mapPinsContainer.appendChild(advContainer);
  }

  function createHTMLPinElement(advData) {
    const template = mapPinTemplate.firstElementChild.cloneNode(true);
    template.style = `
      left: ${advData.location.x - (config.pin.width / 2)}px;
      top: ${advData.location.y - config.pin.heightWithoutPointer}px
    `;
    template.firstElementChild.src = advData.author.avatar;
    template.firstElementChild.alt = advData.offer.title;

    template.addEventListener(`click`, () => {
      element.mapPinsContainer.querySelectorAll(`button.map__pin--active`).forEach((pinElement) => {
        pinElement.classList.remove(`map__pin--active`);
      });
      template.classList.add(`map__pin--active`);
      card.render(advData);
    });

    return template;
  }

  window.map = {
    pin: element.mapPinMain,
    renderPinsOnMap,
    show: (show) => {
      if (show) {
        element.map.classList.remove(`map--faded`);
      } else {
        removePins();
        element.map.classList.add(`map--faded`);
      }
    },
    setFilterModule: (filterModule) => {
      filter = filterModule;
    },
  };

})();
