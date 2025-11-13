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
  try {
    // Paso 1: obtener los IDs de los chats que tienen coincidencias en message.text
    const matchingChatIdsAgg = await Message.aggregate([
      {
        $match: {
          text: { $regex: params.value, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$chat'
        }
      }
    ]);

    const matchingChatIds = matchingChatIdsAgg.map(item => item._id);

    if (matchingChatIds.length === 0) {
      return []; // No hay coincidencias
    }

    // Paso 2: armar filtro principal
    const matchQuery = {
      _id: { $in: matchingChatIds },
      company: new mongoose.Types.ObjectId(params.company),
      option: params.option
    };

    if (params.assigned !== '') {
      matchQuery.assigned = new mongoose.Types.ObjectId(params.assigned);
    }

    if (params.connection !== 'Seleccionar conexión') {
      matchQuery.connection = new mongoose.Types.ObjectId(params.connection);
    }

    if (params.team !== 'Seleccionar equipo') {
      matchQuery.team = new mongoose.Types.ObjectId(params.team);
    }

    const pipeline = [
      { $match: matchQuery },

      // Lookups para enriquecer los chats
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

      // Filtro opcional por tags
      ...(Array.isArray(params.tags) && params.tags.length > 0
        ? [
            {
              $match: {
                'linked.tags': {
                  $in: params.tags.map(tag => new mongoose.Types.ObjectId(tag))
                }
              }
            }
          ]
        : []),

      // Orden y paginación
      { $sort: { updatedAt: -1 } },
      { $skip: parseInt(params.page) * parseInt(params.limit) },
      { $limit: parseInt(params.limit) },

      // Selección de campos a retornar
      {
        $project: {
          _id: 1,
          updatedAt: 1,
          createdAt: 1,
          assigned: 1,
          team: 1,
          connection: 1,
          linked: {
            _id: '$linked._id',
            names: '$linked.names',
            mobile: '$linked.mobile',
            mobileCode: '$linked.mobileCode',
            username: '$linked.username',
            email: '$linked.email',
            firstName: '$linked.firstName',
            lastName: '$linked.lastName',
            photo: '$linked.photo',
            tags: '$linked.tags'
          },
          mobile: 1,
          names: 1,
          mobileCode: 1,
          lastMessage: 1,
          previousMessage: 1,
          previousMessageType: 1,
          lastChannel: 1,
          lastMessageType: 1,
          lastMessageStatus: 1,
          read: 1,
          count: 1,
          phoneNoId: 1,
          auto: 1,
          country: 1,
          date: 1,
          create: 1,
          channel: 1,
          company: 1,
          bot: 1,
          name: 1,
          transmitter: 1,
          option: 1,
          status: 1
        }
      }
    ];

    const chats = await Chat.aggregate(pipeline);
    return chats;
  } catch (error) {
    console.error('Error en filterMsg:', error);
    throw error;
  }
};

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
    } else if (body.isNotChangeTime) {
      await Chat.collection.updateOne(
        { _id: mongoose.Types.ObjectId(chatId) },
        { $set: {stage: mongoose.Types.ObjectId(body.stage)} }
      )
      const chatUpdate = await Chat.findById(chatId).populate([
        { path: 'linked' },
        { path: 'assigned' },
        { path: 'team' },
        { path: 'tags' }
      ]);
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

const updateManyTime = async (stage, body) => {
  try {
    await Chat.collection.updateMany(
      { stage: mongoose.Types.ObjectId(stage) },
      { $set: {stage: mongoose.Types.ObjectId(body.stage)} }
    )
  } catch (errorDB) {
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
  try {
    const { query, select, populate } = transformParams(params) || {}

    if (!query) {
      console.warn('No se proporcionó una query válida en transformParams')
      return null
    }

    let queryBuilder = Chat.findOne(query, select)

    if (populate) {
      queryBuilder = queryBuilder.populate(populate)
    }

    const chat = await queryBuilder.exec()

    return chat || null
  } catch (error) {
    console.error('Error en detailOnly:', error)
    return null
  }
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
  updateManyTime,
  updateManyOther,
  detail,
  detailOnly,
  remove,
  aggregate,
  removeMany
}
