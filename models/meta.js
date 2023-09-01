'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const MetaSchema = new Schema(
  {
    domain: {
      type: String,
      required: [true, 'El dominio es requerida'],
      unique: 'El dominio debe ser único',
      sparse: true
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    address: {
      type: {
        type: String
      },
      street: {
        type: String
      },
      locality: {
        type: String
      },
      postalCode: {
        type: Number
      },
      country: {
        type: String
      }
    },
    phone: {
      type: Number
    },
    fb: {
      id: {
        type: String
      },
      page: {
        type: String
      },
      image: {
        type: String
      }
    },
    tw: {
      id: {
        type: String
      },
      page: {
        type: String
      },
      image: {
        type: String
      }
    },
    og: {
      title: {
        type: String
      },
      description: {
        type: String
      },
      url: {
        type: String
      },
      siteName: {
        type: String
      },
      image: {
        type: String
      }
    },
    themeColor: {
      type: String
    },
    pages: [
      {
        name: {
          type: String
        },
        root: {
          type: String
        },
        title: {
          type: String
        },
        description: {
          type: String
        }
      }
    ]
  },
  {
    collection: 'metas'
  }
)

MetaSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

MetaSchema.plugin(mongooseBeautifulUniqueValidation)

MetaSchema.index({
  domain: 1,
  page: 1
})

module.exports = mongoose.model('Meta', MetaSchema)
