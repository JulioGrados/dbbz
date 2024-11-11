'use strict'

const Queues = require('../models/queue')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Queues.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const queues = await Queues.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return queues
}

const create = async body => {
  try {
    const queue = await Queues.create(body)

    return queue
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (queueId, body) => {
  const queue = await Queues.findOne({ _id: queueId })

  if (queue === null) {
    const error = {
      status: 404,
      message: 'El queue que intentas editar no existe.'
    }
    throw error
  }

  try {
    const queue = await Queues.findOneAndUpdate({ _id: queueId }, body, {
      new: true
    })

    return queue
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const queue = await Queues.findOne(query, select).populate(populate)

    if (queue === null) {
      const error = {
        status: 404,
        message: 'El queue no existe.'
      }
      throw error
    }

    return queue
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async queueId => {
  const queue = await Queues.findOne({ _id: queueId })

  if (queue === null) {
    const error = {
      status: 404,
      message: 'El queue que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Queues.deleteOne({ _id: queueId })

    return queue
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
