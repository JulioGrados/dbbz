'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const TagSchema = new Schema(
  {
    name: {
      type: String
    },
    color: {
      type: String
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    collection: 'tags'
  }
)

TagSchema.plugin(timestamp, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

TagSchema.plugin(mongooseBeautifulUniqueValidation)

TagSchema.index({
  name: 1
})

module.exports = mongoose.model('Tag', TagSchema)