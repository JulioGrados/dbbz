'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const TimelineSchema = new Schema(
  {
    name: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    linked: {
        type: Schema.Types.ObjectId,
        ref: 'Contact'
    },
        assigned: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pipeline: {
        type: Schema.Types.ObjectId,
        ref: 'Pipeline'
    },
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
  },
  {
    collection: 'timelines'
  }
)

TimelineSchema.plugin(mongooseBeautifulUniqueValidation)

TimelineSchema.index({ name: 1, pipeline: 1, stage: 1 })

module.exports = mongoose.model('Timeline', TimelineSchema)