'use strict';
(function () {

  const config = window.config.dataRequest;

  function getData(cb) {
    const request = new XMLHttpRequest();

    request.onload = function () {
      if (request.status !== config.httpResponseStatusOK) {
        return cb(new Error(config.httpErrorText));
      }
      let data;
      try {
        data = JSON.parse(request.responseText);
      } catch (error) {
        return cb(new Error(config.jsonErrorText));
      }
      return cb(null, data);
    };

    request.onerror = function () {
      cb(new Error(config.httpErrorText));
    };

    request.ontimeout = function () {
      cb(new Error(config.htttpTimeoutErrorText));
    };
    request.timeout = config.timeout;

    request.open(config.method, config.url);
    request.send();
  }

  window.data = {
    get: getData,
  };

})();
