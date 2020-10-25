'use strict';

window.addEventListener(`load`, function () {
  const state = window.state;
  const form = window.form;
  const map = window.map;
  const data = window.data;

  /*
  const mockData = window.mockData;
  const dataPin = [];
  for (let i = 0; i < 8; i++) {
    dataPin.push(mockData.generateMockObject(i));
  }
  */

  // Runtime ////////////////////

  deactivate();

  form.fillAddressInput(map.pin);
  form.disableGuests();
  form.validateGuests();

  data.get((error, pinsData) => {
    if (error !== null) {
      alert(error);
    } else {
      map.pin.addEventListener(`mousedown`, function (evt) {
        if (evt.button === 0) {
          form.fillAddressInput(map.pin);
          activate(pinsData);
        }
      });
      map.pin.addEventListener(`keydown`, function (evt) {
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
    form.showFilters(true);
  }

  function deactivate() {
    state.map = false;
    map.show(false);
    form.showForm(false);
    form.showFilters(false);
  }

});
