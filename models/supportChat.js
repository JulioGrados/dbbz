'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')

const SupportChatSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        status: {
            type: String,
            enum: ['abierto', 'resuelto'],
            default: 'abierto'
        },
        lastMessage: {
            type: String
        },
        lastMessageType: {
            type: String
        },
        lastMessageSender: {
            type: String,
            enum: ['user', 'agent', 'system']
        },
        // no leídos por el usuario (respuestas del agente)
        countUser: {
            type: Number,
            default: 0
        },
        // no leídos por soporte (mensajes del usuario) - para la bandeja de dashbz
        countAgent: {
            type: Number,
            default: 0
        }
    },
    {
        collection: 'supportchats'
    }
)

SupportChatSchema.plugin(timestamp, {
    createdAt: { index: true },
    updatedAt: { index: true }
})

// un chat de soporte por usuario
SupportChatSchema.index({ user: 1 }, { unique: true })

// bandeja de soporte 
SupportChatSchema.index({ status: 1, updatedAt: -1 })

module.exports = mongoose.model('SupportChat', SupportChatSchema)