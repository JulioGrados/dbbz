'use strict'

const Message = require('../models/message')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Message.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const messages = await Message.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return messages
}

const create = async body => {
  try {
    const message = await Message.create(body)
    return Message.findById(message._id).populate([
      { path: 'linked assigned'}
    ])
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (messageId, body) => {
  const message = await Message.findOne({ _id: messageId })

  if (message === null) {
    const error = {
      status: 404,
      message: 'El mensaje no se encontro'
    }
    throw error
  }
  
  try {
    if (body.only) {
      const messageUpdate = await Message.findOneAndReplace(
        {
          _id: messageId
        },
        {
          ...message.toJSON(),
          ...body
        },
        {
          new: true
        }
      ).populate(
      [
        { path: 'linked' },
        { path: 'assigned'},
      ])
      return messageUpdate 
    } else {
      
      const messageUpdate = await Message.findOneAndUpdate(
        { _id: messageId },
        body,
        {
          new: true
        }
      ).populate(
      [
        { path: 'linked' },
        { path: 'assigned'},
      ])
      return messageUpdate  
    }
    
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateMany = async (query, body) => {
  try {
    const messages = await Message.updateMany(query, { "$set": { ...body } }).populate([{ path: 'linked' },{ path: 'assigned'}])
    return messages
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)
  let message

  try {
    message = await Message.findOne(query, select).populate(populate)
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }

  if (message === null) {
    const error = {
      status: 404,
      menssage: 'El mensaje no se encontro'
    }

    throw error
  }

  return message
}


const detailOnly = async params => {
  try {
    const { query, select, populate } = transformParams(params) || {}

    if (!query) {
      console.warn('No se proporcionó una query válida en transformParams')
      return null
    }

    let queryBuilder = Message.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const message = await queryBuilder.exec()

    return message || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async messageId => {
  const message = Message.findOne({ _id: messageId })

  if (message === null) {
    const error = {
      status: 404,
      message: 'El mensaje no se encontro'
    }

    throw error
  }

  try {
    const messageRemove = Message.deleteOne({ _id: messageId })
    return messageRemove
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const removeMany = async query => {
  
  try {
    const messages = await Message.deleteMany(query)

    return messages
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
  updateMany,
  detail,
  detailOnly,
  remove,
  removeMany
}
