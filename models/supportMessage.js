'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')

const SupportMessageSchema = new Schema(
    {
        supportChat: {
            type: Schema.Types.ObjectId,
            ref: 'SupportChat',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        sender: {
            type: String,
            enum: ['user', 'agent', 'system'],
            default: 'user'
        },
        agentName: {
            type: String
        },
        text: {
            type: String
        },
        typeMsg: {
            type: String,
            enum: ['text', 'image', 'video', 'document', 'audio'],
            default: 'text'
        },
        url: {
            type: String
        },
        mimetype: {
            type: String
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'supportmessages'
    }
)

SupportMessageSchema.plugin(timestamp, {
    createdAt: { index: true },
    updatedAt: { index: true }
})

SupportMessageSchema.index({ supportChat: 1, createdAt: -1 })

module.exports = mongoose.model('SupportMessage', SupportMessageSchema)