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
    // ── Identidad WhatsApp 2026 ──────────────────────────────────────────────
    // WhatsApp dejó de garantizar el teléfono como identificador único:
    //  · WAHA/NOWEB entrega @lid (identificador oculto) cuando el número no está
    //    en la agenda del teléfono ni comparten grupo.
    //  · Cloud API entrega BSUID (user_id) siempre, y omite wa_id/from si el
    //    usuario activó username y no hubo interacción en los últimos 30 días.
    // Guardarlos permite reconocer al mismo contacto aunque falte `mobile`.
    lid: {
      type: String // Solo dígitos, sin el sufijo @lid (ej. '234175038754968')
    },
    waUserId: {
      type: String // BSUID de Cloud API (ej. 'PE.13491208655302741918')
    },
    waUsername: {
      type: String // Username público de WhatsApp, sin @
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
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    connection: {
      type: Schema.Types.ObjectId,
      ref: 'Connection'
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ]
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

// Búsqueda del contacto por teléfono dentro de la empresa: es la consulta que
// hace CADA mensaje entrante de todos los canales.
ContactSchema.index(
  { company: 1, mobile: 1 },
  { name: 'company_mobile' }
)

// Búsqueda por identificadores alternos de WhatsApp (ver campos lid/waUserId).
// Parciales: solo indexan los documentos que sí tienen el identificador, así no
// crecen con los millones de contactos que solo tienen teléfono.
ContactSchema.index(
  { company: 1, lid: 1 },
  { name: 'company_lid', partialFilterExpression: { lid: { $exists: true } } }
)

ContactSchema.index(
  { company: 1, waUserId: 1 },
  { name: 'company_waUserId', partialFilterExpression: { waUserId: { $exists: true } } }
)

module.exports = mongoose.model('Contact', ContactSchema)
