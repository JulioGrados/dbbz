'use strict'

const Contact = require('../models/contact')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Contact.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const contact = await Contact.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return contact
}

const create = async body => {
  try {
    const contact = await Contact.create(body)

    return contact
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (contactId, body) => {
  const contact = await Contact.findOne({ _id: contactId })

  if (contact === null) {
    const error = {
      status: 404,
      message: 'El contacto que intentas editar no existe.'
    }
    throw error
  }

  try {
    const contact = await Contact.findOneAndUpdate({ _id: contactId }, body, {
      new: true
    })

    return contact
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const contact = await Contact.findOne(query, select).populate(populate)

    if (contact === null) {
      const error = {
        status: 404,
        message: 'El contacto no existe.'
      }
      throw error
    }

    return contact
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

    let queryBuilder = Contact.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const contact = await queryBuilder.exec()

    return contact || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
}

const remove = async contactId => {
  const contact = await Contact.findOne({ _id: contactId })

  if (contact === null) {
    const error = {
      status: 404,
      message: 'El contacto que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Contact.deleteOne({ _id: contactId })

    return contact
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
