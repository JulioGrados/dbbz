'use strict'

const Track = require('../models/track')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Track.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const track = await Track.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return track
}

const create = async body => {
  try {
    const track = await Track.create(body)

    return track
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (trackId, body) => {
  const track = await Track.findOne({ _id: trackId })

  if (track === null) {
    const error = {
      status: 404,
      message: 'El track que intentas editar no existe.'
    }
    throw error
  }

  try {
    const track = await Track.findOneAndUpdate({ _id: trackId }, body, {
      new: true
    })

    return track
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const track = await Track.findOne(query, select).populate(populate)

    if (track === null) {
      const error = {
        status: 404,
        message: 'El track no existe.'
      }
      throw error
    }

    return track
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async trackId => {
  const track = await Track.findOne({ _id: trackId })

  if (track === null) {
    const error = {
      status: 404,
      message: 'El track que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Track.deleteOne({ _id: trackId })

    return track
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
