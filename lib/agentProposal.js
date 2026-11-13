'use strict'

const AgentProposal = require('../models/agentProposal')

const { transformParams } = require('utils').transform

const count = async params => {
  const { query } = transformParams(params)
  const count = await AgentProposal.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const agentProposals = await AgentProposal.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return agentProposals
}

const create = async body => {
  const agentProposal = await AgentProposal.create(body)
  return agentProposal
}

const update = async (agentProposalId, body) => {
  const agentProposal = await AgentProposal.findOneAndUpdate(
    { _id: agentProposalId },
    body,
    { new: true, runValidators: true }
  )

  if (agentProposal === null) {
    const error = {
      status: 404,
      message: 'La propuesta de agente no existe.'
    }
    throw error
  }

  return agentProposal
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  const agentProposal = await AgentProposal.findOne(query, select).populate(populate)

  if (agentProposal === null) {
    const error = {
      status: 404,
      message: 'La propuesta de agente no existe.'
    }
    throw error
  }

  return agentProposal
}

module.exports = {
  count,
  list,
  create,
  update,
  detail
}
