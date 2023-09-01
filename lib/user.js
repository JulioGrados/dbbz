'use strict'

const User = require('../models/user')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await User.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const users = await User.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return users
}

const create = async body => {
  try {
    const user = await User.create(body)

    return user
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (userId, body, doneFindOne = true) => {
  if (doneFindOne) {
    const user = await User.findOne({ _id: userId })
    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intentas editar no existe.'
      }
      throw error
    }

    if (body.dni && body.dni === user.dni) {
      delete body.dni
    }
  }

  delete body.createdAt
  
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, body, {
      new: true,
      populate: 'courses.ref'
    })
    // console.log('user', user)
    return user
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateDni = async (userId, body, doneFindOne = true) => {
  
  if (doneFindOne) {
    const user = await User.findOne({ _id: userId })
    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intentas editar no existe.'
      }
      throw error
    }
  }

  delete body.createdAt
  
  try {
    const userDni = await User.updateOne({ _id: userId }, {$unset: {dni:1}})
    return userDni
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateAccount = async (userId, body, doneFindOne = true) => {
  
  if (doneFindOne) {
    const user = await User.findOne({ _id: userId })
    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intentas editar no existe.'
      }
      throw error
    }
  }

  delete body.createdAt
  
  try {
    const userDni = await User.updateOne({ _id: userId }, {$unset: {username:1, password:1}})
    return userDni
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateAccountMoodle = async (userId, body, doneFindOne = true) => {
  
  if (doneFindOne) {
    const user = await User.findOne({ _id: userId })
    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intentas editar no existe.'
      }
      throw error
    }
  }

  delete body.createdAt
  
  try {
    const userDni = await User.updateOne({ _id: userId }, {$unset: {username:1, password:1, moodleId:1}})
    return userDni
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updatePhoto = async (userId, body, doneFindOne = true) => {
  
  if (doneFindOne) {
    const user = await User.findOne({ _id: userId })
    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intentas editar no existe.'
      }
      throw error
    }
  }

  delete body.createdAt
  
  try {
    const userDni = await User.updateOne({ _id: userId }, {$unset: {photo:1}})
    return userDni
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}



const detail = async params => {
  const { query, select, populate } = transformParams(params)
  
  try {
    const user = await User.findOne(query, select).populate(populate)

    if (user === null) {
      const error = {
        status: 404,
        message: 'El usuario que intenta buscar no existe.'
      }
      throw error
    }

    return user
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async userId => {
  const user = await User.findOne({ _id: userId })

  if (user === null) {
    const error = {
      status: 404,
      message: 'El usuario que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await User.deleteOne({ _id: userId })

    return user
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
  updateDni,
  updateAccount,
  updateAccountMoodle,
  updatePhoto,
  detail,
  remove
}
