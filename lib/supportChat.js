'use strict'

const SupportChat = require('../models/supportChat')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await SupportChat.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const supportChats = await SupportChat.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return supportChats
}

const create = async body => {
  try {
    const supportChat = await SupportChat.create(body)

    return supportChat
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

// atómico: devuelve el chat del usuario o lo crea si no existe
const findOrCreate = async ({ user, company }) => {
    const supportChat = await SupportChat.findOneAndUpdate(
        { user },
        { $setOnInsert: { user, company, status: 'abierto' } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    return supportChat
}

const update = async (supportChatId, body) => {
  
    const supportChat = await SupportChat.findOneAndUpdate(
        { _id: supportChatId }, 
        body, 
        { new: true}
    )
    
    if (supportChat === null) {
        const error = {
            status: 404,
            message: 'El chat de soporte no existe.'
        }
        throw error
    }

    return supportChat
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const supportChat = await SupportChat.findOne(query, select).populate(populate)

    if (supportChat === null) {
      const error = {
        status: 404,
        message: 'El supportChat no existe.'
      }
      throw error
    }

    return supportChat
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

    let queryBuilder = SupportChat.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const supportChat = await queryBuilder.exec()

    return supportChat || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async supportChatId => {
  const supportChat = await SupportChat.findOne({ _id: supportChatId })

  if (supportChat === null) {
    const error = {
      status: 404,
      message: 'El supportChat que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await SupportChat.deleteOne({ _id: supportChatId })

    return supportChat
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

module.exports = {
  count,
  list,
  create,
  findOrCreate,
  update,
  detail,
  detailOnly,
  remove
}
