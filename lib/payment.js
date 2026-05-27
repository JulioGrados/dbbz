'use strict'

const Payment = require('../models/payment')
const { transformParams } = require('utils').transform

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)
  return Payment.find(query, select).populate(populate).sort(sort).limit(limit).skip(skip)
}

const create = async body => {
  return Payment.create(body)
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)
  return Payment.findOne(query, select).populate(populate)
}

const count = async params => {
  const { query } = transformParams(params)
  return Payment.countDocuments(query)
}

const remove = async paymentId => {
  return Payment.deleteOne({ _id: paymentId })
}

module.exports = { list, create, detail, count, remove }
