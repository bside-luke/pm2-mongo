const MongoClient = require('mongodb').MongoClient;

let client;

const refresh = () => client.serverStatus().then(data => {
		metrics.mapped.set(data.mem.mapped);
		metrics.vsize.set(data.mem.virtual);
		metrics.conn.set(data.connections.current);

		if (typeof lastInsert !== 'undefined') {
			metrics.insert
				.set(Math.round((data.opcounters.insert - lastInsert) * 1000 / refresh_rate));
			metrics.query
				.set(Math.round((data.opcounters.query - lastQuery) * 1000 / refresh_rate));
			metrics.update
				.set(Math.round((data.opcounters.update - lastUpdate) * 1000 / refresh_rate));
			metrics.deleted
				.set(Math.round((data.opcounters.delete - lastDelete) * 1000 / refresh_rate));
			metrics.command
				.set(Math.round((data.opcounters.command - lastCommand) * 1000 / refresh_rate));
			metrics.netIn
				.set(Math.round((data.network.bytesIn - lastBytesIn) * 1000 / refresh_rate));
			metrics.netOut
				.set(Math.round((data.network.bytesOut - lastBytesOut) * 1000 / refresh_rate));
		}
		lastInsert = data.opcounters.insert;
		lastQuery = data.opcounters.query;
		lastUpdate = data.opcounters.update;
		lastDelete = data.opcounters.delete;
		lastCommand = data.opcounters.command;
		lastBytesIn = data.network.bytesIn;
		lastBytesOut = data.network.bytesOut;

		if (data.repl) {
			metrics.replName.set(data.repl.setName);
			if (data.repl.ismaster)
				metrics.replStatus.set("PRIMARY");
			else if (data.repl.secondary)
				metrics.replStatus.set("SECONDARY");
			else
				metrics.replStatus.set("UNKNOWN");
		}
});

const init = (conf, done) => {
	console.log(conf);
	const dbName = process.env.MONGO_DBNAME || conf.authDB;
	const host = process.env.MONGO_HOST || conf.ip;
	const port = process.env.MONGO_PORT || conf.port;
	const username = process.env.MONGO_USERNAME || conf.username;
	const password = process.env.MONGO_PASSWORD || conf.password;
	let login = '';

	if (username && password) {
		login = username + ':' + password + '@';
	}
	var url = 'mongodb://' + login + host + ':' + port + '/' + dbName;

	MongoClient.connect(url).then(function (db) {
		client = db.admin();
		done();
	}).catch(function (err) {
		done(err);
	});
};

module.exports = { refresh, init };
