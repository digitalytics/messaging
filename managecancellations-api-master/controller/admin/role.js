///@ts-check
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const { insertSingle, selectWithAndOne, updateMany, joinWithAnd, removeMultiple, selectWithAnd } = require("../../utils/queryCreator");
const { STATUS_CONSTANTS } = require("../../constant/status");
const { each } = require("underscore");

const create = async (code, body) => {
  const { title } = body;
  let model = await selectWithAnd(DBCONSTANTS?.MODULE, {}, { title: 1, code: 1 });
  let accessData = []
  // @ts-ignore
  each(model, single => {
    accessData.push({
      title: single?.title,
      code: single?.code,
      data: {
        is_view: false,
        is_edit: false,
        is_delete: false,
        is_add: false
      }
    })
  })
  const isRoleExists = await selectWithAndOne(DBCONSTANTS.ROLE, {title});
  if (isRoleExists) {
    throw errorHandler(ERROR_MESSAGES.LBL_ROLE_ALREADY_EXISTS?.[code], RESPONSE_CODE.Conflict);
  }
  const roleData = await insertSingle(DBCONSTANTS.ROLE, body, code);
  await insertSingle(DBCONSTANTS.ACCESS_RIGHT, { roleID: roleData?._id, accessData }, code)
  return {
    userRegistered: true
  };
};

const list = async (code, body) => {
  const { ID = "", status = "" } = body;
  if (ID && ID !== "") {
    const user = await selectWithAndOne(
      DBCONSTANTS.ROLE,
      { _id: ID },
      {
        _id: 1,
        title: 1,
        status: 1
      }
    );
    if (!user) {
      throw errorHandler(ERROR_MESSAGES.LBL_ROLE_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict);
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
        title:1,
        status: 1,
        createdAt: 1
      }
    }
  ];
  const list = await joinWithAnd(DBCONSTANTS.ROLE, joinArr);
  
  return list;
};

const update = async (code, body) => {
  const { title, _id, status } = body;
  const isRoleExists = await selectWithAndOne(DBCONSTANTS.ROLE, {title : title, _id: {$ne:_id}});
  if (isRoleExists) {
    throw errorHandler(ERROR_MESSAGES.LBL_ROLE_ALREADY_EXISTS?.[code], RESPONSE_CODE.Conflict);
  }
  const updateResponse = await updateMany(DBCONSTANTS.ROLE, { _id: _id }, body);
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_ROLE_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

const action = async (code, body) => {
  const { type, ids } = body;
  if (type === "delete") {
    await removeMultiple(DBCONSTANTS.ROLE, { _id: { $in: ids } });
    return {};
  }
  const updateResponse = await updateMany(DBCONSTANTS.ROLE, { _id: { $in: ids } }, { status: type });
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_ROLE_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return {
    userUpdate: true
  };
};

const verifyUserSession = async ({ code, body }) => {
  const query = {
    _id: body?.userID
  };
  const userInfo = await selectWithAndOne(DBCONSTANTS.ROLE, query, {
    _id: 1,
    mobile: 1
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
  return {
    isValid: true,
    currency: settingData?.defaultCurrency
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
        title: new RegExp(body.search, "i")
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
      $project: {
        _id: 1,
        title: "$title",
        status: "$status",
        createdAt:"$createdAt"
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
  const response = await joinWithAnd(DBCONSTANTS.ROLE, joinArr);

  return response?.length ? response[0] : {};
};

module.exports = { create, list, update, action, verifyUserSession, listSort };
