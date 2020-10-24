'use strict';

window.addEventListener(`load`, function () {
  const state = window.state;
  const form = window.form;
  const map = window.map;

  // Runtime ////////////////////

  const mockData = [];
  for (let i = 0; i < 8; i++) {
    mockData.push(window.generateMockObject(i));
  }

  deactivate();

  form.fillAddressInput(map.pin);
  form.disableGuests();
  form.validateGuests();

  map.pin.addEventListener(`mousedown`, function (evt) {
    if (evt.button === 0) {
      form.fillAddressInput(map.pin);
      activate(mockData);
    }
  });

  map.pin.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      activate(mockData);
    }
  });

  // Functions ///////////////////////

  function activate(data) {
    state.map = true;
    map.renderPinsOnMap(data);
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
