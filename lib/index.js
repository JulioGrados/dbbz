'use strict'

const logDB = require('./log')
const userDB = require('./user')
const chatDB = require('./chat')
const messageDB = require('./message')
const whastsappDB = require('./whatsapp')
const metaDB = require('./meta')
const uploadDB = require('./upload')
const botDB = require('./bot')
const companyDB = require('./company')
const connectionDB = require('./connection')
const contactDB = require('./contact')
const embeddingDB = require('./embedding')
const teamDB = require('./team')

module.exports = {
  logDB,
  userDB,
  chatDB,
  messageDB,
  whastsappDB,
  metaDB,
  uploadDB,
  botDB,
  companyDB,
  connectionDB,
  contactDB,
  embeddingDB,
  teamDB
}
