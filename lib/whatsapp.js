'use strict'

const Whatsapp = require('../models/whatsapp')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Whatsapp.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const whatsapps = await Whatsapp.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return whatsapps
}

const create = async body => {
  try {
    const whatsapp = await Whatsapp.create(body)
    return whatsapp
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (callId, body) => {
  const whatsapp = await Whatsapp.findOne({ _id: callId })

  if (whatsapp === null) {
    const error = {
      status: 404,
      message: 'El whatsapp no se encontro'
    }
    throw error
  }

  try {
    const whatsappUpdate = await Whatsapp.findOneAndUpdate(
      { _id: callId },
      body,
      { new: true }
    )
    return whatsappUpdate
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const whatsapp = Whatsapp.findOne(query, select).populate(populate)

    if (whatsapp === null) {
      const error = {
        status: 404,
        menssage: 'El whatsapp no se encontro'
      }
      throw error
    }

    return whatsapp
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async callId => {
  const whatsapp = Whatsapp.findOne({ _id: callId })

  if (whatsapp === null) {
    const error = {
      status: 404,
      message: 'El whatsapp no se encontro'
    }

    throw error
  }

  try {
    const whatsappRemove = Whatsapp.deleteOne({ _id: callId })
    return whatsappRemove
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

module.exports = {
  count,
  list,
  create,
  update,
  detail,
  remove
}
