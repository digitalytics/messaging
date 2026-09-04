///@ts-check
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { joinWithAnd, insertSingle } = require("../../utils/queryCreator");
const { STATUS_CONSTANTS } = require("../../constant/status");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const { sendEmail } = require("../../utils/email-handler");

const sendNotification = async ({
  patientID, patientName, email, homephone, countrycode,
  subject, message, appointmentid, waitlistid,
  departmentName, priority, slotDate, slotTime, providerName, appointmentType
}) => {
  let sendError = null;
  try {
    await sendEmail({ to: email, subject, html: message });
  } catch (error) {
    sendError = error;
  }
  const record = await insertSingle(DBCONSTANTS.NOTIFICATION, {
    patientID,
    patientName,
    email,
    homephone,
    countrycode,
    subject,
    message,
    appointmentid,
    waitlistid,
    departmentName,
    priority,
    slotDate,
    slotTime,
    providerName,
    appointmentType,
    status: sendError ? STATUS_CONSTANTS.FAILED : STATUS_CONSTANTS.DELIVERED
  });
  if (sendError) {
    throw errorHandler(`Failed to send email: ${sendError.message}`, RESPONSE_CODE.InternalServer);
  }
  return record;
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
        patientName: new RegExp(body.search, "i")
      },
      {
        homephone: new RegExp(body.search, "i")
      },
      {
        message: new RegExp(body.search, "i")
      }
    ];
  }
  if (body.status && body.status !== "all") {
    compairData["status"] = body.status;
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
        patientName: 1,
        email: 1,
        homephone: 1,
        countrycode: 1,
        subject: 1,
        message: 1,
        appointmentid: 1,
        waitlistid: 1,
        departmentName: 1,
        priority: 1,
        slotDate: 1,
        slotTime: 1,
        providerName: 1,
        appointmentType: 1,
        createdAt: 1,
        status: 1,
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
  const response = await joinWithAnd(DBCONSTANTS.NOTIFICATION, joinArr);

  return response?.length ? response[0] : {};
};
module.exports = { listSort, sendNotification };
