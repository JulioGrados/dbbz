'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamp = require('mongoose-timestamp')

// Un reporte por conexión y día (día de Lima, 'YYYY-MM-DD'), generado por el
// agente "Reporte diario". Lo arma apibz (src/functions/dailyReport):
//   métricas (cálculo) → análisis por conversación (IA) → resumen del día (IA).
// Estados:
//   batch_map   conversaciones enviadas a la Batch API de OpenAI, esperando
//   batch_day   resumen del día enviado a la Batch API, esperando
//   processing  generándose en modo normal (primer reporte o respaldo)
//   ready       listo para mostrarse
//   empty       ese día no hubo conversaciones (no se usa IA)
//   error       falló; ver `error`
const ChatItemSchema = new Schema(
    {
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
        // nombre del chat al generar (solo para mostrar; nunca se envía a la IA)
        name: { type: String },
        // resultado de la IA por conversación (ver CHAT_SCHEMA en apibz)
        analysis: { type: Schema.Types.Mixed },
        // clasificado sin IA (solo saludos / gracias / ok)
        trivial: { type: Boolean },
        // fuera del límite del plan: se cuenta pero no se analiza
        skipped: { type: Boolean }
    },
    { _id: false }
)

const DailyReportSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        agent: {
            type: Schema.Types.ObjectId,
            ref: 'AiAgent'
        },
        connection: {
            type: Schema.Types.ObjectId,
            ref: 'Connection',
            required: true
        },
        day: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['batch_map', 'batch_day', 'processing', 'ready', 'empty', 'error'],
            default: 'processing'
        },
        // métricas por cálculo del día, del día anterior y del mismo día de la semana pasada
        metrics: { type: Schema.Types.Mixed },
        prev: { type: Schema.Types.Mixed },
        week: { type: Schema.Types.Mixed },
        chats: [ChatItemSchema],
        // resultado de la IA para el día (resumen, top_preguntas, acciones…)
        summary: { type: Schema.Types.Mixed },
        // ids de los lotes de OpenAI en curso
        batch: {
            map: { type: String },
            day: { type: String }
        },
        usage: {
            model: { type: String },
            input: { type: Number, default: 0 },
            cached: { type: Number, default: 0 },
            output: { type: Number, default: 0 },
            costUsd: { type: Number, default: 0 },
            batch: { type: Boolean }
        },
        error: { type: String },
        readyAt: { type: Date },
        seenAt: { type: Date }
    }
)

DailyReportSchema.plugin(timestamp)

DailyReportSchema.index({ connection: 1, day: 1 }, { unique: true, name: 'connection_day' })
DailyReportSchema.index({ company: 1, day: -1 }, { name: 'company_day' })
DailyReportSchema.index({ status: 1 }, { name: 'status' })

module.exports = mongoose.model('DailyReport', DailyReportSchema)
