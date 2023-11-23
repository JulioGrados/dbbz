'use strict'

const Bot = require('../models/bot')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Bot.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const bot = await Bot.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return bot
}

const create = async body => {
  try {
    const bot = await Bot.create(body)

    return bot
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (botId, body) => {
  const bot = await Bot.findOne({ _id: botId })

  if (bot === null) {
    const error = {
      status: 404,
      message: 'El bot que intentas editar no existe.'
    }
    throw error
  }

  try {
    const bot = await Bot.findOneAndUpdate({ _id: botId }, body, {
      new: true
    })

    return bot
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const bot = await Bot.findOne(query, select).populate(populate)

    if (bot === null) {
      const error = {
        status: 404,
        message: 'El bot no existe.'
      }
      throw error
    }

    return bot
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async botId => {
  const bot = await Bot.findOne({ _id: botId })

  if (bot === null) {
    const error = {
      status: 404,
      message: 'El bot que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Bot.deleteOne({ _id: botId })

    return bot
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
