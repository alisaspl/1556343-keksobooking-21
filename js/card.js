'use strict';
(function () {

  const config = window.config;

  const container = document.querySelector(`.map`);
  const template = document.querySelector(`#card`).content.firstElementChild;
  let closeCardHandler;

  function render({offer, author}) {
    closeMainPinCard();

    const card = template.cloneNode(true);

    setTextContentOrHide(offer.description, card.querySelector(`.popup__description`));
    setTextContentOrHide(offer.title, card.querySelector(`.popup__title`));
    setTextContentOrHide(offer.address, card.querySelector(`.popup__text--address`));
    setTextContentOrHide(
        offer.price ? `${offer.price}₽/ночь` : undefined,
        card.querySelector(`.popup__text--price`)
    );

    const capicityText = `${offer.rooms} комнаты для ${offer.guests} гостей`;
    setTextContentOrHide(
        offer.rooms && offer.guests ? capicityText : undefined,
        card.querySelector(`.popup__text--capacity`)
    );

    const timeText = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
    setTextContentOrHide(
        offer.checkin && offer.checkout ? timeText : undefined,
        card.querySelector(`.popup__text--time`)
    );

    const houseTypeText = config.typesTranslation[
        config.types.indexOf(offer.type)
    ];
    setTextContentOrHide(houseTypeText, card.querySelector(`.popup__type`));

    if (offer.features.length === 0) {
      card.querySelector(`ul.popup__features`).classList.add(`hidden`);
    } else {
      card.querySelectorAll(`li.popup__feature`).forEach((element) => {
        element.classList.add(`hidden`);
      });
      offer.features.forEach((element) => {
        card.querySelector(`.popup__feature--${element}`).classList.remove(`hidden`);
      });
    }

    const photoTemplate = card.querySelector(`img.popup__photo`);
    const photoContainer = card.querySelector(`div.popup__photos`);
    offer.photos.forEach((photoSrc) => {
      const photoElement = photoTemplate.cloneNode(true);
      photoElement.src = photoSrc;
      photoContainer.appendChild(photoElement);
    });
    photoTemplate.remove();

    card.querySelector(`.popup__avatar`).src = author.avatar;

    card.querySelector(`.popup__close`).addEventListener(`click`, closeMainPinCard);

    container.querySelector(`.map__filters-container`).before(card);

    document.addEventListener(`keydown`, closeByKeydown);
  }

  function closeMainPinCard() {
    const previousCard = container.querySelector(`article.map__card`);
    if (previousCard) {
      previousCard.remove();
    }
    if (closeCardHandler) {
      closeCardHandler();
    }
    document.removeEventListener(`keydown`, closeByKeydown);
  }

  function closeByKeydown(evt) {
    if (evt.key === `Escape`) {
      closeMainPinCard();
    }
  }

  function setTextContentOrHide(text, element) {
    if (text) {
      element.textContent = text;
    } else {
      element.classList.add(`hidden`);
    }
  }

  window.card = {
    render,
    closeMainPinCard,
    setCloseCardHandler: (handler) => {
      closeCardHandler = handler;
    }
  };

})();
