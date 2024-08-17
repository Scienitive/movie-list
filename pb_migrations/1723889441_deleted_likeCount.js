/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("soo14cmaewak9oo");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "soo14cmaewak9oo",
    "created": "2024-08-17 10:08:46.895Z",
    "updated": "2024-08-17 10:08:46.895Z",
    "name": "likeCount",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j9zkjtlg",
        "name": "likeCount",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n    count(likes.id) as likeCount\nFROM likes\nWHERE likes.list = 2"
    }
  });

  return Dao(db).saveCollection(collection);
})
