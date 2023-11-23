'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const BotSchema = new Schema(
  {
    apiKey: {
      type: String
    },
    model: {
      type: String
    },
    phoneNoId: {
      type: String
    },
    name: {
      type: String,
      sparse: true,
      lowercase: true,
      required: [true, 'Debes agregar tus nombres.']
    },
    supplier: {
      type: String
    },
    social: {
      type: String
    },
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    upload: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
      }
    ]
  },
  {
    collection: 'bots'
  }
)

BotSchema.plugin(timestamp, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

BotSchema.plugin(mongooseBeautifulUniqueValidation)

BotSchema.index({
  name: 1,
  linked: 1
})

module.exports = mongoose.model('Bot', BotSchema)