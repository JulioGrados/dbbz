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
    isOnTrial: {
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
    },
    billingInfo: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        company: {
            type: String
        },
        country: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        taxId: {
            type: String
        }
    },
    interval: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly'
    },
    stripeCheckoutSessionId: {
        type: String
    },
    connectionsLimit: {
        type: Number,
        default: 1
    },
    usersLimit: {
        type: Number,
        default: 3
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