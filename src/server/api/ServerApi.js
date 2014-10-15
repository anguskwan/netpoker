/**
 * Server.
 * @module server
 */

var ApiServer = require("../../utils/ApiServer");

/**
 * A http api so the server can be queried from the outside world.
 * @class ServerApi
 */
function ServerApi(netPokerServer) {
	this.netPokerServer = netPokerServer;
	this.apiServer = new ApiServer();

	this.apiServer.registerHandler("info", this.onInfo.bind(this));
	this.apiServer.registerHandler("reloadTables", this.onReloadTables.bind(this));
}

/**
 * Info request.
 * @method onInfo
 */
ServerApi.prototype.onInfo = function(p) {
	return {
		state: "running"
	};
}

/**
 * Reload table data..
 * @method onInfo
 */
ServerApi.prototype.onReloadTables = function(p) {
	this.netPokerServer.getCashGameManager().reloadTables();

	return true;
}

/**
 * Listen to specified port.
 * @method listen
 */
ServerApi.prototype.listen = function(port) {
	this.apiServer.listen(port);
}

/**
 * Close.
 * @method close
 */
ServerApi.prototype.close = function() {
	this.apiServer.close();
}

/**
 * Can we handle this request?
 * @method canHandleRequest
 */
ServerApi.prototype.canHandleRequest = function(request) {
	return this.apiServer.canHandleRequest(request);
}

/**
 * Handle request.
 * @method handleRequest
 */
ServerApi.prototype.handleRequest = function(request, response) {
	this.apiServer.handleWebRequest(request, response);
}

/**
 * Require key.
 * @method setApiKey
 */
ServerApi.prototype.setApiKey = function(key) {
	this.apiServer.setAuthentication("key", key);
}

module.exports = ServerApi;