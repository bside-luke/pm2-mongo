const io = require('pmx');
const stats = require('./lib/stats');

const resolvePidPaths = (filepaths) => {
	if (typeof (filepaths) === 'number') return filepaths;

	const detect = (filepaths) => {
		let content = '';

		filepaths.some((filepath) => {
			try {
				content = fs.readFileSync(filepath);
			} catch (e) {
				return false;
			}
			return true;
		});

		return content.toString().trim();
	}

	const ret = parseInt(detect(filepaths));
	return isNaN(ret) ? null : ret;
};

io.initModule({
	widget: {
		pid: resolvePidPaths([
			'/var/run/mongodb.pid',
			'/var/run/mongodb/mongodb.pid'
		]),
		logo: 'https://raw.githubusercontent.com/pm2-hive/pm2-mongodb/master/pres/mongodb-logo.png',
		theme: ['#262E35', '#222222', '#3ff', '#3ff'],
		el: {
			probes: true,
			actions: true
		},
		block: {
			actions: false,
			issues: false,
			meta: true,
			main_probes: ['Insert', 'Query', 'Update', 'Delete', 'Command', 'netOut', 'netIn']
		}
	}
}, (_err, conf) => {
	stats.init(conf);
});
