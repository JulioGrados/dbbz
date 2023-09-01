'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const WhatsappSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    assigned: {
      username: {
        type: String
      },
      ref: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    linked: {
      names: {
        type: String
      },
      ref: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    content: {
      type: String
    },
    deal: {
      type: Schema.Types.ObjectId,
      ref: 'Deal'
    },
    template: {
      name: {
        type: String
      },
      ref: {
        type: Schema.Types.ObjectId,
        ref: 'Template'
      }
    },
    kind: {
      type: String,
      default: 'whatsApp'
    },
    isCompleted: {
      type: Boolean,
      default: true
    },
    uuid: {
      type: String
    },
    phone: {
      type: String
    },
    code: {
      type: String
    },
    contact: {
      type: String
    },
    status: {
      type: String,
      enum: [
        'En cola',
        'Enviado',
        'Entregado',
        'Leído',
        'Rechazado'
      ]
    }
  },
  {
    collection: 'whatsapps'
  }
)

WhatsappSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

WhatsappSchema.index({
  assigned: 1,
  linked: 1,
  'linked.ref': 1,
  template: 1,
  date: 1
})

module.exports = mongoose.model('Whatsapp', WhatsappSchema)
