'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const EmbeddingSchema = new Schema(
  {
    text: {
      type: String
    },
    //Provisional ya que vectorSearch no adminte ObjectId
    botString: {
      type: String
    },
    embedding: {
      type: Array
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bot: {
      type: Schema.Types.ObjectId,
      ref: 'Bot'
    },
    upload: {
      type: Schema.Types.ObjectId,
      ref: 'Upload'
    },
  },
  {
    collection: 'embeddings'
  }
)

EmbeddingSchema.plugin(mongooseBeautifulUniqueValidation)

EmbeddingSchema.index({ botString: 1, company: 1, linked: 1, bot: 1, upload: 1, })

module.exports = mongoose.model('Embedding', EmbeddingSchema)