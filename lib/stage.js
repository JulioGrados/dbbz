'use strict'

const Stage = require('../models/stage')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Stage.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const stages = await Stage.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return stages
}

const create = async body => {
  try {
    const stage = await Stage.create(body)

    return stage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (stageId, body) => {
  const stage = await Stage.findOne({ _id: stageId })

  if (stage === null) {
    const error = {
      status: 404,
      message: 'El stage que intentas editar no existe.'
    }
    throw error
  }

  try {
    const stage = await Stage.findOneAndUpdate({ _id: stageId }, body, {
      new: true
    })

    return stage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const stage = await Stage.findOne(query, select).populate(populate)

    if (stage === null) {
      const error = {
        status: 404,
        message: 'El stage no existe.'
      }
      throw error
    }

    return stage
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async stageId => {
  const stage = await Stage.findOne({ _id: stageId })

  if (stage === null) {
    const error = {
      status: 404,
      message: 'El stage que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Stage.deleteOne({ _id: stageId })

    return stage
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
