'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const MessageSchema = new Schema(
  {
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
    senderId: {
      type: String
    },
    typeMsg: {
      type: String,
      enum: ['text', 'image', 'video', 'document', 'extendedText', 'quoted', 'audio', 'note']
    },
    chatId: {
      type: String
    },
    idMessage: {
      type: String
    },
    text: {
      type: String
    },
    image: {
      type: String
    },
    url: {
      type: String
    },
    name: {
      type: String
    },
    transmitter: {
      type: Boolean,
      default: false
    },
    wamid: {
      type: String
    },
    phoneNoId: {
      type: String
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['received', 'sent', 'delivered', 'read', 'error'],
      default: 'received'
    },
    channel: {
      type: String,
      default: 'Whatsapp'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    connection: {
      type: Schema.Types.ObjectId,
      ref: 'Connection'
    }
  },
  {
    collection: 'messages'
  }
)

MessageSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

MessageSchema.index({
  linked: 1,
  status: 1
})

module.exports = mongoose.model('Message', MessageSchema)
