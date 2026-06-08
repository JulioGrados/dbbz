'use strict'

const ScheduledMessage = require('../models/scheduledMessage')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await ScheduledMessage.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const scheduledMessages = await ScheduledMessage.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return scheduledMessages
}

const create = async body => {
  try {
    const scheduledMessage = await ScheduledMessage.create(body)

    return scheduledMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (botId, body) => {
  const scheduledMessage = await ScheduledMessage.findOne({ _id: botId })

  if (scheduledMessage === null) {
    const error = {
      status: 404,
      message: 'El scheduledMessage que intentas editar no existe.'
    }
    throw error
  }

  try {
    const scheduledMessage = await ScheduledMessage.findOneAndUpdate({ _id: botId }, body, {
      new: true
    })

    return scheduledMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const scheduledMessage = await ScheduledMessage.findOne(query, select).populate(populate)

    if (scheduledMessage === null) {
      const error = {
        status: 404,
        message: 'El scheduledMessage no existe.'
      }
      throw error
    }

    return scheduledMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detailOnly = async params => {
  try {
    const { query, select, populate } = transformParams(params) || {}

    if (!query) {
      console.warn('No se proporcionó una query válida en transformParams')
      return null
    }

    let queryBuilder = ScheduledMessage.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const scheduledMessage = await queryBuilder.exec()

    return scheduledMessage || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async botId => {
  const scheduledMessage = await ScheduledMessage.findOne({ _id: botId })

  if (scheduledMessage === null) {
    const error = {
      status: 404,
      message: 'El scheduledMessage que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await ScheduledMessage.deleteOne({ _id: botId })

    return scheduledMessage
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
  detailOnly,
  remove
}
