'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const ContactSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true
    },
    names: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    mobile: {
      type: String
    },
    mobileCode: {
      default: 51,
      type: Number
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    dni: {
      type: String
    },
    document: {
      type: String,
      default: 'DNI',
      enum: ['DNI', 'Carné de Extranjería', 'Pasaporte', 'Otros', 'AR DNI', 'BO DNI', 'BR DNI', 'CL DNI', 'CO DNI', 'CR DNI', 'CU DNI', 'DO DNI', 'EC DNI', 'MX DNI', 'PA DNI', 'PY DNI', 'UY DNI', 'VE DNI', 'CC', 'CE', 'NIT', 'PASS']
    },
    password: {
      type: String
    },
    city: {
      type: String
    },
    department: {
      type: String
    },
    country: {
      type: String
    },
    photo: {
      type: String
    },
    token: {
      type: String
    },
    rol: {
      type: String,
      enum: [
        'Admin',
        'Contact',
        'Contact'
      ]
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact'
    },
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    collection: 'contacts'
  }
)

ContactSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ContactSchema.plugin(mongooseBeautifulUniqueValidation)

ContactSchema.index({
  username: 1,
  email: 1,
  names: 1
})

module.exports = mongoose.model('Contact', ContactSchema)
