var ObjectUtil = require("../../utils/ObjectUtil");
var CashGameManager = require("../cashgame/CashGameManager");

/**
 * Poll for change in number of users.
 * @method PollNumPlayersRequestHandler
 */
function PollNumPlayersRequestHandler(netPokerServer, request, response, parameters) {
	this.netPokerServer = netPokerServer;
}

/**
 * Handle request.
 * @method handlerRequest
 */
PollNumPlayersRequestHandler.prototype.handleRequest = function(request, response, parameters) {
	this.request = request;
	this.response = response;
	this.parameters = parameters;

	this.referenceState = null;

	if (parameters.state)
		this.referenceState = JSON.parse(decodeURIComponent(parameters.state));

	var state = this.getCurrentState();

	console.log("reference state: " + this.referenceState);

	if (!ObjectUtil.equals(state, this.referenceState)) {
		console.log("PollNumPlayersRequestHandler: returning immediately");
		this.response.write(JSON.stringify(state));
		this.response.end();
		return;
	}

	this.netPokerServer.getCashGameManager().on(CashGameManager.NUM_PLAYERS_CHANGE, this.onNumPlayersChange, this);
	this.request.on("close", this.onRequestClose.bind(this));
}

/**
 * Number of players changed.
 * @method onNumPlayersChange
 * @private
 */
PollNumPlayersRequestHandler.prototype.onNumPlayersChange = function() {
	var state = this.getCurrentState();

	if (!ObjectUtil.equals(state, this.referenceState)) {
		console.log("PollNumPlayersRequestHandler: returning now...");

		this.netPokerServer.getCashGameManager().off(CashGameManager.NUM_PLAYERS_CHANGE, this.onNumPlayersChange, this);
		this.response.write(JSON.stringify(state));
		this.response.end();
		return;
	}
}

/**
 * Request was closed.
 * @method onRequestClose
 * @private
 */
PollNumPlayersRequestHandler.prototype.onRequestClose = function() {
	console.log("PollNumPlayersRequestHandler: request was closed");

	this.netPokerServer.getCashGameManager().off(CashGameManager.NUM_PLAYERS_CHANGE, this.onNumPlayersChange, this);
	this.response.end();
}

/**
 * Get current poll state.
 * @method getCurrentState
 */
PollNumPlayersRequestHandler.prototype.getCurrentState = function() {
	var tables = this.netPokerServer.getCashGameManager().getTables();
	var pollState = {};

	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];

		pollState[table.getId()] = table.getNumInGame();
	}

	return pollState;
}

module.exports = PollNumPlayersRequestHandler