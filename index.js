'use strict'

const dbSetup = require('./setup-db')
const models = require('./lib')

const { handleFatalError } = require('utils').log

module.exports = config => {
  const db = dbSetup(config)

  return { models, db }
}

process.on('uncaughtException', error => handleFatalError(error, 'api:db'))
process.on('unhandledRejection', error => handleFatalError(error, 'api:db'))
