'use strict'

const t = require('tap')
const test = t.test
const request = require('request')
const http = require('http')
const fastify = require('..')()
const server = http.createServer(fastify)

test('fastify.register', t => {
  t.plan(7)
  try {
    fastify.register(function (instance, opts, done) {
      t.type(instance, fastify)
      t.is(typeof opts, 'object')
      t.is(typeof done, 'function')

      instance.get('/first', function (req, reply) {
        reply(null, 200, { hello: 'world' })
      })
      done()
    })
    fastify.register(function (instance, opts, done) {
      t.type(instance, fastify)
      t.is(typeof opts, 'object')
      t.is(typeof done, 'function')

      instance.get('/second', function (req, reply) {
        reply(null, 200, { hello: 'world' })
      })
      done()
    })

    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('fastify.register array', t => {
  t.plan(7)

  const route1 = function (instance, opts, done) {
    t.type(instance, fastify)
    t.is(typeof opts, 'object')
    t.is(typeof done, 'function')

    instance.get('/third', function (req, reply) {
      reply(null, 200, { hello: 'world' })
    })
    done()
  }

  const route2 = function (instance, opts, done) {
    t.type(instance, fastify)
    t.is(typeof opts, 'object')
    t.is(typeof done, 'function')

    instance.get('/fourth', function (req, reply) {
      reply(null, 200, { hello: 'world' })
    })
    done()
  }

  try {
    fastify.register([route1, route2])
    t.pass()
  } catch (e) {
    t.fail()
  }
})

server.listen(0, err => {
  t.error(err)
  server.unref()

  makeRequest('first')
  makeRequest('second')
  makeRequest('third')
  makeRequest('fourth')
})

function makeRequest (path) {
  test('fastify.register - request get', t => {
    t.plan(4)
    request({
      method: 'GET',
      uri: 'http://localhost:' + server.address().port + '/' + path
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['content-length'], '' + body.length)
      t.deepEqual(JSON.parse(body), { hello: 'world' })
    })
  })
}
