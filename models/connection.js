'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const ConnectionSchema = new Schema(
  {
    name: {
      type: String,
      enum: [
        'whatsapp-cloud-api',
        'whatsapp-qr',
        'instagram',
        'facebook-messenger'
      ]
    },
    phoneNoId: {
      type: String
    },
    idInstance: {
      type: Number
    },
    key: {
      type: String
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    chatbot: {
      type: Schema.Types.ObjectId,
      ref: 'Bot'
    },
    isReady: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'notAuthorized'
    },
    greetingMsg: {
      type: String
    },
    mobile: {
      type: String
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    webhook: {
      type: String
    },
    facebookUserId: {
      type: String
    },
    facebookUserToken: {
      type: String
    },
    facebookPageUserId: {
      type: String
    },
    tokenMeta: {
      type: String
    },
  },
  {
    collection: 'connections'
  }
)

ConnectionSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ConnectionSchema.plugin(mongooseBeautifulUniqueValidation)

ConnectionSchema.index({
  name: 1
})

module.exports = mongoose.model('Connection', ConnectionSchema)
