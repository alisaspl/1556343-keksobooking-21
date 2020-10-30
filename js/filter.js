'use strict';
(function () {

  const data = window.data;
  const map = window.map;

  const el = {
    houseTypeInput: document.querySelector(`select#housing-type`),
    errorOverlay: document.querySelector(`.data-request-error`),
  };

  el.houseTypeInput.addEventListener(`change`, () => {
    data.get((error, pinsData) => {
      if (error !== null) {
        el.errorOverlay.textContent = error.message;
        el.errorOverlay.classList.remove(`hidden`);
      } else {
        map.renderPinsOnMap(apply(pinsData));
      }
    });
  });

  function apply(pinsData) {
    let houseTypeValue = el.houseTypeInput.value;
    let filtredArray = [];

    filtredArray = pinsData.filter((element) => {
      if (element.offer.type === houseTypeValue || houseTypeValue === `any`) {
        return true;
      } else {
        return false;
      }
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

