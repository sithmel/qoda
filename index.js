var Heap = require('little-ds-toolkit/lib/heap')
var nonce = require('nonce')()
require('setimmediate')

function fifoPriority (a, b) {
  return a.ts - b.ts
}

function lifoPriority (b, a) {
  return a.ts - b.ts
}

function wrapData (data) {
  return { ts: nonce(), data: data }
}

function unwrapData (payload) {
  return payload.data
}

function Qoda (priorityFunction) {
  if (!(this instanceof Qoda)) {
    return new Qoda(priorityFunction)
  }

  priorityFunction = priorityFunction || fifoPriority
  this.heap = new Heap(priorityFunction)
}

Qoda.prototype.fetch = function fetch (func) {
  var data, f
  if (this.callback) throw new Error('A callback is already attached to the queue')
  this.callback = func

  if (this.size()) {
    f = this.callback
    data = unwrapData(this.heap.pop())
    this.callback = undefined
    setImmediate(function () {
      f(data)
    })
  }
}

Qoda.prototype.push = function push (data) {
  var func
  this.heap.push(wrapData(data))
  if (this.callback) {
    func = this.callback
    this.callback = undefined
    this.fetch(func)
  }
}

Qoda.prototype.size = function size () {
  return this.heap.size()
}

Qoda.prototype.toArray = function toArray () {
  var array = this.heap.popAll()
  this.heap.pushAll(array)
  return array.map(unwrapData)
}

Qoda.fifoPriority = fifoPriority
Qoda.lifoPriority = lifoPriority

module.exports = Qoda
