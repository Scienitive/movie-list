/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hrclxaohl57yzuh")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_fSnX6g4` ON `likes` (\n  `user`,\n  `list`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hrclxaohl57yzuh")

  collection.indexes = []

  return dao.saveCollection(collection)
})
