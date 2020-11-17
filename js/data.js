'use strict';
(function () {

  const config = window.config.dataRequest;

  function getData(cb) {
    const request = new XMLHttpRequest();

    request.onload = function () {
      if (request.status !== 200) {
        return cb(new Error(`HTTP error`));
      }
      let data;
      try {
        data = JSON.parse(request.responseText);
      } catch (error) {
        return cb(new Error(`JSON error`));
      }
      return cb(null, data);
    };

    request.onerror = function () {
      cb(new Error(`HTTP error`));
    };

    request.ontimeout = function () {
      cb(new Error(`HTTP timeout`));
    };
    request.timeout = config.timeout;

    request.open(config.method, config.url);
    request.send();
  }

  window.data = {
    get: getData,
  };

})();
