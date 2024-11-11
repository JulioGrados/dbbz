'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const QueueSchema = new Schema(
  {
    shortcut: {
        type: String
    },
    message: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    teams: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Team'
        }
    ],
  },
  {
    collection: 'queues'
  }
)

QueueSchema.plugin(timestamp, {
    createdAt: { index: true },
    updatedAt: { index: true }
})

QueueSchema.plugin(mongooseBeautifulUniqueValidation)

QueueSchema.index({
    shortcut: 1
})

module.exports = mongoose.model('Queue', QueueSchema)