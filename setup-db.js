'use strict'
const mongoose = require('mongoose')

const defaults = require('defaults')
const config = require('config')

let db = null

let host
if (config.mongo.env === 'production') {
  host = config.mongo.productionUrl
} else {
  host = config.mongo.localUrl
}


module.exports = config => {
  config = defaults(config, {
    host: host,
    database: 'bizeus',
    env: 'dev'
  })
  
  const { uri = `mongodb://${host}`, env, database } = config
  console.log('uri', uri)
  const opt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    dbName: database
  }

  let mongoServer

  const connect = async (env) => {
    console.log('connect')
    if (db) {
      return db
    }
    console.log('db initial', db)
    try {
      if (env === 'test') {
        console.log('1')
        const { MongoMemoryServer } = require('mongodb-memory-server')
        mongoServer = await MongoMemoryServer.create(); 
        const mongoUri = mongoServer.getUri();
        db = await mongoose.connect(mongoUri, opt)
        return db
      }
      console.log('2')
      db = await mongoose.connect(uri, opt)
    } catch (error) {
      const errorMenssage = {
        status: 500,
        menssage: 'Error de conexi�n con la base de datos',
        error
      }
      throw errorMenssage
    }

    mongoose.Promise = global.Promise
    return db
  }

  const close = async () => {
    if (env === 'test') {
      await mongoServer.stop()
    }
    if (db) {
      await db.disconnect()
      db = null
    }
  }

  return {
    connect,
    close
  }
}