'use strict';
(function () {

  const data = window.data;
  const map = window.map;
  const config = window.config;
  const card = window.card;

  const el = {
    houseTypeInput: document.querySelector(`select#housing-type`),
    priceInput: document.querySelector(`select#housing-price`),
    roomsNumberInput: document.querySelector(`select#housing-rooms`),
    guestsNumberInput: document.querySelector(`select#housing-guests`),
    features: document.querySelector(`#housing-features`),
    errorOverlay: document.querySelector(`.data-request-error`),
  };

  el.houseTypeInput.addEventListener(`change`, getDataDebounce);
  el.priceInput.addEventListener(`change`, getDataDebounce);
  el.roomsNumberInput.addEventListener(`change`, getDataDebounce);
  el.guestsNumberInput.addEventListener(`change`, getDataDebounce);
  for (let i = 0; i < el.features.elements.length; i++) {
    el.features.elements[i].addEventListener(`change`, getDataDebounce);
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
        el.errorOverlay.textContent = error.message;
        el.errorOverlay.classList.remove(`hidden`);
      } else {
        map.renderPinsOnMap(apply(pinsData));
      }
    });
  }

  function apply(pinsData) {
    const houseTypeValue = el.houseTypeInput.value;
    let filtredArray = pinsData.filter((element) => {
      return element.offer.type === houseTypeValue || houseTypeValue === `any`;
    });

    const priceType = config.priceTypes[el.priceInput.value];
    filtredArray = filtredArray.filter((element) => {
      return element.offer.price >= priceType.min && element.offer.price <= priceType.max;
    });

    const houseRoomsValue = el.roomsNumberInput.value;
    filtredArray = filtredArray.filter((element) => {
      return element.offer.rooms === parseInt(houseRoomsValue, 10) || houseRoomsValue === `any`;
    });

    const houseGuestsValue = el.guestsNumberInput.value;
    filtredArray = filtredArray.filter((element) => {
      return element.offer.guests === parseInt(houseGuestsValue, 10) || houseGuestsValue === `any`;
    });

    const selectedFeatures = [];
    for (let i = 0; i < el.features.elements.length; i++) {
      const feature = el.features.elements[i];
      if (feature.checked) {
        selectedFeatures.push(feature.value);
      }
    }

    filtredArray = filtredArray.filter((element) => {
      return selectedFeatures.every((feature) => {
        return element.offer.features.indexOf(feature) >= 0;
      });
    });

    if (filtredArray.length > 5) {
      filtredArray.length = 5;
    }

    return filtredArray;
  }

  window.filter = {
    apply,
  };

})();

