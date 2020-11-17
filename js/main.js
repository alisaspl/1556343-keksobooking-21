'use strict';
(function () {

  window.addEventListener(`load`, () => {
    const state = window.state;
    const form = window.form;
    const map = window.map;
    const data = window.data;
    const filter = window.filter;

    const errorOverlay = document.querySelector(`.data-request-error`);

    const mapPinInitialCoordinates = {
      xCoordinate: map.pin.style.left,
      yCoordinate: map.pin.style.top,
    };

    deactivate();

    form.fillAddressInput(map.pin);
    form.disableGuests();
    form.validateGuests();
    form.validatePrice();

    data.get(pinDataHandler);

    function pinDataHandler(error, pinsData) {
      if (error !== null) {
        errorOverlay.textContent = error.message;
        errorOverlay.classList.remove(`hidden`);
      } else {
        pinsData = filter.apply(pinsData);
        map.pin.addEventListener(`mousedown`, (evt) => {
          if (evt.button === 0) {
            form.fillAddressInput(map.pin);
            activate(pinsData);
          }
        });
        map.pin.addEventListener(`keydown`, (evt) => {
          if (evt.key === `Enter`) {
            activate(pinsData);
          }
        });
      }
    }

    function activate(pinsData) {
      state.map = true;
      map.renderPinsOnMap(pinsData);
      map.show(true);
      form.show(true);
      filter.show(pinsData.length > 0);
    }

    function deactivate() {
      state.map = false;
      map.show(false);
      form.show(false);
      filter.show(false);
      map.pin.style.left = mapPinInitialCoordinates.xCoordinate;
      map.pin.style.top = mapPinInitialCoordinates.yCoordinate;
    }

    form.setDeactivateFunction(deactivate);

  });
})();
