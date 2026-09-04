//@ts-check
const { Schema, model } = require("mongoose");
const { DBCONSTANTS } = require("../constant/dbConstants");
const { STATUS_CONSTANTS } = require("../constant/status");

const notificationSchema = new Schema(
  {
    patientID: {
      type: String
    },
    patientName: {
      type: String
    },
    countrycode: {
      type: String
    },
    homephone: {
      type: String
    },
    email: {
      type: String
    },
    subject: {
      type: String
    },
    message: {
      type: String
    },
    appointmentid: {
      type: String
    },
    waitlistid: {
      type: String
    },
    departmentName: {
      type: String
    },
    priority: {
      type: String
    },
    slotDate: {
      type: String
    },
    slotTime: {
      type: String
    },
    providerName: {
      type: String
    },
    appointmentType: {
      type: String
    },
    status: {
      type: String,
      enum: [STATUS_CONSTANTS.PENDING, STATUS_CONSTANTS.DELIVERED, STATUS_CONSTANTS.FAILED],
      default: STATUS_CONSTANTS.PENDING
    }
  },
  { timestamps: true, versionKey: false }
);

const notifications = model(DBCONSTANTS.NOTIFICATION, notificationSchema);
module.exports = notifications;
