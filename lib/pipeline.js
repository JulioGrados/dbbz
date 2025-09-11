'use strict'

const Pipeline = require('../models/pipeline')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Pipeline.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const pipelines = await Pipeline.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return pipelines
}

const create = async body => {
  try {
    const pipeline = await Pipeline.create(body)

    return pipeline
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (pipelineId, body) => {
  const pipeline = await Pipeline.findOne({ _id: pipelineId })

  if (pipeline === null) {
    const error = {
      status: 404,
      message: 'El pipeline que intentas editar no existe.'
    }
    throw error
  }

  try {
    const pipeline = await Pipeline.findOneAndUpdate({ _id: pipelineId }, body, {
      new: true
    })

    return pipeline
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const pipeline = await Pipeline.findOne(query, select).populate(populate)

    if (pipeline === null) {
      const error = {
        status: 404,
        message: 'El pipeline no existe.'
      }
      throw error
    }

    return pipeline
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async pipelineId => {
  const pipeline = await Pipeline.findOne({ _id: pipelineId })

  if (pipeline === null) {
    const error = {
      status: 404,
      message: 'El pipeline que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Pipeline.deleteOne({ _id: pipelineId })

    return pipeline
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
