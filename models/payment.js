'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const PaymentSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    method: {
      type: String,
      enum: ['stripe', 'manual'],
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'failed', 'pending'],
      default: 'paid'
    },
    amount: {
      type: Number
    },
    currency: {
      type: String,
      default: 'usd'
    },
    plan: {
      type: String
    },
    interval: {
      type: String,
      enum: ['monthly', 'annual']
    },
    periodStart: {
      type: Date
    },
    periodEnd: {
      type: Date
    },
    stripeInvoiceId: {
      type: String
    },
    stripePaymentIntentId: {
      type: String
    },
    notes: {
      type: String
    }
  },
  {
    collection: 'payments'
  }
)

PaymentSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

PaymentSchema.index({ company: 1 })
PaymentSchema.index({ subscription: 1 })

module.exports = mongoose.model('Payment', PaymentSchema)
