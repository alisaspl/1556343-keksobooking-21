'use strict';

window.addEventListener(`load`, () => {
  const state = window.state;
  const form = window.form;
  const map = window.map;
  const data = window.data;
  const filter = window.filter;
  const errorOverlay = document.querySelector(`.data-request-error`);


  // Runtime ////////////////////

  deactivate();

  form.fillAddressInput(map.pin);
  form.disableGuests();
  form.validateGuests();
  form.validatePrice();

  data.get((error, pinsData) => {
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
  });

  // Functions ///////////////////////

  function activate(pinsData) {
    state.map = true;
    map.renderPinsOnMap(pinsData);
    map.show(true);
    form.showForm(true);
    form.showFilters(pinsData.length > 0);
  }

  function deactivate() {
    state.map = false;
    map.show(false);
    form.showForm(false);
    form.showFilters(false);
  }

});
