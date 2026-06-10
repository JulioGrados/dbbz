'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const ScheduledMessageSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    connection: {
      type: Schema.Types.ObjectId,
      ref: 'Connection'
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    typeMsg: {
      type: String,
      enum: ['text', 'image', 'video', 'document', 'audio']
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    sentAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'sent', 'error', 'cancelled'],
      default: 'pending'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  {
    collection: 'scheduledmessages'
  }
)

ScheduledMessageSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ScheduledMessageSchema.index({
  status: 1,
  scheduledAt: 1
})

ScheduledMessageSchema.index({
  company: 1,
  chat: 1
})

module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema)
