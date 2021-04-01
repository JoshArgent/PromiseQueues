# Promise Queues

![npm](https://img.shields.io/npm/v/promise-queues)
![npm bundle size](https://img.shields.io/bundlephobia/min/promise-queues)

A light-weight implementation of asynchronous worker queues using JS promises.

## Install

```shell
npm install promise-queues
```

## Usage

```javascript
const promiseQueue = require('promise-queues');

function myPromise(i) {
	return new Promise((resolve, reject) =>
		setTimeout(() => resolve('done ' + i), 200)
	);
}

// Define the work as an array of functions that create promises.
const work = [() => myPromise(1), () => myPromise(2), () => myPromise(3)];

// Start processing the promise queue using 2 workers.
promiseQueue(work, 2)
	.then(result => console.log(result))
	.catch(err => console.log(error));
```

Result:

```json
["done 1", "done 2", "done 3"]
```
