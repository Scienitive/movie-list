/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xzgk37ssfama8lg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xf7snmhp",
    "name": "movies",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xzgk37ssfama8lg")

  // remove
  collection.schema.removeField("xf7snmhp")

  return dao.saveCollection(collection)
})
