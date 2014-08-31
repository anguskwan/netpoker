var CardData = require("../data/CardData");

/**
 * @class SeatInfoMessage
 */
function PocketCardsMessage() {
	this.animate = false;
	this.cards = [];
	this.firstIndex = 0;
	this.seatIndex = 0;
}

PocketCardsMessage.TYPE = "pocketCards";

/**
 * Get card data.
 */
PocketCardsMessage.prototype.getCards = function() {
	return this.cards;
}

/**
 * Get first index.
 */
PocketCardsMessage.prototype.getFirstIndex = function() {
	return this.firstIndex;
}

/**
 * Get seat index.
 */
PocketCardsMessage.prototype.getSeatIndex = function() {
	return this.seatIndex;
}

/**
 * Un-serialize.
 * @method unserialize.
 */
PocketCardsMessage.prototype.unserialize = function(data) {
	var i;

	this.animate = data.animate;
	this.firstIndex = parseInt(data.firstIndex);
	this.cards = [];
	this.seatIndex = data.seatIndex;

	for (i = 0; i < data.cards.length; i++)
		this.cards.push(new CardData(data.cards[i]));
}

/**
 * Serialize message.
 * @method serialize
 */
PocketCardsMessage.prototype.serialize = function() {
	var cards = [];

	for (i = 0; i < this.cards.length; i++)
		cards.push(this.cards[i].getValue());

	return {
		animate: this.seatIndex,
		firstIndex: this.firstIndex,
		cards: cards,
		seatIndex: this.seatIndex
	};
}

module.exports = PocketCardsMessage;