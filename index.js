module.exports = async function promiseQueue(promises, numberWorkers) {
	const amountOfWork = promises.length,
		workers = [],
		results = [];

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
