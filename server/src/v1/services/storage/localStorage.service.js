const fs = require("fs");
const crypto = require("crypto");
const httpStatus = require("http-status");
const { ApiError } = require("../../middleware/apiError");
const errors = require("../../config/errors");

const storeFile = async (file) => {
  try {
    const readFile = Buffer.from(file.data, "base64");
    const diskName = crypto.randomUUID();
    const extension = file.mimetype.split("/")[1];
    const name = `${diskName}.${extension}`;
    const path = `/${name}`;
    fs.writeFileSync(`./uploads${path}`, readFile, "utf8");

    return { name, path };
  } catch (err) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.system.fileUploadError;
    throw new ApiError(statusCode, message);
  }
};

const deleteFile = async (file) => {
  try {
    if (!file || !file.name || !file.path) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidFile;
      throw new ApiError(statusCode, message);
    }

    fs.unlink(`./uploads${file.path}`, (err) => {
      if (err) {
        throw err;
      }
    });

    return true;
  } catch (err) {
    if (!(err instanceof ApiError)) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.fileUploadError;
      err = new ApiError(statusCode, message);
    }

    throw err;
  }
};

module.exports = {
  storeFile,
  deleteFile,
};
