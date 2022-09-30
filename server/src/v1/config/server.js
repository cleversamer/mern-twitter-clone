const PORT = process.env["PORT"] || 4000;

const DATABASE_NAME = "starter-app";

const DATABASE_URI =
  process.env["MONGODB_URI"] || `mongodb://127.0.0.1:27017/${DATABASE_NAME}`;

module.exports = {
  PORT,
  DATABASE_NAME,
  DATABASE_URI,
};
