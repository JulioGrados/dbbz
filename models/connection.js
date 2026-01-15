'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const ConnectionSchema = new Schema(
  {
    name: {
      type: String,
    },
    channel: {
      type: String
    },
    phoneNoId: {
      type: String
    },
    idInstance: {
      type: Number
    },
    key: {
      type: String
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    chatbot: {
      type: Schema.Types.ObjectId,
      ref: 'Bot'
    },
    isReady: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'NonStatus'
    },
    greetingMsg: {
      type: String
    },
    mobile: {
      type: String
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    webhook: {
      type: String
    },
    facebookUserId: {
      type: String
    },
    facebookUserToken: {
      type: String
    },
    facebookPageUserId: {
      type: String
    },
    tokenMeta: {
      type: String
    },

    // ==================== CAMPOS WAHA ====================

    // Identificador de sesión en WAHA
    sessionName: {
      type: String,
      sparse: true  // Permite nulls, solo índice si tiene valor
    },

    // API Key de WAHA (puede ser por empresa o global)
    wahaApiKey: {
      type: String
    },

    // URL del servidor WAHA
    wahaBaseUrl: {
      type: String,
      default: 'https://appbizeus-waha-prod.m1imp2.easypanel.host'
    },

    // Webhook configurado en WAHA (para validación)
    wahaWebhookUrl: {
      type: String
    },

    // Metadata de la sesión WAHA
    wahaMeta: {
      engine: String,        // 'NOWEB', 'WEBJS', etc.
      phoneNumber: String,   // Número autenticado
      platform: String,      // 'android', 'iphone', etc.
      pushName: String,      // Nombre de perfil
      wid: String            // WhatsApp ID
    }
  },
  {
    collection: 'connections'
  }
)

ConnectionSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ConnectionSchema.plugin(mongooseBeautifulUniqueValidation)

ConnectionSchema.index({
  name: 1
})

// Índices para WAHA
ConnectionSchema.index({ company: 1, sessionName: 1 })
ConnectionSchema.index({ channel: 1, company: 1 })

module.exports = mongoose.model('Connection', ConnectionSchema)
