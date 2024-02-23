'use strict'

const Embedding = require('../models/embedding')

const { transformParams } = require('utils').transform
// const { parseErrorDB } = require('utils').errors

const count = async params => {
  const { query } = transformParams(params)
  const count = await Embedding.countDocuments(query)
  return count
}

const list = async params => {
  const { query, select, populate, sort, limit, skip } = transformParams(params)

  const embedding = await Embedding.find(query, select)
    .populate(populate)
    .sort(sort)
    .limit(limit)
    .skip(skip)

  return embedding
}

const create = async body => {
  try {
    const embedding = await Embedding.create(body)

    return embedding
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const createMultipleEmbeddings = async data => {
  try {
    const embeddings = await Embedding.insertMany(data)

    return embeddings
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const vectorialSearch = async (embedding, botId, limit=5) => {

  const documents = await Embedding.aggregate([
    {
      "$vectorSearch": {
        "queryVector": embedding,
        "path": "embedding",
        "numCandidates": 100,
        "limit": limit,
        "index": "vector_index",
        "filter": {
          "botString": { "$eq": botId.toString() }
        }
      }
    },
    {
      "$project": {
        "text": 1,
        "score": { "$meta": "vectorSearchScore" },
      }
    }
  ]);

  return documents;
}

const update = async (embeddingId, body) => {
  const embedding = await Embedding.findOne({ _id: embeddingId })

  if (embedding === null) {
    const error = {
      status: 404,
      message: 'El embedding que intentas editar no existe.'
    }
    throw error
  }

  try {
    const embedding = await Embedding.findOneAndUpdate({ _id: embeddingId }, body, {
      new: true
    })

    return embedding
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const detail = async params => {
  const { query, select, populate } = transformParams(params)

  try {
    const embedding = await Embedding.findOne(query, select).populate(populate)

    if (embedding === null) {
      const error = {
        status: 404,
        message: 'El archivo no existe.'
      }
      throw error
    }

    return embedding
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const remove = async embeddingId => {
  const embedding = await Embedding.findOne({ _id: embeddingId })

  if (embedding === null) {
    const error = {
      status: 404,
      message: 'El archivo que intentas eliminar no existe.'
    }
    throw error
  }

  try {
    await Embedding.deleteOne({ _id: embeddingId })

    return embedding
  } catch (errorDB) {
    // const error = parseErrorDB(errorDB)
    throw errorDB
  }
}

const removeMultipleEmbeddings = async query => {
  try {
    const embeddings = await Embedding.deleteMany(query)

    return embeddings
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
  remove,
  createMultipleEmbeddings,
  removeMultipleEmbeddings,
  vectorialSearch
}
