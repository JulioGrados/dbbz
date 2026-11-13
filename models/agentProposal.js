'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')

// Propuestas de Agentes IA que envían los clientes de pago desde crmbz (/agents,
// "Proponer un agente"). El equipo de Bizeus las revisa en dashbz.
const AgentProposalSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // copia de contacto al enviar, por si luego cambia el usuario
        userEmail: {
            type: String,
            trim: true
        },
        userName: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },
        channels: [{
            type: String,
            enum: ['whatsapp', 'facebook', 'instagram', 'tiktok', 'telegram']
        }],
        volume: {
            type: String,
            enum: ['pocas', 'decenas', 'cientos']
        },
        urgency: {
            type: String,
            enum: ['ya', 'pronto', 'idea']
        },
        // idea de la lista "Ideas de otros equipos" desde la que se abrió el formulario
        fromIdea: {
            type: String,
            trim: true,
            maxlength: 120
        },
        status: {
            type: String,
            enum: ['nueva', 'en_revision', 'aprobada', 'descartada', 'creada'],
            default: 'nueva'
        },
        // nota interna del equipo (no la ve el cliente)
        teamNote: {
            type: String,
            trim: true,
            maxlength: 2000
        }
    },
    {
        collection: 'agentproposals'
    }
)

AgentProposalSchema.plugin(timestamp, {
    createdAt: { index: true },
    updatedAt: { index: true }
})

// propuestas de una empresa / bandeja del equipo por estado / tope diario por usuario
AgentProposalSchema.index({ company: 1, createdAt: -1 })
AgentProposalSchema.index({ status: 1, createdAt: -1 })
AgentProposalSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('AgentProposal', AgentProposalSchema)
