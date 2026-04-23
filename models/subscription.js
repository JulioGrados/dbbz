'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')

const SubscriptionSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    //trial
    trialStartDate: {
        type: Date
    },
    trialEndDate: {
        type: Date
    },
    inOnTrial: {
        type: Boolean,
        default: true
    },
    //stripe
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    },
    stripePriceId: {
        type: String
    },
    //estado
    status: {
        type: String,
        enum: ['trial', 'active', 'past_due', 'canceled', 'expired'],
        default: 'trial'
    },
    plan: {
        type: String,
        enum: ['free_trial', 'basic', 'pro', 'enterprise'],
        default: 'free_trial'
    },
    //control
    hasAccessToServices: {
        type: Boolean
    },
    canceledAt: {
        type: Date
    },
    canceledAtPeriodEnd: {
        type: Boolean
    },
    currentPeriodStart: {
        type: Date
    },
    currentPeriodEnd: {
        type: Date
    }
  },
  {
    collection: 'subscriptions'
  }
)

SubscriptionSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

SubscriptionSchema.index({
  company: 1
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)