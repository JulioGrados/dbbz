'use strict'

const Team = require('../models/team')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Team.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const team = await Team.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return team
}

const create = async body => {
  try {
    const team = await Team.create(body)

    return team
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (teamId, body) => {
  const team = await Team.findOne({ _id: teamId })

  if (team === null) {
    const error = {
      status: 404,
      message: 'El team que intentas editar no existe.'
    }
    throw error
  }

  try {
    const team = await Team.findOneAndUpdate({ _id: teamId }, body, {
      new: true
    })

    return team
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const team = await Team.findOne(query, select).populate(populate)

    if (team === null) {
      const error = {
        status: 404,
        message: 'El team no existe.'
      }
      throw error
    }

    return team
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async teamId => {
  const team = await Team.findOne({ _id: teamId })

  if (team === null) {
    const error = {
      status: 404,
      message: 'El team que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Team.deleteOne({ _id: teamId })

    return team
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
