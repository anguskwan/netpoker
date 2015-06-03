/**
 * Server.
 * @module server
 */

var EventDispatcher = require("yaed");
var inherits = require("inherits");
var User = require("../user/User");

/**
 * A tournament is considered idle when there is no tournament ongoing,
 * the tournament does not manage any money, etc.
 * There might still be spectators connected to a tournament, however.
 * When there are no spectators the tournament will dispach as CAN_UNLOAD
 * event.
 * @class Tournament
 */
function Tournament(data) {
	EventDispatcher.call(this);

	if (!data.id) throw new Error("id missing");

	this.id = data.id;

	this.users = [];

	if (data.users) {
		for (var i = 0; i < data.users.length; i++) {
			var u = new User(data.users[i]);
			this.addUser(u);
		}
	}
}

inherits(Tournament, EventDispatcher);

/**
 * Dispatched when the tournament becomes idle.
 * @event Tournament.IDLE
 */
Tournament.IDLE = "idle";

/**
 * Dispatched when the tournament can unload itself,
 * i.e. it is idle and there are no spectators.
 * @event Tournament.CAN_UNLOAD
 */
Tournament.CAN_UNLOAD = "canUnload";

/**
 * Get id.
 * @method getId
 */
Tournament.prototype.getId = function() {
	return this.id;
}

/**
 * Is this user registered?
 * @method isUserRegistered
 */
Tournament.prototype.isUserRegistered = function(u) {
	for (var i = 0; i < this.users.length; i++)
		if (this.users[i].getId() == u.getId())
			return true;

	return false;
}

/**
 * Add a user.
 * @method addUser
 */
Tournament.prototype.addUser = function(u) {
	if (this.isUserRegistered(u))
		return;

	this.users.push(u);
}

/**
 * Remove a user.
 * @method addUser
 */
Tournament.prototype.removeUser = function(u) {
	if (!this.isUserRegistered(u))
		return;

	for (var i = 0; i < this.users.length; i++)
		if (this.users[i].getId() == u.getId()) {
			this.users.splice(i, 1);
			return;
		}
}

module.exports = Tournament;