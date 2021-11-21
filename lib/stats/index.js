const io = require('@pm2/io');

let metrics = {};

const initMetrics = () => {
	metrics.insert = io.metric({
		name: 'Insert',
		value: 'N/A'
	});

	metrics.query = io.metric({
		name: 'Query',
		value: 'N/A'
	});

	metrics.update = io.metric({
		name: 'Update',
		value: 'N/A'
	});

	metrics.deleted = io.metric({
		name: 'Delete',
		value: 'N/A'
	});

	metrics.netIn = io.metric({
		name: 'netIn',
		value: 'N/A'
	});
	metrics.netOut = io.metric({
		name: 'netOut',
		value: 'N/A'
	});

	metrics.conn = io.metric({
		name: 'Connections',
		value: 'N/A'
	});

	metrics.mapped = io.metric({
		name: 'Mapped',
		value: 'N/A'
	});

	metrics.vsize = io.metric({
		name: 'Vsize',
		value: 'N/A'
	});

	metrics.command = io.metric({
		name: 'Command',
		value: 'N/A'
	});

	metrics.replName = io.metric({
		name: 'Repl Name',
		value: 'N/A'
	});

	metrics.replStatus = io.metric({
		name: 'Repl Status',
		value: 'N/A'
	});
};

const refreshMetrics = (provider, refresh_rate) => provider.refresh(metrics, refresh_rate)

const init = (conf) => {
	const refresh_rate = process.env.PM2_MONGO_REFRESH_RATE || conf.refresh_rate || 5000;
	initMetrics();

	const provider = require('./client');

	provider.init(conf, function (err) {
		if (err) {
			throw err;
		}
		setInterval(refreshMetrics.bind(this, provider, refresh_rate), refresh_rate);
		refreshMetrics(provider);
	});
};

module.exports = { init };