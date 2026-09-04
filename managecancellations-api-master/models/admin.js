//@ts-check
const { Schema, model } = require("mongoose");
const { STATUS_CONSTANTS } = require("../constant/status");
const { DBCONSTANTS } = require("../constant/dbConstants");
const { LABEL_CONSTANT } = require("../constant/label");

const adminSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      trim: true,
      unique: true
    },
    photo: {
      type: String
    },
    password: {
      type: String
    },
    roleId: {
      type: Schema.Types.ObjectId
    },
    resetCode: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: [LABEL_CONSTANT.MALE, LABEL_CONSTANT.FEMALE],
      default: STATUS_CONSTANTS.MALE
    },
    lastLogin: {
      type: Date
    },
    loginAt: {
      type: Date
    },
    status: {
      type: String,
      enum: [STATUS_CONSTANTS.ACTIVE, STATUS_CONSTANTS.INACTIVE],
      default: STATUS_CONSTANTS.ACTIVE
    }
  },
  { timestamps: true, versionKey: false }
);
adminSchema.index({ email: 1 }, { unique: true });
const admin = model(DBCONSTANTS.ADMIN, adminSchema);
module.exports = admin;
