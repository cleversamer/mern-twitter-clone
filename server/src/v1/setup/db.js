const config = require("../config/server");
const mongoose = require("mongoose");

module.exports = () => {
  const mongoURI = config.DATABASE_URI;

  mongoose
    .connect(mongoURI)
    .then((value) => {
      console.log(`Connected to MongoDB Server: ${mongoURI}`);
    })
    .catch((err) => {
      console.log(`Failed to connect to MongoDB Server: ${err.message}`);
    });
};
