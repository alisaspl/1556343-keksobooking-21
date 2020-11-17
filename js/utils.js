'use strict';
(function () {

  function toggleDisableInputs(formEl, disable) {
    const inputs = formEl.querySelectorAll(`input,select,textarea,button`);
    for (let i = 0; i < inputs.length; i++) {
      const fieldset = inputs[i].closest(`fieldset`);
      if (fieldset) {
        fieldset.disabled = disable;
      } else {
        inputs[i].disabled = disable;
      }
    }
  }

  window.utils = {
    toggleDisableInputs,
  };

})();
