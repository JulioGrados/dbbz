'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const LogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    assesor: {
      type: String
    },
    content: {
      type: String
    },
    subType: {
      type: String
    },
    reference: {
      type: Schema.Types.ObjectId
    },
    model: {
      type: String,
      enum: [
        'Llamada',
        'Correo',
        'WhatsApp',
        'Recibo',
        'Progreso',
        'Usuario',
        'Venta',
        'Acuerdo',
        'Categoria',
        'Curso',
        'Voucher',
        'Plantilla',
        'Orden'
      ]
    }
  },
  {
    collection: 'logs'
  }
)

LogSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

LogSchema.index({
  user: 1,
  date: 1,
  type: 1
})

module.exports = mongoose.model('Log', LogSchema)
