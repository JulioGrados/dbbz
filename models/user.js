'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const timestamps = require('mongoose-timestamp')
const mongooseBeautifulUniqueValidation = require('mongoose-beautiful-unique-validation')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: 'Ya existe un usuario con el mismo username.',
      sparse: true
    },
    names: {
      type: String,
      required: [true, 'Debes agregar tus nombres.']
    },
    email: {
      type: String,
      lowercase: true,
      unique: 'Ya existe una cuenta que tiene el mismo email.',
      required: [true, 'Debes agregar un email.'],
      sparse: true
    },
    mobile: {
      type: Number,
      unique: 'Ya existe una cuenta que tiene el mismo número de celular.',
      sparse: true
    },
    mobileCode: {
      default: 51,
      type: Number
    },
    firstNameCert: {
      type: String
    },
    lastNameCert: {
      type: String
    },
    beforeName: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    dni: {
      type: String,
      unique: 'Ya existe un usuario con el mismo DNI.',
      sparse: true
    },
    document: {
      type: String,
      default: 'DNI',
      enum: ['DNI', 'Carné de Extranjería', 'Pasaporte', 'Otros', 'AR DNI', 'BO DNI', 'BR DNI', 'CL DNI', 'CO DNI', 'CR DNI', 'CU DNI', 'DO DNI', 'EC DNI', 'MX DNI', 'PA DNI', 'PY DNI', 'UY DNI', 'VE DNI', 'CC', 'CE', 'NIT', 'PASS']
    },
    password: {
      type: String
    },
    city: {
      type: String
    },
    department: {
      type: String
    },
    country: {
      type: String
    },
    training: {
      type: String
    },
    relationship: {
      type: String
    },
    photo: {
      type: String
    },
    description: {
      type: String
    },
    address: {
      type: String
    },
    senderId: {
      type: String
    },
    call: {
      annexed: {
        type: String
      },
      token: {
        type: String
      }
    },
    zadarma: {
      annexed: {
        type: String
      },
      token: {
        type: String
      }
    },
    isZadarma: {
      type: Boolean,
      default: false
    },
    tokenRecover: {
      type: String
    },
    academicLevel: [
      {
        profession: {
          type: String
        },
        degree: {
          type: String
        }
      }
    ],
    roles: [
      {
        type: String,
        enum: [
          'Docente',
          'Administrador',
          'Interesado',
          'Estudiante',
          'Cliente',
          'Asesor',
          'Tesorero',
          'Recepcionista'
        ]
      }
    ],
    moodleId: {
      type: Number,
      unique: 'Ya existe un usuario con el mismo moodleId.',
      sparse: true
    },
    reasign: {
      username: {
        type: String
      },
      ref: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    shippings: [
      {
        moodleId: {
          type: Number
        },
        firstName: {
          type: String
        },
        lastName: {
          type: String
        },
        dni: {
          type: String
        },
        cellphone: {
          type: String
        },
        date: {
          type: Number
        },
        address: {
          type: String
        },
        priority: {
          type: String,
          default: 'Principal',
          enum: ['Principal', 'Secundario']
        },
        course: {
          name: {
            type: String
          },
          moodleId: {
            type: Number
          },
          ref: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
          }
        }
      }
    ],
    extras: [
      {
        type: {
          type: String,
          default: 'mobile',
          enum: ['mobile', 'email']
        },
        value: {
          type: String
        },
        code: {
          type: String
        },
        use: {
          type: String,
          default: 'Personal',
          enum: ['Personal', 'Whatsapp','Trabajo', 'Casa', 'Anulado', 'Otro']
        }
      }
    ],
    sellCourses: [
      {
        name: {
          type: String
        },
        price: {
          type: Number
        },
        ref: {
          type: Schema.Types.ObjectId,
          ref: 'Course'
        }
      }
    ],
    prospects: {
      type: Number,
      default: 0
    },
    phoneNoId: {
      type: String
    },
    orden: {
      type: Number
    },
    status: {
      type: Boolean,
      default: false
    },
    stage: {
      type: Boolean,
      default: false
    },
    position: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'users'
  }
)

UserSchema.plugin(timestamps, {
  createdAt: { index: true },
  updatedAt: { index: true }
})

UserSchema.plugin(mongooseBeautifulUniqueValidation)

UserSchema.index({
  username: 1,
  email: 1,
  names: 1,
  orden: 1,
  'extra.value': 1
})

module.exports = mongoose.model('User', UserSchema)
