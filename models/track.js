'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const TrackSchema = new Schema(
  {
    typeMsg: {
        type: String,
        enum: ['create', 'resolved']
    },
    assigned: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    linked: {
        type: Schema.Types.ObjectId,
        ref: 'Contact'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    date: {
        type: Date,
        default: Date.now
    },
    channel: {
        type: String,
        default: 'Whatsapp'
    },
    connection: {
        type: Schema.Types.ObjectId,
        ref: 'Connection'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
  },
  {
    collection: 'tracks'
  }
)

TrackSchema.plugin(timestamp, {
    createdAt: { index: true },
    updatedAt: { index: true }
})

TrackSchema.plugin(mongooseBeautifulUniqueValidation)

TrackSchema.index({
    typeMsg: 1
})

module.exports = mongoose.model('Track', TrackSchema)