///@ts-check
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const { selectWithAndOne, updateSingle } = require("../../utils/queryCreator");

const listAccess = async (code, body) => {
  const list = await selectWithAndOne(DBCONSTANTS.ACCESS_RIGHT, { roleID: body.roleID }, { _id: 1, accessData: 1 });
  if (!list) {
    throw errorHandler(ERROR_MESSAGES.LBL_RECORD_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict);
  }
  return list;
};

const updateAccess = async (code, body) => {
  const updateResponse = await updateSingle(DBCONSTANTS.ACCESS_RIGHT, {
    roleID: body.roleID
  }, {
    accessData: body.accessData
  });
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_RECORD_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

module.exports = { updateAccess, listAccess };