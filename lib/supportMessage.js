'use strict'

const SupportMessage = require('../models/supportMessage')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await SupportMessage.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const supportMessages = await SupportMessage.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return supportMessages
}

const create = async body => {
  try {
    const supportMessage = await SupportMessage.create(body)

    return supportMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

//Marcar como leído todos los mensajes
const markRead = async (supportMessageId, senders) => {
    await SupportMessage.updateMany(
        { supportChat: supportChatId, sender: { $in: senders }, read: false },
        { read: true }
    )
    return true
}

const update = async (supportMessageId, body) => {
  const supportMessage = await SupportMessage.findOne({ _id: supportMessageId })

  if (supportMessage === null) {
    const error = {
      status: 404,
      message: 'El supportMessage que intentas editar no existe.'
    }
    throw error
  }

  try {
    const supportMessage = await SupportMessage.findOneAndUpdate({ _id: supportMessageId }, body, {
      new: true
    })

    return supportMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const supportMessage = await SupportMessage.findOne(query, select).populate(populate)

    if (supportMessage === null) {
      const error = {
        status: 404,
        message: 'El supportMessage no existe.'
      }
      throw error
    }

    return supportMessage
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

    let queryBuilder = SupportMessage.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const supportMessage = await queryBuilder.exec()

    return supportMessage || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async supportMessageId => {
  const supportMessage = await SupportMessage.findOne({ _id: supportMessageId })

  if (supportMessage === null) {
    const error = {
      status: 404,
      message: 'El supportMessage que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await SupportMessage.deleteOne({ _id: supportMessageId })

    return supportMessage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

module.exports = {
  count,
  list,
  create,
  markRead,
  update,
  detail,
  detailOnly,
  remove
}
