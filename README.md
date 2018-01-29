qoda
====
A queue implementation for accessing shared resources. It works for both node and browser.

Using the library
-----------------
You can import the library from npm and require it:
```js
var Qoda = require('qoda');
```
You can create an instance with:
```js
var qoda = new Qoda();
// or just Qoda()
var qoda = Qoda();
```
You can push data in the queue with:
```js
qoda.push(data);
```
and fetch data with:
```js
qoda.fetch(function (data) {
  // make use of data
});
```
Fetch is asynchronous. If the queue is not empty, it calls the callback with the item at the head of the queue.
If no item is available, it will wait until is available and then calls the callback.

The idea is that there will always be a single consumer of the queue (but many publishers). The consumer subscribes to the queue (with fetch). As soon as it gets something back it will perform some operation and it will go back fetching new data when necessary.
