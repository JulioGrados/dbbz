'use strict'

const Tag = require('../models/tag')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Tag.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const tag = await Tag.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return tag
}

const create = async body => {
  try {
    const tag = await Tag.create(body)

    return tag
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (tagId, body) => {
  const tag = await Tag.findOne({ _id: tagId })

  if (tag === null) {
    const error = {
      status: 404,
      message: 'El tag que intentas editar no existe.'
    }
    throw error
  }

  try {
    const tag = await Tag.findOneAndUpdate({ _id: tagId }, body, {
      new: true
    })

    return tag
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const tag = await Tag.findOne(query, select).populate(populate)

    if (tag === null) {
      const error = {
        status: 404,
        message: 'El tag no existe.'
      }
      throw error
    }

    return tag
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

    let queryBuilder = Tag.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const tag = await queryBuilder.exec()

    return tag || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async tagId => {
  const tag = await Tag.findOne({ _id: tagId })

  if (tag === null) {
    const error = {
      status: 404,
      message: 'El tag que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Tag.deleteOne({ _id: tagId })

    return tag
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
