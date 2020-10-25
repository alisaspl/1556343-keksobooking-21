'use strict';
(function () {

  const config = window.config.dataRequest;

  function getData(cb) {
    let req = new XMLHttpRequest();

    req.onload = function () {
      if (req.status !== 200) {
        return cb(new Error(`HTTP error`));
      }
      let data;
      try {
        data = JSON.parse(req.responseText);
      } catch (error) {
        return cb(new Error(`JSON error`));
      }
      return cb(null, data);
    };

    req.onerror = function () {
      cb(new Error(`HTTP error`));
    };

    req.ontimeout = function () {
      cb(new Error(`HTTP timeout`));
    };
    req.timeout = config.timeout;

    req.open(config.method, config.url);
    req.send();
  }

  window.data = {
    get: getData,
  };

})();
