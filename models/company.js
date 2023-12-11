'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const CompanySchema = new Schema(
  {
    name: {
      type: String
    },
    businessName: {
      type: String,
      sparse: true,
      lowercase: true,
      unique: 'Ya existe una compañia con el mismo nombre.'
    },
    industry: {
      type: String
    },
    range: {
      type: String
    },
    product: {
      type: String
    },
    goals: [
      {
        type: String
      }
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    companyId: {
      type: Number
    },
    connections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Connection'
      }
    ]
  },
  {
    collection: 'companies'
  }
)

CompanySchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

CompanySchema.plugin(mongooseBeautifulUniqueValidation)

CompanySchema.index({
  businessName: 1
})

module.exports = mongoose.model('Company', CompanySchema)
