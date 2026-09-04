//@ts-check
const { omit } = require("underscore");

function CustomError(message, code, name = "CustomError") {
  this.name = name;
  this.message = message || "Default Message";
  this.code = code;
  this.stack = new Error().stack;
}

CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;

module.exports.errorHandler = (...args) => {
  const error = new CustomError(args[0], args[1]);
  if (process.env.NODE_ENV !== "production") return error;
  return omit(error, "stack");
};
