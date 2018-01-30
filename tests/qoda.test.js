/* eslint-env node, mocha */
var assert = require('chai').assert
var Qoda = require('..')

describe('Qoda', function () {
  it('can be instantiated', function () {
    assert.typeOf(Qoda, 'function')
    assert.instanceOf(new Qoda(), Qoda)
    assert.instanceOf(Qoda(), Qoda)
  })

  it('can receive data, and returns in default order', function (done) {
    var qoda = Qoda()
    qoda.push(1)
    qoda.push(2)
    qoda.push(3)
    assert.equal(qoda.size(), 3)
    qoda.fetch(function (data) {
      assert.equal(data, 1)
      qoda.fetch(function (data) {
        assert.equal(data, 2)
        qoda.fetch(function (data) {
          assert.equal(data, 3)
          assert.equal(qoda.size(), 0)
          done()
        })
      })
    })
  })

  it('should call the callback when queue empty', function (done) {
    var qoda = Qoda()
    qoda.fetch(function (data) {
      assert.equal(data, 'ok')
      done()
    })

    qoda.push('ok')
  })

  it('should call the callback when queue empty, twice', function (done) {
    var qoda = Qoda()
    qoda.fetch(function (data) {
      assert.equal(data, 'ok')
    })

    qoda.push('ok')

    qoda.fetch(function (data) {
      assert.equal(data, 'ok2')
      done()
    })

    qoda.push('ok2')
  })

  it('can return array', function () {
    var qoda = Qoda()
    qoda.push(3)
    qoda.push(1)
    qoda.push(2)
    assert.deepEqual(qoda.toArray(), [3, 1, 2])
  })

  it('can use different priorities', function () {
    var qoda = Qoda(Qoda.lifoPriority)
    qoda.push(3)
    qoda.push(1)
    qoda.push(2)
    assert.deepEqual(qoda.toArray(), [2, 1, 3])
  })

  it('sets custom priority', function () {
    var qoda = Qoda(function (a, b) {
      var pa = a.data.priority || 0
      var pb = b.data.priority || 0
      if (pa === pb) {
        return a.ts - b.ts
      } else {
        return pb - pa
      }
    })

    qoda.push({ v: '1', priority: 1 })
    qoda.push({ v: '2' })
    qoda.push({ v: '3', priority: 1 })
    assert.deepEqual(qoda.toArray(),
      [
        { v: '1', priority: 1 },
        { v: '3', priority: 1 },
        { v: '2' }
      ])
  })
})
