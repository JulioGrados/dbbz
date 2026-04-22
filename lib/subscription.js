'use strict'

const Subscription = require('../models/subscription')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Subscription.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const subscriptions = await Subscription.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return subscriptions
}

const create = async body => {
  try {
    const subscription = await Subscription.create(body)

    return subscription
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (subscriptionId, body) => {
  const subscription = await Subscription.findOne({ _id: subscriptionId })

  if (subscription === null) {
    const error = {
      status: 404,
      message: 'El subscription que intentas editar no existe.'
    }
    throw error
  }

  try {
    const subscription = await Subscription.findOneAndUpdate({ _id: subscriptionId }, body, {
      new: true
    })

    return subscription
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const subscription = await Subscription.findOne(query, select).populate(populate)

    if (subscription === null) {
      const error = {
        status: 404,
        message: 'El subscription no existe.'
      }
      throw error
    }

    return subscription
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

    let queryBuilder = Subscription.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const subscription = await queryBuilder.exec()

    return subscription || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async subscriptionId => {
  const subscription = await Subscription.findOne({ _id: subscriptionId })

  if (subscription === null) {
    const error = {
      status: 404,
      message: 'El subscription que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Subscription.deleteOne({ _id: subscriptionId })

    return subscription
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
