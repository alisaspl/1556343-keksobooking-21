'use strict';
(function () {

  const config = window.config;

  const container = document.querySelector(`.map`);
  const template = document.querySelector(`#card`).content.firstElementChild;

  function render(cardData) {
    closeMainPinCard();

    const card = template.cloneNode(true);

    setTextContentOrHide(cardData.offer.description, card.querySelector(`.popup__description`));
    setTextContentOrHide(cardData.offer.title, card.querySelector(`.popup__title`));
    setTextContentOrHide(cardData.offer.address, card.querySelector(`.popup__text--address`));
    setTextContentOrHide(
        cardData.offer.price ? `${cardData.offer.price}₽/ночь` : undefined,
        card.querySelector(`.popup__text--price`)
    );

    const capicityText = `${cardData.offer.rooms} комнаты для ${cardData.offer.guests} гостей`;
    setTextContentOrHide(
        cardData.offer.rooms && cardData.offer.guests ? capicityText : undefined,
        card.querySelector(`.popup__text--capacity`)
    );

    const timeText = `Заезд после ${cardData.offer.checkin}, выезд до ${cardData.offer.checkout}`;
    setTextContentOrHide(
        cardData.offer.checkin && cardData.offer.checkout ? timeText : undefined,
        card.querySelector(`.popup__text--time`)
    );

    const houseTypeText = config.typesTranslation[
        config.types.indexOf(cardData.offer.type)
    ];
    setTextContentOrHide(houseTypeText, card.querySelector(`.popup__type`));

    card.querySelectorAll(`li.popup__feature`).forEach((element) => {
      element.classList.add(`hidden`);
    });
    cardData.offer.features.forEach((element) => {
      card.querySelector(`.popup__feature--${element}`).classList.remove(`hidden`);
    });

    const photoTemplate = card.querySelector(`img.popup__photo`);
    const photoContainer = card.querySelector(`div.popup__photos`);
    cardData.offer.photos.forEach((photoSrc) => {
      const photoElement = photoTemplate.cloneNode(true);
      photoElement.src = photoSrc;
      photoContainer.appendChild(photoElement);
    });
    photoTemplate.remove();

    card.querySelector(`.popup__avatar`).src = cardData.author.avatar;

    card.querySelector(`.popup__close`).addEventListener(`click`, closeMainPinCard);

    container.querySelector(`.map__filters-container`).before(card);

    document.addEventListener(`keydown`, closeByKeydown);
  }

  function closeMainPinCard() {
    const previousCard = container.querySelector(`article.map__card`);
    if (previousCard) {
      previousCard.remove();
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
  };

})();
