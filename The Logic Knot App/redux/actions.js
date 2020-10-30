let cardIndex = 0;
/* Actions */

export function addCard(side, cardID, cardName, cardPrice, cardSet) {
  return { type: 'addCard' + side, index: cardIndex++, id: cardID,  name: cardName, price: cardPrice, set: cardSet}
}

export function deleteCard(cardIndex) {
  return { type: 'deleteCard', index: cardIndex}
}

export function changePrice(cardIndex, cardName, cardPrice, cardSet) {
  return { type: 'changeCard', index: cardIndex,  name: cardName, price: cardPrice, set: cardSet}
}
