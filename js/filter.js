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
  const featuresContainer = form.querySelector(`fieldset#housing-features`);

  houseTypeInput.addEventListener(`change`, getDataDebounce);
  priceInput.addEventListener(`change`, getDataDebounce);
  roomsNumberInput.addEventListener(`change`, getDataDebounce);
  guestsNumberInput.addEventListener(`change`, getDataDebounce);
  for (let i = 0; i < featuresContainer.elements.length; i++) {
    featuresContainer.elements[i].addEventListener(`change`, getDataDebounce);
  }

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
    for (let i = 0; i < featuresContainer.elements.length; i++) {
      const feature = featuresContainer.elements[i];
      if (feature.checked) {
        selectedFeatures.push(feature.value);
      }
    }

    let filteredPins = pinsData.filter((element) => {
      const isProperHouseType = element.offer.type === houseTypeValue || houseTypeValue === `any`;
      const isProperPrice = element.offer.price >= priceType.min && element.offer.price <= priceType.max;
      const isProperRoomsAmount = element.offer.rooms === parseInt(houseRoomsValue, 10) || houseRoomsValue === `any`;
      const isProperGuestsAmount = element.offer.guests === parseInt(houseGuestsValue, 10) || houseGuestsValue === `any`;
      const areProperSelectedFeatures = selectedFeatures.every((feature) => {
        return element.offer.features.indexOf(feature) >= 0;
      });
      return isProperHouseType && isProperPrice && isProperRoomsAmount && isProperGuestsAmount && areProperSelectedFeatures;
    });

    if (filteredPins.length > 5) {
      filteredPins.length = 5;
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
