'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const StageSchema = new Schema(
  {
    name: {
        type: String
    },
    order: {
        type: Number
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    pipeline: {
        type: Schema.Types.ObjectId,
        ref: 'Pipeline'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
  },
  {
    collection: 'stages'
  }
)

StageSchema.plugin(mongooseBeautifulUniqueValidation)

StageSchema.index({ name: 1, pipeline: 1 })

module.exports = mongoose.model('Stage', StageSchema)