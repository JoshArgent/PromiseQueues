module.exports = async function promiseQueue(promises, numberWorkers) {
	const amountOfWork = promises.length,
		workers = [],
		results = [];

	if (numberWorkers <= 0) throw new Error('Need to use at least one worker.');

	for (let i = 0; i < numberWorkers; i++) {
		workers.push(worker(promises, results, amountOfWork));
	}

	await Promise.all(workers);

	return results;
};

async function worker(work, results, amountOfWork) {
	while (work.length > 0) {
		const index = amountOfWork - work.length,
			promise = work.shift();

		try {
			results[index] = await promise();
		} catch (err) {
			throw err;
		}
	}
}
