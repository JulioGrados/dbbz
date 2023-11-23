'use strict'

const Upload = require('../models/upload')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Upload.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const upload = await Upload.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return upload
}

const create = async body => {
  try {
    const upload = await Upload.create(body)

    return upload
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (uploadId, body) => {
  const upload = await Upload.findOne({ _id: uploadId })

  if (upload === null) {
    const error = {
      status: 404,
      message: 'El archivo que intentas editar no existe.'
    }
    throw error
  }

  try {
    const upload = await Upload.findOneAndUpdate({ _id: uploadId }, body, {
      new: true
    })

    return upload
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const upload = await Upload.findOne(query, select).populate(populate)

    if (upload === null) {
      const error = {
        status: 404,
        message: 'El archivo no existe.'
      }
      throw error
    }

    return upload
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async uploadId => {
  const upload = await Upload.findOne({ _id: uploadId })

  if (upload === null) {
    const error = {
      status: 404,
      message: 'El archivo que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Upload.deleteOne({ _id: uploadId })

    return upload
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
