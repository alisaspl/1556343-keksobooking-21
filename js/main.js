'use strict';

window.addEventListener(`load`, function () {
  const state = window.state;
  const form = window.form;
  const map = window.map;
  const mockData = window.mockData;

  // Runtime ////////////////////

  const data = [];
  for (let i = 0; i < 8; i++) {
    data.push(mockData.generateMockObject(i));
  }

  deactivate();

  form.fillAddressInput(map.pin);
  form.disableGuests();
  form.validateGuests();

  map.pin.addEventListener(`mousedown`, function (evt) {
    if (evt.button === 0) {
      form.fillAddressInput(map.pin);
      activate(data);
    }
  });

  map.pin.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      activate(data);
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
