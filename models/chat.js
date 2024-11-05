'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const ChatSchema = new Schema(
  {
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'Contact'
    },
    assigned: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    mobile: {
      type: String
    },
    names: {
      type: String
    },
    mobileCode: {
      type: String
    },
    lastMessage: {
      type: String
    },
    previousMessage: {
      type: String
    },
    previousMessageType: {
      type: String
    },
    lastChannel: {
      type: String
    },
    lastMessageType: {
      type: String
    },
    lastMessageStatus: {
      type: String,
      enum: ['received', 'sent', 'delivered', 'read'],
      default: 'received'
    },
    read: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    phoneNoId: {
      type: String
    },
    auto: {
      type: Boolean,
      default: false
    },
    country: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
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
    },
    bot: {
      type: Schema.Types.ObjectId,
      ref: 'Bot'
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    name: {
      type: String,
      enum: [
        'whatsapp-cloud-api',
        'whatsapp-qr',
        'instagram'
      ]
    },
    option: {
      type: String,
      enum: [
        'abiertos',
        'resueltos',
        'espera',
        'outside'
      ],
      default: 'abiertos'
    },
    status: {
      type: String,
      enum: [
        'initial',
        'assigned',
        'notAssigned'
      ]
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ]
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