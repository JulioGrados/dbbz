'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const TeamSchema = new Schema(
  {
    name: {
      type: String
    },
    color: {
      type: String
    },
    auto: {
      type: Boolean,
      default: false
    },
    isRemove: {
      type: Boolean,
      default: true
    },
    users: [
      {
        auto: {
          type: Boolean,
          default: false
        },
        ref: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    collection: 'teams'
  }
)

TeamSchema.plugin(timestamp, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

TeamSchema.plugin(mongooseBeautifulUniqueValidation)

TeamSchema.index({
  name: 1
})

module.exports = mongoose.model('Team', TeamSchema)