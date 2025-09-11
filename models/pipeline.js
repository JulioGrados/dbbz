'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const PipelineSchema = new Schema(
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
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
  },
  {
    collection: 'pipelines'
  }
)

PipelineSchema.plugin(mongooseBeautifulUniqueValidation)

PipelineSchema.index({ name: 1, order: 1 })

module.exports = mongoose.model('Pipeline', PipelineSchema)