const PORT = process.env["PORT"] || 4000;

const DATABASE_NAME = "starter-app";

const DATABASE_URI =
  process.env["MONGODB_URI"] || `mongodb://127.0.0.1:27017/${DATABASE_NAME}`;

const UPLOAD_LIMIT = "5mb";

module.exports = {
  PORT,
  DATABASE_NAME,
  DATABASE_URI,
  UPLOAD_LIMIT,
};
