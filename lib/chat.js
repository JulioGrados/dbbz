'use strict'
const mongoose = require('mongoose')
const Chat = require('../models/chat')
const Message = require('../models/message')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Chat.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)
  const chats = await Chat.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return chats
}

const aggregate = async () => {
  try {
    const chats = await Chat.aggregate([
      {
        $group: {
          _id: { mobile: "$mobile", company: "$company", connection: "$connection" }, // Agrupa por mobile y company
          documents: { $push: "$$ROOT" }, // Recolecta todos los documentos de cada grupo
          count: { $sum: 1 } // Cuenta cuántos documentos hay en cada grupo
        }
      },
      {
        $match: {
          count: { $gt: 1 } // Filtra para mantener solo los grupos con más de un documento
        }
      }
    ]);
  
    return chats;
  } catch (error) {
    throw error;
  }
}

const filter = async (params) => {
  const matchQuery = {
    company: new mongoose.Types.ObjectId(params.company), // ← ya es string
    option: params.option,
    $or: [
      { mobile: { $regex: params.value, $options: 'i' } },
      { names: { $regex: params.value, $options: 'i' } }
    ]
  }

  if (params.assigned !== '') {
    matchQuery['assigned._id'] = new mongoose.Types.ObjectId(params.assigned);
  }
  if (params.connection !== 'Seleccionar conexión') {
    matchQuery.connection = new mongoose.Types.ObjectId(params.connection);
  }
  if (params.team !== 'Seleccionar equipo') {
    matchQuery['team._id'] = new mongoose.Types.ObjectId(params.team);
  }
  if (Array.isArray(params.tags) && params.tags.length > 0) {
    const tags = params.tags.map(item => new mongoose.Types.ObjectId(item))
    console.log('tags', tags)
    matchQuery['linked.tags'] = { $in: tags };
  }
  console.log('matchQuery', matchQuery)
  try {
    const chats = await Chat.aggregate([
      // Lookups
      {
        $lookup: {
          from: 'contacts',
          localField: 'linked',
          foreignField: '_id',
          as: 'linked'
        }
      },
      { $unwind: '$linked' },
      {
        $lookup: {
          from: 'users',
          localField: 'assigned',
          foreignField: '_id',
          as: 'assigned'
        }
      },
      { $unwind: { path: '$assigned', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'teams',
          localField: 'team',
          foreignField: '_id',
          as: 'team'
        }
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
    
      // Match dinámico
      { $match: matchQuery },
    
      // Orden y paginación
      { $sort: { updatedAt: -1 } },
      { $skip: parseInt(params.page) * parseInt(params.limit) },
      { $limit: parseInt(params.limit) }
    ]);
  
    return chats;
  } catch (error) {
    throw error;
  }
}

const filterMsg = async (params) => {
  const matchQuery = {
    'chat.company': new mongoose.Types.ObjectId(params.company), // ← ya es string
    'chat.option': params.option
  }

  if (params.assigned !== '') {
    matchQuery['chat.assigned'] = new mongoose.Types.ObjectId(params.assigned);
  }
  if (params.connection !== 'Seleccionar conexión') {
    matchQuery['chat.connection'] = new mongoose.Types.ObjectId(params.connection);
  }
  if (params.team !== 'Seleccionar equipo') {
    matchQuery['chat.team'] = new mongoose.Types.ObjectId(params.team);
  }
  if (Array.isArray(params.tags) && params.tags.length > 0) {
    const tags = params.tags.map(item => new mongoose.Types.ObjectId(item))
    console.log('tags', tags)
    matchQuery['linked.tags'] = { $in: tags };
  }
  console.log('matchQuery', matchQuery)
  try {
    const chats = await Message.aggregate([
      // Lookups
      {
        $match: {
          text: { $regex: params.value, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$chat'
        }
      },
      {
        $lookup: {
          from: 'chats',
          localField: '_id',
          foreignField: '_id',
          as: 'chat'
        }
      },
      { $unwind: '$chat' },
      {
        $lookup: {
          from: 'contacts',
          localField: 'chat.linked',
          foreignField: '_id',
          as: 'linked'
        }
      },
      { $unwind: '$linked' },
      {
        $lookup: {
          from: 'users',
          localField: 'chat.assigned',
          foreignField: '_id',
          as: 'assigned'
        }
      },
      { $unwind: { path: '$assigned', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'teams',
          localField: 'chat.team',
          foreignField: '_id',
          as: 'team'
        }
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
    
      // Match dinámico
      { $match: matchQuery },
    
      // Orden y paginación
      { $sort: { updatedAt: -1 } },
      { $skip: parseInt(params.page) * parseInt(params.limit) },
      { $limit: parseInt(params.limit) }
    ]);
  
    return chats;
  } catch (error) {
    throw error;
  }
}

// , select: 'lastMenssage lastChannel updatedAt linked'
const create = async body => {
  try {
    const chat = await Chat.create(body)
    return await Chat.findById(chat._id).populate([
      { path: 'linked assigned team' }
    ])
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const update = async (chatId, body) => {
  const chat = await Chat.findOne({ _id: chatId })
  if (chat === null) {
    const error = {
      status: 404,
      chat: 'El chat no se encontro'
    }
    throw error
  }
  
  try {
    if (body.statusRead) {
      const chatUpdate = await Chat.findOneAndReplace(
        {
          _id: chatId
        },
        {
          ...chat.toJSON(),
          read: true,
          count: 0,
        },
        {
          new: true
        }
      ).populate(
      [
        { path: 'linked' },
        { path: 'assigned' },
        { path: 'team'},
        { path: 'tags'},
      ])
      
      return chatUpdate  
    } else if (body.only) {
      const chatUpdate = await Chat.findOneAndReplace(
        {
          _id: chatId
        },
        {
          ...chat.toJSON(),
          ...body
        },
        {
          new: true
        }
      ).populate(
      [
        { path: 'linked' },
        { path: 'assigned' },
        { path: 'team'},
        { path: 'tags'},
      ])
      console.log('chatUpdate', chatUpdate)
      return chatUpdate 
    } else {
      
      const chatUpdate = await Chat.findOneAndUpdate({ _id: chatId }, body, { new: true, }).populate(
        [
          { path: 'linked' },
          { path: 'assigned' },
          { path: 'team'},
          { path: 'tags'},
        ])
      return chatUpdate  
    }
    
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateMany = async (query, body) => {
  try {
    const chats = await Chat.updateMany(query, { "$set": { ...body } })
    return chats
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const updateManyOther = async (query, body) => {
  try {
    const chats = await Chat.updateMany(query, body)
    return chats
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)
  let chat
  try {
    chat = await Chat.findOne(query, select).populate(populate)
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }

  if (chat === null) {
    const error = {
      status: 404,
      menssage: 'El chat no se encontro'
    }

    throw error
  }

  return chat
}

const detailOnly = async params => {
  const { query, select, populate } = transformParams(params)
  const chat = await Chat.findOne(query, select).populate(populate)
  return chat
}

const remove = async chatId => {
  const chat = Chat.findOne({ _id: chatId })

  if (chat === null) {
    const error = {
      status: 404,
      chat: 'El chat no se encontro'
    }

    throw error
  }

  try {
    const chatRemove = Chat.deleteOne({ _id: chatId })
    return chatRemove
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const removeMany = async query => {
  
  try {
    const chats = await Chat.deleteMany(query)

    return chats
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
  filter,
  filterMsg,
  updateMany,
  updateManyOther,
  detail,
  detailOnly,
  remove,
  aggregate,
  removeMany
}
