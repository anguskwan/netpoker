var Backend = require("../../src/js/server/backend/Backend");
var http = require("http");
var url = require("url");

/**
 * Backend with static data.
 */
function MockBackendServer() {}

/**
 * Set listen port.
 */
MockBackendServer.prototype.setListenPort = function(port) {
	this.listenPort = port;
}

/**
 * Handle method.
 */
MockBackendServer.prototype.handleMethod = function(method, params) {
	switch (method) {
		case Backend.GET_USER_INFO_BY_TOKEN:
			switch (params.token) {
				case "user1":
					return {
						id: "101",
						name: "olle"
					};

				case "user2":
					return {
						id: "102",
						name: "kalle"
					};

				case "user3":
					return {
						id: "103",
						name: "pelle"
					};

				case "user4":
					return {
						id: "104",
						name: "lisa"
					};
			}

		case Backend.GET_TABLE_LIST:
			return {
				"tables": [{
					id: 123,
					numseats: 10,
					currency: "PLY",
					name: "Test Table",
					minSitInAmount: 10,
					maxSitInAmount: 100
				}]
			};
	}
}

/**
 * Handle get.
 */
MockBackendServer.prototype.onRequest = function(request, response) {
	console.log("MockBackend request: " + request.url);
	var urlParts = url.parse(request.url, true);

	//console.log(urlParts);

	var method = urlParts.pathname;
	method = method.replace(/^\/*/, "");
	method = method.replace(/\/*$/, "");

	var result = this.handleMethod(method, urlParts.query);

	if (result)
		response.write(JSON.stringify(result));

	response.end();
}

/**
 * Start.
 */
MockBackendServer.prototype.start = function() {
	//console.log("start...");
	this.server = http.createServer();
	this.server.listen(this.listenPort);
	this.server.on("request", this.onRequest.bind(this));
}

/**
 * Close.
 */
MockBackendServer.prototype.close = function() {
	this.server.close();
}

module.exports = MockBackendServer;