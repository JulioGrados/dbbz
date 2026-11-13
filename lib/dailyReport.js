'use strict'

const DailyReport = require('../models/dailyReport')

const { transformParams } = require('utils').transform

const count = async params => {
  const { query } = transformParams(params)
  const count = await DailyReport.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const dailyReports = await DailyReport.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return dailyReports
}

const create = async body => {
  const dailyReport = await DailyReport.create(body)
  return dailyReport
}

const update = async (dailyReportId, body) => {
  const dailyReport = await DailyReport.findOneAndUpdate(
    { _id: dailyReportId },
    body,
    { new: true, runValidators: true }
  )

  if (dailyReport === null) {
    const error = {
      status: 404,
      message: 'El registro no existe.'
    }
    throw error
  }

  return dailyReport
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  const dailyReport = await DailyReport.findOne(query, select).populate(populate)

  if (dailyReport === null) {
    const error = {
      status: 404,
      message: 'El registro no existe.'
    }
    throw error
  }

  return dailyReport
}

// Actualiza (o crea con upsert) por query arbitraria. Devuelve null si no hay
// coincidencia y no se pidió upsert. Útil para transiciones de estado atómicas.
const findOneAndUpdate = async (query, body, options = {}) => {
  return DailyReport.findOneAndUpdate(query, body, { new: true, ...options })
}

const distinct = async (field, query) => DailyReport.distinct(field, query)

module.exports = {
  count,
  list,
  create,
  update,
  detail,
  findOneAndUpdate,
  distinct
}
