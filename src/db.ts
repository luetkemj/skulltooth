import * as PouchDB from 'pouchdb';

const pouchDB = PouchDB.default.defaults({})
const db = new pouchDB("skulltooth");

const todo = {
  _id: new Date().toISOString(),
  title: "helo",
  completed: false,
};

await db.put(todo, function callback(err, result) {
  if (!err) {
    console.log("Successfully posted a todo!");
  }
});

db.allDocs({include_docs: true, descending: true}, function(err, doc) {
  console.log(doc)
});

