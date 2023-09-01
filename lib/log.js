'use strict'

const Log = require('../models/log')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Log.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const logs = await Log.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return logs
}

const create = async body => {
  try {
    const log = await Log.create(body)

    return log
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (logId, body) => {
  const log = await Log.findOne({ _id: logId })

  if (log === null) {
    const error = {
      status: 404,
      message: 'El log que intentas editar no existe.'
    }
    throw error
  }

  try {
    const log = await Log.findOneAndUpdate({ _id: logId }, body, { new: true })

    return log
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const log = await Log.findOne(query, select).populate(populate)

    if (log === null) {
      const error = {
        status: 404,
        message: 'El log no existe.'
      }
      throw error
    }

    return log
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async logId => {
  const log = await Log.findOne({ _id: logId })

  if (log === null) {
    const error = {
      status: 404,
      message: 'El log que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Log.deleteOne({ _id: logId })

    return log
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
