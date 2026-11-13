'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')

// Agentes IA que una empresa activó desde crmbz (/agents). Hoy solo existe
// 'daily_report' (Reporte diario de conversaciones): uno por empresa, atado a
// la conexión de WhatsApp que se eligió al activarlo.
const AiAgentSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        type: {
            type: String,
            enum: ['daily_report'],
            required: true
        },
        connection: {
            type: Schema.Types.ObjectId,
            ref: 'Connection',
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'paused'],
            default: 'active'
        },
        activatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        activatedAt: {
            type: Date
        }
    }
)

AiAgentSchema.plugin(timestamp)

AiAgentSchema.index({ company: 1, type: 1 }, { unique: true, name: 'company_type' })
AiAgentSchema.index({ type: 1, status: 1 }, { name: 'type_status' })

module.exports = mongoose.model('AiAgent', AiAgentSchema)
