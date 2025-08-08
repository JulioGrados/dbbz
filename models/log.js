'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const LogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    connection: {
      type: Schema.Types.ObjectId,
      ref: 'Connection'
    },
    content: {
      type: String
    },
    reference: {
      type: Schema.Types.ObjectId
    },
    model: {
      type: String,
      enum: [
        'Bot',
        'Chat',
        'Company',
        'Connection',
        'Contact',
        'Embedding',
        'Message',
        'Queue',
        'Tag',
        'Team',
        'Upload',
        'User'
      ]
    }
  },
  {
    collection: 'logs'
  }
)

LogSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

LogSchema.index({
  user: 1,
  date: 1,
  type: 1
})

module.exports = mongoose.model('Log', LogSchema)
