//@ts-check
const { Schema, model } = require("mongoose");
const { STATUS_CONSTANTS } = require("../constant/status");
const { DBCONSTANTS } = require("../constant/dbConstants");

const roleSchema = new Schema(
  {
    title: {
      type: String
    },
    status: {
      type: String,
      enum: [STATUS_CONSTANTS.ACTIVE, STATUS_CONSTANTS.INACTIVE],
      default: STATUS_CONSTANTS.ACTIVE
    }
  },
  { timestamps: true, versionKey: false }
);
const role = model(DBCONSTANTS.ROLE, roleSchema);
module.exports = role;
