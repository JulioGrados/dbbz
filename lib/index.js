'use strict'

const logDB = require('./log')
const userDB = require('./user')
const chatDB = require('./chat')
const messageDB = require('./message')
const whastsappDB = require('./whatsapp')
const metaDB = require('./meta')
const uploadDB = require('./upload')
const botDB = require('./bot')

module.exports = {
  logDB,
  userDB,
  chatDB,
  messageDB,
  whastsappDB,
  metaDB,
  uploadDB,
  botDB
}
