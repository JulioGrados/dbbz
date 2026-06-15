# dbbz — Modelos Mongoose compartidos

Librería de esquemas de datos (MongoDB/Mongoose). `package.json` name: `db`. La consumen `apibz`, `crmbz` y `dashbz` como dependencia git privada. **Fuente de verdad del modelo de datos.**

> Detalle completo de cada entidad, campos, enums y relaciones: `../docs/data-model.md`.

## Estructura

| Carpeta/archivo | Qué hay |
|-----------------|---------|
| `models/` | 23 esquemas (un archivo por modelo): company, user, contact, connection, chat, message, bot, upload, embedding, pipeline, stage, team, tag, queue, subscription, payment, scheduledMessage, timeline, track, log, meta, whatsapp |
| `index.js` | Exporta todos los modelos (punto de importación) |
| `lib/` | Conexión/utilidades de base de datos |

## Uso

```js
const { Company, User, Chat, Message, Subscription /* … */ } = require('db');
```

## Convenciones

- Un modelo por archivo; expórtalo en `index.js`.
- Referencias entre entidades con `ObjectId` + `ref`; estados con `enum`.
- Casi toda entidad lleva `company` (multi-tenancy) y `timestamps`.
- Al **añadir/cambiar un campo**: actualiza el modelo aquí, republica la dependencia y actualiza `../docs/data-model.md`.

## Gotchas

- `models/note.js` está **vacío** (sin modelo).
- `models/whatsapp.js` es **legacy**: referencia `Deal` y `Template`, que **no existen** en `models/`. No construir sobre él sin verificar.
