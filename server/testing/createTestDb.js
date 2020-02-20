const mongoose = require("mongoose");

module.exports = function(dbName) {
  return {
    connection: mongoose.connection,
    connect: () => {
      mongoose.connect("mongodb://127.0.0.1:27017/" + dbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    },
    disconnect: done => {
      mongoose.connection.db.dropDatabase(() => mongoose.disconnect(done));
    }
  };
};
