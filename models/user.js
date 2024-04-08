'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      sparse: true,
      unique: 'Ya existe un usuario con el mismo username.',
    },
    names: {
      type: String,
      required: [true, 'Debes agregar tus nombres.']
    },
    email: {
      type: String,
      lowercase: true,
      unique: 'Ya existe una cuenta que tiene el mismo email.',
      required: [true, 'Debes agregar un email.'],
      sparse: true
    },
    mobile: {
      type: String,
      unique: 'Ya existe una cuenta que tiene el mismo número de celular.',
      sparse: true
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
      type: String,
      unique: 'Ya existe un usuario con el mismo DNI.',
      sparse: true
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
    tokenRecover: {
      type: String
    },
    rol: {
      type: String,
      enum: [
        'Admin',
        'User',
        'Contact'
      ]
    },
    rolCompany: {
      type: String,
      enum: [
        'Gerente',
        'C-Level',
        'Jefatura',
        'Líder de Equipo',
        'Colaborador'
      ]
    },
    phoneNoId: {
      type: String
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    seeAll: {
      type: Boolean,
      default: true
    },
    isSend: {
      type: Boolean,
      default: false
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    notification: {
      number: {
        type: Number
      },
      read: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    collection: 'users'
  }
)

UserSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

UserSchema.plugin(mongooseBeautifulUniqueValidation)

UserSchema.index({
  username: 1,
  email: 1,
  names: 1
})

module.exports = mongoose.model('User', UserSchema)
