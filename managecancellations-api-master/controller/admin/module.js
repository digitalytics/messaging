///@ts-check
const { pluck } = require("underscore");
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const {
  insertSingle,
  selectWithAndOne,
  updateSingle,
  updateMany,
  selectWithAnd,
  removeMultiple,
  joinWithAnd
} = require("../../utils/queryCreator");
const { default: mongoose } = require("mongoose");

const create = async (code, body) => {
  let accessRights = await selectWithAnd(DBCONSTANTS?.ACCESS_RIGHT, {}, { _id: 1, accessData: 1 });
  // @ts-ignore
  if (accessRights?.length > 0) {
    let promise = []
    for (let x in accessRights) {
      let data = accessRights[x].accessData;
      const isAdminExist = data.some(permission => permission.code === body?.code);
      if (!isAdminExist) {
        data.push({
          title: body.title,
          code: body.code,
          data: {
            is_view: false,
            is_edit: false,
            is_delete: false,
            is_add: false
          }
        })
        promise.push(updateSingle(DBCONSTANTS.ACCESS_RIGHT, {
          _id: new mongoose.Types.ObjectId(accessRights[x]._id)
        }, { accessData: data }))
      }
    }
    Promise.all(promise)
      .then(async result => {
        console.log(result)
        await insertSingle(DBCONSTANTS.MODULE, body, code)
        return {
          userRegistered: true
        }
      }).catch(error => {
        console.log(error)
        throw error
      })
  } else {
    await insertSingle(DBCONSTANTS.MODULE, body, code);
    return true;
  }
};
const list = async (code, body) => {
  const { ID = "" } = body;
  if (ID && ID !== "") {
    const singleData = await selectWithAndOne(
      DBCONSTANTS.MODULE,
      { _id: ID },
      { _id: 1, title: 1, code: 1 }
    );
    if (!singleData) {
      throw errorHandler(ERROR_MESSAGES.LBL_RECORD_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict);
    }
    return singleData;
  }
  let compairData = {};
  let listData = await selectWithAnd(
    DBCONSTANTS.MODULE,
    compairData,
    {
      _id: 1,
      title: 1,
      code: 1
    },
    { orderNo: 1 }
  );
  return listData;
};

const update = async (code, body) => {
  const { _id } = body;
  const updateResponse = await updateSingle(DBCONSTANTS.MODULE, { _id: _id }, body);
  if (!updateResponse?.matchedCount) {
    throw errorHandler(ERROR_MESSAGES.LBL_RECORD_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
  }
  return true;
};

const action = async (code, body) => {
  const { type, ids } = body;
  if (type === "delete") {
    const moduleData = await selectWithAnd(DBCONSTANTS?.MODULE, { _id: ids }, { _id: 1, code: 1 });
    let accessRights = await selectWithAnd(DBCONSTANTS?.ACCESS_RIGHT, {}, { _id: 1, accessData: 1 });
    let promise = []
    const moduleCodes = pluck(moduleData, 'code');
    for (let x in accessRights) {
      let data = accessRights[x].accessData
      // @ts-ignore
      const finalData = data.filter(record => !moduleCodes.includes(record?.code));
      promise.push(updateSingle(DBCONSTANTS?.ACCESS_RIGHT, { _id: accessRights[x]._id }, { accessData: finalData }))
    }
    Promise.all(promise)
      // @ts-ignore
      .then(async result => {
        await removeMultiple(DBCONSTANTS.MODULE, { _id: { $in: ids } });
        return true;
      })
  } else {
    const updateResponse = await updateMany(DBCONSTANTS.MODULE, { _id: { $in: ids } }, { status: type });
    if (!updateResponse?.matchedCount) {
      throw errorHandler(ERROR_MESSAGES.LBL_RECORD_NOT_EXISTS, RESPONSE_CODE.ResourceNotFound);
    }
    return true;
  }
};

const listSort = async (code, body) => {
  let page = body.page ? Number(body.page) : 0;
  let sizePerPage = body.sizePerPage ? Number(body.sizePerPage) : 10;
  const compairData = {};
  let sortBy = {};
  if (body.sortBy) {
    if (body.sortOrder === "desc") {
      sortBy[body.sortBy] = -1;
    } else {
      sortBy[body.sortBy] = 1;
    }
  } else {
    sortBy = { createdAt: 1 };
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
        code: new RegExp(body.search, "i")
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
        code: "$code",
        createdAt: "$createdAt",
        orderNo: 1,
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
  const response = await joinWithAnd(DBCONSTANTS.MODULE, joinArr);

  return response?.length ? response[0] : {};
};
module.exports = { create, list, update, action, listSort };
