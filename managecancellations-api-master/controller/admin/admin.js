///@ts-check
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const { encrypt } = require("../../utils/common");
const { insertSingle, selectWithAndOne, updateMany, joinWithAnd, removeMultiple, updateSingle } = require("../../utils/queryCreator");
const { STATUS_CONSTANTS } = require("../../constant/status");

const create = async (code, body) => {
  const { email, password } = body;
  const query = { email: email.trim() };
  const isUserExists = await selectWithAndOne(DBCONSTANTS.ADMIN, query);
  if (isUserExists) {
    throw errorHandler(ERROR_MESSAGES.LBL_USER_ALREADY_EXISTS?.[code], RESPONSE_CODE.Conflict);
  }

  const sendData = {
    ...body,
    password: password ? await encrypt(password.toString()) : ""
  };
  await insertSingle(DBCONSTANTS.ADMIN, sendData, code);
  return {
    userRegistered: true
  };
};
const list = async (code, body) => {
  const { ID = "", status = "" } = body;
  if (ID && ID !== "") {
    const user = await selectWithAndOne(
      DBCONSTANTS.ADMIN,
      { _id: ID },
      {
        _id: 1,
        countryCode: 1,
        mobile: 1,
        email: 1,
        name: 1,
        roleId: 1,
        lastLogin: 1,
        gender: 1,
        dateOfBirth: 1,
        status: 1
      }
    );
    if (!user) {
      throw errorHandler(ERROR_MESSAGES.LBL_USER_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict);
    }
    return user;
  }
  let compairData = {};
  if (status && status !== "") {
    compairData.status = status;
  }
  let joinArr = [
    {
      $match: compairData
    },
    {
      $project: {
        _id: 1,
        name: 1,
        countryCode: 1,
        mobile: 1,
        email: 1,
        status: 1,
        roleId: 1,
        createdAt: 1
      }
    }
  ];
  const list = await joinWithAnd(DBCONSTANTS.ADMIN, joinArr);
  return list;
};

const update = async (code, body) => {
  const { email, _id } = body;
  const query = { email: email.trim(), _id: { $ne: _id } };
  const isUserExists = await selectWithAndOne(DBCONSTANTS.ADMIN, query);
  if (isUserExists) {
    throw errorHandler(ERROR_MESSAGES.LBL_USER_ALREADY_EXISTS?.[code], RESPONSE_CODE.Conflict);
  }
  const updateResponse = await updateMany(DBCONSTANTS.ADMIN, { _id: _id }, body);
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_USER_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

const action = async (code, body) => {
  const { type, ids } = body;
  if (type === "delete") {
    await removeMultiple(DBCONSTANTS.ADMIN, { _id: { $in: ids } });
    return {};
  }
  const updateResponse = await updateMany(DBCONSTANTS.ADMIN, { _id: { $in: ids } }, { status: type });
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_USER_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

const verifyUserSession = async ({ code, body }) => {
  const query = {
    _id: body?.userID
  };
  const userInfo = await selectWithAndOne(DBCONSTANTS.ADMIN, query, {
    _id: 1,
    mobile: 1,
    roleId:1
  });
  const settingData = await selectWithAndOne(
    DBCONSTANTS.SETTINGS,
    {},
    {
      defaultCurrency: 1
    }
  );
  if (!userInfo) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_USER[code], RESPONSE_CODE.ResourceNotFound);
  }
  if (userInfo?.status == STATUS_CONSTANTS.INACTIVE) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_INACTIVE[code], RESPONSE_CODE.NotActive);
  }
  if (userInfo?.status == STATUS_CONSTANTS.BANNED) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_BANNED[code], RESPONSE_CODE.Invalid);
  }
  let rights = await selectWithAndOne(DBCONSTANTS?.ACCESS_RIGHT, {
    roleID: userInfo?.roleId
  }, { _id: 1, accessData: 1 });
  if (!rights) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCESS_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict)
  }
  return {
    isValid: true,
    currency: settingData?.defaultCurrency,
    accessData: rights?.accessData || []
  };
};

const listSort = async (code, body) => {
  let page = body.page ? Number(body.page) : 0;
  let sizePerPage = body.sizePerPage ? Number(body.sizePerPage) : 10;
  const compairData = {};
  let sortBy = {};
  if (body.sortBy) {
    // sortBy = {}
    if (body.sortOrder === "desc") {
      sortBy[body.sortBy] = -1;
    } else {
      sortBy[body.sortBy] = 1;
    }
  } else {
    sortBy = { createdAt: -1 };
  }
  if (body.status && body.status !== "") {
    compairData.status = body.status;
  }
  if (body.search && body.search != "") {
    compairData["$or"] = [
      {
        _id: new RegExp(body.search, "i")
      },
      {
        email: new RegExp(body.search, "i")
      },
      {
        name: new RegExp(body.search, "i")
      },
      {
        status: new RegExp(body.search, "i")
      }
    ];
  }
  let joinArr = [
    {
      $addFields: {
        _id: { $toString: "$_id" }
      }
    },
    {
      $match: compairData
    },
    {
      $lookup: {
        from: "roles",
        localField: "roleId",
        foreignField: "_id",
        as: "roleDetails"
      }
    },
    {
      $unwind: {
        path: "$roleDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        email: "$email",
        createdAt: "$createdAt",
        name: "$name",
        lastLogin: "$lastLogin",
        role: "$roleDetails.title",
        status: "$status"
      }
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ],
        data: [{ $sort: sortBy }, { $skip: page * sizePerPage }, { $limit: sizePerPage }]
      }
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ["$metadata.total", 0] }
      }
    }
  ];
  const response = await joinWithAnd(DBCONSTANTS.ADMIN, joinArr);

  return response?.length ? response[0] : {};
};

const changePassword = async ({ code, body }) => {
  const { oldPassword, newPassword } = body;
  const encryptPassword = await encrypt(oldPassword.toString());
  const query = {
    password: encryptPassword,
  };
  const userInfo = await selectWithAndOne(DBCONSTANTS.ADMIN, query, {
    _id: 1,
    mobile: 1,
  });
  if (!userInfo) {
    throw errorHandler(ERROR_MESSAGES.LBL_OLD_PASSWORD_WRONG[code], RESPONSE_CODE.ResourceNotFound);
  }
  if (userInfo?.status == STATUS_CONSTANTS.INACTIVE) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_INACTIVE[code], RESPONSE_CODE.NotActive);
  }
  if (userInfo?.status == STATUS_CONSTANTS.BANNED) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_BANNED[code], RESPONSE_CODE.Invalid);
  }
  const encryptNewPassword = await encrypt(newPassword.toString());
  const updateResponse = await updateSingle(DBCONSTANTS.ADMIN, { _id: userInfo?._id }, {
    password: encryptNewPassword
  });
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_USER_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

module.exports = { create, list, update, action, verifyUserSession, listSort, changePassword };
