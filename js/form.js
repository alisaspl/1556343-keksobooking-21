'use strict';
(function () {

  const config = window.config;
  const state = window.state;

  const el = {
    form: document.querySelector(`.ad-form`),
    filters: document.querySelector(`.map__filters`),
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
    submitFormBtn: document.querySelector(`.ad-form__submit`),
    resetFormBtn: document.querySelector(`.ad-form__reset`),
  };

  el.successNotification.classList.add(`hidden`);
  el.notificationContainer.appendChild(el.successNotification);

  el.errorNotification.classList.add(`hidden`);
  el.notificationContainer.appendChild(el.errorNotification);

  el.submitForm.roomsInput.addEventListener(`change`, () => {
    disableGuests();
    validateGuests();
  });
  el.submitForm.guestsInput.addEventListener(`change`, validateGuests);
  el.submitForm.typeInput.addEventListener(`change`, validatePrice);

  el.submitForm.timeinInput.addEventListener(`change`, () => {
    el.submitForm.timeoutInput.value = el.submitForm.timeinInput.value;
  });
  el.submitForm.timeoutInput.addEventListener(`change`, () => {
    el.submitForm.timeinInput.value = el.submitForm.timeoutInput.value;
  });

  el.resetFormBtn.addEventListener(`click`, resetForm);

  el.form.addEventListener(`submit`, formSubmit);

  // Functions ///////////////////////

  function formSubmit(evt) {
    evt.preventDefault();
    let req = new XMLHttpRequest();

    req.onload = function () {
      if (req.status !== 200) {
        return formSubmitError(new Error(`HTTP error`));
      }
      let data;
      try {
        data = JSON.parse(req.responseText);
      } catch (error) {
        return formSubmitError(new Error(`JSON error`));
      }
      return formSubmitSuccess(data);
    };

    req.onerror = function () {
      formSubmitError(new Error(`HTTP error`));
    };

    req.ontimeout = function () {
      formSubmitError(new Error(`HTTP timeout`));
    };
    req.timeout = config.submitRequest.timeout;

    req.open(el.form.method, el.form.action);
    req.send(new FormData(el.form));
  }

  el.successNotification.addEventListener(`click`, () => {
    toggleNotification(el.successNotification, false);
  });
  el.errorNotification.addEventListener(`click`, () => {
    toggleNotification(el.errorNotification, false);
  });
  el.errorNotification.querySelector(`button.error__button`).addEventListener(`click`, () => {
    toggleNotification(el.errorNotification, false);
  });
  document.addEventListener(`keydown`, (evt) => {
    if (evt.key === `Escape`) {
      if (!el.successNotification.classList.contains(`hidden`)) {
        toggleNotification(el.successNotification, false);
      }
      if (!el.errorNotification.classList.contains(`hidden`)) {
        toggleNotification(el.errorNotification, false);
      }
    }
  });

  function formSubmitSuccess() {
    resetForm();
    toggleNotification(el.successNotification, true);
  }

  function formSubmitError() {
    toggleNotification(el.errorNotification, true);
  }

  function toggleNotification(notificationElement, show) {
    if (show) {
      el.submitFormBtn.disabled = true;
      notificationElement.classList.remove(`hidden`);
    } else {
      el.submitFormBtn.disabled = false;
      notificationElement.classList.add(`hidden`);
    }
  }

  function resetForm() {
    el.form.reset();
    setTimeout(() => {
      disableGuests();
      validateGuests();
      validatePrice();
      fillAddressInput(window.map.pin);
    }, 0);
  }

  function toggleDisableInputs(formEl, disable) {
    const inputs = formEl.querySelectorAll(`input,select,textarea`);
    for (let i = 0; i < inputs.length; i++) {
      const fieldset = inputs[i].closest(`fieldset`);
      if (fieldset) {
        fieldset.disabled = disable;
      } else {
        inputs[i].disabled = disable;
      }
    }
  }

  function validateGuests() {
    const input = el.submitForm.guestsInput;
    if (input.options[input.selectedIndex].disabled) {
      input.setCustomValidity(`error`);
    } else {
      input.setCustomValidity(``);
    }
  }

  function disableGuests() {
    const roomsNumber = parseInt(el.submitForm.roomsInput.value, 10);
    const guests = el.submitForm.guestsInput;

    for (let i = 0; i < guests.options.length; i++) {
      const guestsNumber = parseInt(guests.options[i].value, 10);
      if (roomsNumber === 100 && guestsNumber !== 0) {
        guests.options[i].disabled = true;
      } else if (guestsNumber > roomsNumber || (guestsNumber === 0 && roomsNumber !== 100)) {
        guests.options[i].disabled = true;
      } else {
        guests.options[i].disabled = false;
      }
    }
  }

  function validatePrice() {
    const minPrice = config.typesMinPrice[
      config.types.indexOf(el.submitForm.typeInput.value)
    ];
    el.submitForm.priceInput.min = el.submitForm.priceInput.placeholder = minPrice;
  }

  function fillAddressInput(element) {
    const x = element.offsetLeft + config.mainPin.w / 2 + config.map.minX;
    let y = element.offsetTop + config.map.minY;

    if (state.map) {
      y += config.mainPin.h;
    } else {
      y += config.mainPin.w / 2;
    }

    el.submitForm.addressInput.value = `${x}, ${y}`;
  }

  window.form = {
    fillAddressInput,
    disableGuests,
    validateGuests,
    validatePrice,
    showForm: (show) => {
      if (show) {
        el.form.classList.remove(`ad-form--disabled`);
        toggleDisableInputs(el.form, false);
      } else {
        el.form.classList.add(`ad-form--disabled`);
        toggleDisableInputs(el.form, true);
      }
    },
    showFilters: (show) => {
      if (show) {
        el.filters.classList.remove(`ad-form--disabled`);
        toggleDisableInputs(el.filters, false);
      } else {
        el.filters.classList.add(`ad-form--disabled`);
        toggleDisableInputs(el.filters, true);
      }
    },
  };

})();
