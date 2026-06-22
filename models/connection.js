'use strict'

const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

// Token público dedicado para autenticar la API de envío externa
// (NO reutilizar `key`/`tokenMeta`/credenciales de plataforma — ver docs/api-publica-envio-canales.md)
// Formato: "bz_" + 48 hex chars => "bz_3f9a...". URL-safe y reconocible.
const generateApiToken = () => `bz_${crypto.randomBytes(24).toString('hex')}`

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
    apiToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      default: generateApiToken
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

    // ==================== CAMPOS TIKTOK (Business Messaging) ====================
    tiktokBusinessId: {
      type: String // open_id = business_id para los endpoints de mensaje
    },
    tiktokAccountName: {
      type: String
    },
    tiktokAccessToken: {
      type: String // access_token (24h)
    },
    tiktokRefreshToken: {
      type: String // refresh_token (1 año)
    },
    tiktokTokenExpiry: {
      type: Date // refresh perezoso
    },

    // ==================== CAMPOS CLOUD-API ====================

    // WhatsApp Business Account ID (necesario para obtener templates)
    // Diferente de idInstance (Phone Number ID) que es para enviar mensajes
    wabaId: {
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
    },

    active: {
      type: Boolean,
      default: true
    },
    pausedReason: {
      type: String
    },
    pausedAt: {
      type: Date,
      default: Date.now
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

const ConnectionModel = mongoose.model('Connection', ConnectionSchema)

// Reutilizable para backfill/regeneración manteniendo el mismo formato
ConnectionModel.generateApiToken = generateApiToken

module.exports = ConnectionModel
