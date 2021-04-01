const promiseQueue = require('../index.js');

const testPromise = value => {
	return new Promise((resolve, reject) => resolve(value));
};

const testRejectedPromise = value => {
	return new Promise((resolve, reject) => reject(value));
};

describe('promiseQueue', () => {
	it('should resolve immediately when given an empty array', async () => {
		// Given
		const work = [];

		// When
		const result = await promiseQueue(work, 2);

		// Then
		expect(result).toEqual([]);
	});

	it('should reject when there are no workers', async () => {
		// Given
		const work = [
			() => testPromise('A'),
			() => testPromise('B'),
			() => testPromise('C'),
		];

		// When
		let error;
		try {
			await promiseQueue(work, 0);
		} catch (err) {
			error = err;
		}

		// Then
		expect(error.message).toEqual('Need to use at least one worker.');
	});

	it('should resolve correctly when there are more workers than work', async () => {
		// Given
		const work = [() => testPromise('A'), () => testPromise('B')];

		// When
		const result = await promiseQueue(work, 5);

		// Then
		expect(result).toEqual(['A', 'B']);
	});

	it('should resolve correctly when there are less workers than work', async () => {
		// Given
		const work = [
			() => testPromise('A'),
			() => testPromise('B'),
			() => testPromise('C'),
			() => testPromise('D'),
			() => testPromise('E'),
			() => testPromise('F'),
			() => testPromise('G'),
			() => testPromise('H'),
			() => testPromise('I'),
		];

		// When
		const result = await promiseQueue(work, 4);

		// Then
		expect(result).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
	});

	it('should reject entirely if one promise rejects', async () => {
		// Given
		const work = [
			() => testPromise('A'),
			() => testPromise('B'),
			() => testPromise('C'),
			() => testPromise('D'),
			() => testPromise('E'),
			() => testRejectedPromise('an error'),
			() => testPromise('G'),
			() => testPromise('H'),
			() => testPromise('I'),
		];

		// When
		let error;
		try {
			await promiseQueue(work, 4);
		} catch (err) {
			error = err;
		}

		// Then
		expect(error).toEqual('an error');
	});
});
