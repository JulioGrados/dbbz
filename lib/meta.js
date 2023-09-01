'use strict'

const Meta = require('../models/meta')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Meta.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const meta = await Meta.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return meta
}

const create = async body => {
  try {
    const meta = await Meta.create(body)

    return meta
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (metaId, body) => {
  const meta = await Meta.findOne({ _id: metaId })

  if (meta === null) {
    const error = {
      status: 404,
      message: 'La notificación que intentas editar no existe.'
    }
    throw error
  }

  try {
    const meta = await Meta.findOneAndUpdate({ _id: metaId }, body, {
      new: true
    })

    return meta
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const meta = await Meta.findOne(query, select).populate(populate)

    if (meta === null) {
      const error = {
        status: 404,
        message: 'La notificación no existe.'
      }
      throw error
    }

    return meta
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async metaId => {
  const meta = await Meta.findOne({ _id: metaId })

  if (meta === null) {
    const error = {
      status: 404,
      message: 'La notificación que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Meta.deleteOne({ _id: metaId })

    return meta
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
