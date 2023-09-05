'use strict'

const Chat = require('../models/chat')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Chat.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const chats = await Chat.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return chats
}
// , select: 'lastMenssage lastChannel updatedAt linked'
const create = async body => {
  try {
    const chat = await Chat.create(body)
    return await Chat.findById(chat._id).populate([
      { path: 'linked'}
    ])
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (chatId, body) => {
  const chat = await Chat.findOne({ _id: chatId })

  if (chat === null) {
    const error = {
      status: 404,
      chat: 'El chat no se encontro'
    }
    throw error
  }

  try {
    const chatUpdate = await Chat.findOneAndUpdate(
      { _id: chatId },
      body,
      {
        new: true
      }
    )
    return chatUpdate
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)
  let chat

  try {
    chat = await Chat.findOne(query, select).populate(populate)
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }

  if (chat === null) {
    const error = {
      status: 404,
      menssage: 'El chat no se encontro'
    }

    throw error
  }

  return chat
}

const remove = async chatId => {
  const chat = Chat.findOne({ _id: chatId })

  if (chat === null) {
    const error = {
      status: 404,
      chat: 'El chat no se encontro'
    }

    throw error
  }

  try {
    const chatRemove = Chat.deleteOne({ _id: chatId })
    return chatRemove
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
