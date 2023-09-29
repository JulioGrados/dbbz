'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const ChatSchema = new Schema(
  {
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    assigned: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    mobile: {
      type: String
    },
    mobileCode: {
      type: String
    },
    lastMessage: {
      type: String
    },
    lastChannel: {
      type: String
    },
    lastMessageType: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    channel: {
      type: String,
      default: 'Whatsapp'
    }
  },
  {
    collection: 'chats'
  }
)

ChatSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ChatSchema.index({
  linked: 1,
  status: 1
})

module.exports = mongoose.model('Chat', ChatSchema)
