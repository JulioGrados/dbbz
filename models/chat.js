'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const ChatSchema = new Schema(
  {
    linked: {
      type: Schema.Types.ObjectId,
      ref: 'Contact'
    },
    assigned: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    mobile: {
      type: String
    },
    names: {
      type: String
    },
    mobileCode: {
      type: String
    },
    // ── Identidad WhatsApp 2026 (mismos campos que Contact) ──────────────────
    // `mobile` sigue siendo el destinatario por defecto. Cuando WhatsApp no
    // entrega el teléfono, `mobile` guarda el identificador disponible y estos
    // campos dicen de qué tipo es, para enviar al destino correcto y para poder
    // fusionar el chat cuando aparezca el número real.
    lid: {
      type: String // Solo dígitos, sin el sufijo @lid
    },
    waUserId: {
      type: String // BSUID de Cloud API
    },
    waUsername: {
      type: String // Username público de WhatsApp, sin @
    },
    lastMessage: {
      type: String
    },
    previousMessage: {
      type: String
    },
    previousMessageType: {
      type: String
    },
    lastChannel: {
      type: String
    },
    lastMessageType: {
      type: String
    },
    lastMessageStatus: {
      type: String,
      enum: ['received', 'sent', 'delivered', 'read', 'error'],
      default: 'received'
    },
    read: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    phoneNoId: {
      type: String
    },
    auto: {
      type: Boolean,
      default: false
    },
    country: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    datePipeline: {
      type: Date,
      default: Date.now
    },
    create: {
      type: Date,
      default: Date.now
    },
    channel: {
      type: String,
      default: 'Whatsapp'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    connection: {
      type: Schema.Types.ObjectId,
      ref: 'Connection'
    },
    bot: {
      type: Schema.Types.ObjectId,
      ref: 'Bot'
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    name: {
      type: String,
    },
    transmitter: {
      type: Boolean,
      default: true
    },
    option: {
      type: String,
      enum: [
        'abiertos',
        'resueltos',
        'espera',
        'outside'
      ],
      default: 'abiertos'
    },
    status: {
      type: String,
      enum: [
        'initial',
        'assigned',
        'notAssigned'
      ]
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    pipeline: {
      type: Schema.Types.ObjectId,
      ref: 'Pipeline'
    },
    stage: {
      type: Schema.Types.ObjectId,
      ref: 'Stage'
    },
    isCtwa: {
      type: Boolean,
      default: false
    },
    ctwaClid: {
      type: String
    },
    referral: {
      source_url: { type: String },
      source_id: { type: String },
      source_type: { type: String },
      headline: { type: String },
      body: { type: String },
      media_type: { type: String },
      image_url: { type: String },
      video_url: { type: String },
      thumbnail_url: { type: String },
      ctwa_clid: { type: String }
    },
  },
  {
    collection: 'chats'
  }
)

ChatSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

ChatSchema.index({
  linked: 1,
  status: 1
})

// Bandeja: /api/chats/filter (match por company+option, orden por updatedAt)
ChatSchema.index(
  { company: 1, option: 1, updatedAt: -1 },
  { name: 'company_option_updatedAt' }
)

// Búsqueda por identificadores alternos de WhatsApp (ver campos lid/waUserId).
ChatSchema.index(
  { company: 1, lid: 1 },
  { name: 'company_lid', partialFilterExpression: { lid: { $exists: true } } }
)

ChatSchema.index(
  { company: 1, waUserId: 1 },
  { name: 'company_waUserId', partialFilterExpression: { waUserId: { $exists: true } } }
)

module.exports = mongoose.model('Chat', ChatSchema)