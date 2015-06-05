/**
 * Server.
 * @module server
 */

var TournamentState = require("./TournamentState");
var FinishedSpectator = require("./FinishedSpectator");
var inherits = require("inherits");
var Backend = require("../backend/Backend");
var ArrayUtil = require("../../utils/ArrayUtil");

/**
 * Finished state.
 * @class FinishedState
 */
function FinishedState() {
	TournamentState.call(this);
	this.canceled = false;
	this.cancelMessage = null;
	this.finishedSpectators = [];
	this.backendCallInProgress = false;
}

inherits(FinishedState, TournamentState);

/**
 * Set canceled.
 * @method setCanceled
 */
FinishedState.prototype.setCanceled = function(message) {
	this.canceled = true;
	this.cancelMessage = message;
}

/**
 * Run.
 * @method run
 */
FinishedState.prototype.run = function() {
	if (this.canceled) {
		backendCallInProgress = true;
		var p = {
			tournamentId: this.tournament.id,
			cancelMessage: this.cancelMessage
		}
		this.tournament.getBackend().call(Backend.TOURNAMENT_CANCEL, p).then(
			this.onFinishCallComplete.bind(this),
			this.onFinishCallError.bind(this)
		);
		return;
	}
}

/**
 * Finish call response.
 * @method onFinishCallComplete
 */
FinishedState.prototype.onFinishCallComplete = function(res) {
	this.backendCallInProgress = false;

	if (!this.finishedSpectators.length)
		this.trigger(TournamentState.CAN_UNLOAD);

	this.trigger(TournamentState.IDLE);
}

/**
 * Finish call response.
 * @method onFinishCallError
 */
FinishedState.prototype.onFinishCallError = function(err) {
	this.backendCallInProgress = false;

	console.log("WARNING! cancel tournament call failed: " + err);

	if (!this.finishedSpectators.length)
		this.trigger(TournamentState.CAN_UNLOAD);

	this.trigger(TournamentState.IDLE);
}

/**
 * Run.
 * @method run
 */
FinishedState.prototype.notifyNewConnection = function(protoConnection, user) {
	var finishedSpectator = new FinishedSpectator(this, protoConnection, user);
	finishedSpectator.on(FinishedSpectator.DONE, this.onFinishedSpectatorDone, this);
	this.finishedSpectators.push(finishedSpectator);
}

/**
 * Spectator done.
 * @method onFinishedSpectatorDone
 */
FinishedState.prototype.onFinishedSpectatorDone = function(ev) {
	var finishedSpectator = ev.target;

	finishedSpectator.off(FinishedSpectator.DONE, this.onFinishedSpectatorDone, this);
	ArrayUtil.remove(this.finishedSpectators, finishedSpectator);

	if (!this.finishedSpectators.length && !this.backendCallInProgress)
		this.trigger(TournamentState.CAN_UNLOAD);
}

/**
 * Are we idle?
 * @method isIdle
 */
FinishedState.prototype.isIdle = function() {
	if (this.backendCallInProgress)
		return false;

	else
		return true;
}

module.exports = FinishedState;