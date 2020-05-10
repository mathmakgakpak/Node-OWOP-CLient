'use strict';
import { EVENTS as e, protocol } from './conf.js';
import { eventSys, PublicAPI } from './global.js';

export const net = {
	currentServer: null,
	protocol: null,
	isConnected: isConnected,
	connect: connect
};

PublicAPI.net = net;

export function isConnected() {
	return net.protocol !== null && net.protocol.isConnected();
}

export function connect(server, worldName) {
	eventSys.emit(e.net.connecting, server);
	net.connection = new WebSocket(server.url);
	net.connection.binaryType = "arraybuffer";
	net.currentServer = server;
	net.protocol = new server.proto.class(net.connection, worldName);
}
