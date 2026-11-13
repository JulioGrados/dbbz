'use strict'

const AiAgent = require('../models/aiAgent')

const { transformParams } = require('utils').transform

const count = async params => {
  const { query } = transformParams(params)
  const count = await AiAgent.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const aiAgents = await AiAgent.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return aiAgents
}

const create = async body => {
  const aiAgent = await AiAgent.create(body)
  return aiAgent
}

const update = async (aiAgentId, body) => {
  const aiAgent = await AiAgent.findOneAndUpdate(
    { _id: aiAgentId },
    body,
    { new: true, runValidators: true }
  )

  if (aiAgent === null) {
    const error = {
      status: 404,
      message: 'El registro no existe.'
    }
    throw error
  }

  return aiAgent
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  const aiAgent = await AiAgent.findOne(query, select).populate(populate)

  if (aiAgent === null) {
    const error = {
      status: 404,
      message: 'El registro no existe.'
    }
    throw error
  }

  return aiAgent
}

// Actualiza (o crea con upsert) por query arbitraria. Devuelve null si no hay
// coincidencia y no se pidió upsert. Útil para transiciones de estado atómicas.
const findOneAndUpdate = async (query, body, options = {}) => {
  return AiAgent.findOneAndUpdate(query, body, { new: true, ...options })
}

const distinct = async (field, query) => AiAgent.distinct(field, query)

module.exports = {
  count,
  list,
  create,
  update,
  detail,
  findOneAndUpdate,
  distinct
}
