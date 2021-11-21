const io = require('pmx');

const probe = io.probe();

let metrics = {};

const initMetrics = () => {
	metrics.insert = probe.metric({
		name: 'Insert',
		value: 'N/A'
	});

	metrics.query = probe.metric({
		name: 'Query',
		value: 'N/A'
	});

	metrics.update = probe.metric({
		name: 'Update',
		value: 'N/A'
	});

	metrics.deleted = probe.metric({
		name: 'Delete',
		value: 'N/A'
	});

	metrics.netIn = probe.metric({
		name: 'netIn',
		value: 'N/A'
	});
	metrics.netOut = probe.metric({
		name: 'netOut',
		value: 'N/A'
	});

	metrics.conn = probe.metric({
		name: 'Connections',
		value: 'N/A'
	});

	metrics.mapped = probe.metric({
		name: 'Mapped',
		value: 'N/A'
	});

	metrics.vsize = probe.metric({
		name: 'Vsize',
		value: 'N/A'
	});

	metrics.command = probe.metric({
		name: 'Command',
		value: 'N/A'
	});

	metrics.replName = probe.metric({
		name: 'Repl Name',
		value: 'N/A'
	});

	metrics.replStatus = probe.metric({
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