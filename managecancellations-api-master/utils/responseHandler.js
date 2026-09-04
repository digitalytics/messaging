//@ts-check
const config = require("../config");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("./errorHandler");
const { ERROR_MESSAGES } = require("../constant/errorMessages");

const failure = (error) => {
  try {
    return formatResponse(error, null);
  } catch (error) {
    return formatResponse(
      errorHandler(ERROR_MESSAGES.LBL_INTERNAL_SERVER[config.defaultLanguage], RESPONSE_CODE.BadRequest),
      null
    );
  }
};

const formatResponse = (error, payload) => {
  if (error) {
    if (process.env.NODE_ENV === "production") {
      return {
        error: {
          message: error?.message
        }
      };
    } else {
      return {
        error: {
          message: error?.message,
          stack: error?.stack
        }
      };
    }
  }
  return {
    payload
  };
};

module.exports = {
  failure,
  formatResponse
};
