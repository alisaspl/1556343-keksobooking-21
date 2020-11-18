'use strict';
(function () {

  const data = window.data;
  const map = window.map;
  const config = window.config;
  const card = window.card;
  const utils = window.utils;

  const form = document.querySelector(`form.map__filters`);
  const errorOverlay = document.querySelector(`div.data-request-error`);
  const houseTypeInput = form.querySelector(`select#housing-type`);
  const priceInput = form.querySelector(`select#housing-price`);
  const roomsNumberInput = form.querySelector(`select#housing-rooms`);
  const guestsNumberInput = form.querySelector(`select#housing-guests`);
  const featuresInputs = form
    .querySelector(`fieldset#housing-features`)
    .querySelectorAll(`input`);

  houseTypeInput.addEventListener(`change`, getDataDebounce);
  priceInput.addEventListener(`change`, getDataDebounce);
  roomsNumberInput.addEventListener(`change`, getDataDebounce);
  guestsNumberInput.addEventListener(`change`, getDataDebounce);

  featuresInputs.forEach((input) => {
    input.addEventListener(`change`, getDataDebounce);
  });

  let getDataDebounceTimeoutId;
  function getDataDebounce() {
    if (getDataDebounceTimeoutId) {
      clearTimeout(getDataDebounceTimeoutId);
    }
    getDataDebounceTimeoutId = setTimeout(getData, config.filterDebounceTimeout);
    card.closeMainPinCard();
  }

  function getData() {
    data.get((error, pinsData) => {
      if (error !== null) {
        errorOverlay.textContent = error.message;
        errorOverlay.classList.remove(`hidden`);
      } else {
        map.renderPinsOnMap(apply(pinsData));
      }
    });
  }

  function apply(pinsData) {
    const houseTypeValue = houseTypeInput.value;
    const priceType = config.priceTypes[priceInput.value];
    const houseRoomsValue = roomsNumberInput.value;
    const houseGuestsValue = guestsNumberInput.value;
    const selectedFeatures = [];
    featuresInputs.forEach((input) => {
      if (input.checked) {
        selectedFeatures.push(input.value);
      }
    });

    let filteredPins = [];
    for (let i = 0; i < pinsData.length; i++) {
      const element = pinsData[i];
      const isProperHouseType = element.offer.type === houseTypeValue || houseTypeValue === `any`;
      const isProperPrice = element.offer.price >= priceType.min && element.offer.price <= priceType.max;
      const isProperRoomsAmount = element.offer.rooms === parseInt(houseRoomsValue, 10) || houseRoomsValue === `any`;
      const isProperGuestsAmount = element.offer.guests === parseInt(houseGuestsValue, 10) || houseGuestsValue === `any`;
      const areProperSelectedFeatures = selectedFeatures.every((feature) => {
        return element.offer.features.indexOf(feature) >= 0;
      });
      if (isProperHouseType && isProperPrice && isProperRoomsAmount && isProperGuestsAmount && areProperSelectedFeatures) {
        filteredPins.push(element);
      }
      if (filteredPins.length === config.maxElementsOnMap) {
        break;
      }
    }

    return filteredPins;
  }

  window.filter = {
    apply,
    reset: () => {
      form.reset();
    },
    show: (show) => {
      if (show) {
        form.classList.remove(`ad-form--disabled`);
        utils.toggleDisableInputs(form, false);
      } else {
        form.classList.add(`ad-form--disabled`);
        utils.toggleDisableInputs(form, true);
      }
    },
  };

  map.setFilterModule(window.filter);

})();
