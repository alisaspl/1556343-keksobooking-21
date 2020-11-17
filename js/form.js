'use strict';
(function () {

  const config = window.config;
  const utils = window.utils;
  const state = window.state;

  const element = {
    form: document.querySelector(`.ad-form`),
    submitForm: {
      addressInput: document.querySelector(`input#address`),
      roomsInput: document.querySelector(`select#room_number`),
      guestsInput: document.querySelector(`select#capacity`),
      typeInput: document.querySelector(`select#type`),
      priceInput: document.querySelector(`input#price`),
      timeinInput: document.querySelector(`select#timein`),
      timeoutInput: document.querySelector(`select#timeout`),
    },
    notificationContainer: document.querySelector(`main`),
    successNotification: document.querySelector(`template#success`)
      .content.firstElementChild.cloneNode(true),
    errorNotification: document.querySelector(`template#error`)
      .content.firstElementChild.cloneNode(true),
    submitFormButton: document.querySelector(`.ad-form__submit`),
    resetFormButton: document.querySelector(`.ad-form__reset`),
  };

  let deactivate = () => {};

  element.successNotification.classList.add(`hidden`);
  element.notificationContainer.appendChild(element.successNotification);

  element.errorNotification.classList.add(`hidden`);
  element.notificationContainer.appendChild(element.errorNotification);

  element.submitForm.roomsInput.addEventListener(`change`, () => {
    disableGuests();
    validateGuests();
  });
  element.submitForm.guestsInput.addEventListener(`change`, validateGuests);
  element.submitForm.typeInput.addEventListener(`change`, validatePrice);

  element.submitForm.timeinInput.addEventListener(`change`, () => {
    element.submitForm.timeoutInput.value = element.submitForm.timeinInput.value;
  });
  element.submitForm.timeoutInput.addEventListener(`change`, () => {
    element.submitForm.timeinInput.value = element.submitForm.timeoutInput.value;
  });

  element.resetFormButton.addEventListener(`click`, resetForm);

  element.form.addEventListener(`submit`, submitForm);

  function submitForm(evt) {
    evt.preventDefault();
    let request = new XMLHttpRequest();

    request.onload = function () {
      if (request.status !== 200) {
        return handleFormSubmitError(new Error(`HTTP error`));
      }
      let data;
      try {
        data = JSON.parse(request.responseText);
      } catch (error) {
        return handleFormSubmitError(new Error(`JSON error`));
      }
      return handleFormSubmitSuccess(data);
    };

    request.onerror = function () {
      handleFormSubmitError(new Error(`HTTP error`));
    };

    request.ontimeout = function () {
      handleFormSubmitError(new Error(`HTTP timeout`));
    };
    request.timeout = config.submitRequest.timeout;

    request.open(element.form.method, element.form.action);
    request.send(new FormData(element.form));
  }

  element.successNotification.addEventListener(`click`, () => {
    toggleNotification(element.successNotification, false);
  });
  element.errorNotification.addEventListener(`click`, () => {
    toggleNotification(element.errorNotification, false);
  });
  element.errorNotification.querySelector(`button.error__button`).addEventListener(`click`, () => {
    toggleNotification(element.errorNotification, false);
  });
  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      if (!element.successNotification.classList.contains(`hidden`)) {
        toggleNotification(element.successNotification, false);
      }
      if (!element.errorNotification.classList.contains(`hidden`)) {
        toggleNotification(element.errorNotification, false);
      }
    }
  });

  function handleFormSubmitSuccess() {
    deactivate();
    resetForm();
    toggleNotification(element.successNotification, true);
  }

  function handleFormSubmitError() {
    toggleNotification(element.errorNotification, true);
  }

  function toggleNotification(notificationElement, show) {
    if (show) {
      element.submitFormButton.disabled = true;
      notificationElement.classList.remove(`hidden`);
    } else {
      element.submitFormButton.disabled = false;
      notificationElement.classList.add(`hidden`);
    }
  }

  function resetForm() {
    deactivate();
    element.form.reset();
    setTimeout(() => {
      disableGuests();
      validateGuests();
      validatePrice();
      fillAddressInput(window.map.pin);
    }, 0);
  }

  function validateGuests() {
    const input = element.submitForm.guestsInput;
    if (input.options[input.selectedIndex].disabled) {
      input.setCustomValidity(`error`);
    } else {
      input.setCustomValidity(``);
    }
  }

  function disableGuests() {
    const roomsNumber = parseInt(element.submitForm.roomsInput.value, 10);
    const guestsInput = element.submitForm.guestsInput;

    for (let i = 0; i < guestsInput.options.length; i++) {
      const guestsNumber = parseInt(guestsInput.options[i].value, 10);
      if (roomsNumber === 100 && guestsNumber !== 0) {
        guestsInput.options[i].disabled = true;
      } else if (guestsNumber > roomsNumber || (guestsNumber === 0 && roomsNumber !== 100)) {
        guestsInput.options[i].disabled = true;
      } else {
        guestsInput.options[i].disabled = false;
      }
    }
  }

  function validatePrice() {
    const minPrice = config.typesMinPrice[
      config.types.indexOf(element.submitForm.typeInput.value)
    ];
    element.submitForm.priceInput.min = element.submitForm.priceInput.placeholder = minPrice;
  }

  function fillAddressInput(mainPinElement) {
    const xCoordinate = mainPinElement.offsetLeft + config.mainPin.width / 2 + config.map.minX;
    let yCoordinate = mainPinElement.offsetTop + config.map.minY;

    if (state.map) {
      yCoordinate -= config.mainPin.height;
    } else {
      yCoordinate -= config.mainPin.width / 2;
    }

    element.submitForm.addressInput.value = `${xCoordinate}, ${yCoordinate}`;
  }

  window.form = {
    fillAddressInput,
    disableGuests,
    validateGuests,
    validatePrice,
    show: (show) => {
      if (show) {
        element.form.classList.remove(`ad-form--disabled`);
        utils.toggleDisableInputs(element.form, false);
      } else {
        element.form.classList.add(`ad-form--disabled`);
        utils.toggleDisableInputs(element.form, true);
      }
    },
    setDeactivateFunction: (deactivateFunction) => {
      deactivate = deactivateFunction;
    }
  };

})();
