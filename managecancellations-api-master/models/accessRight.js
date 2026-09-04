//@ts-check
const { Schema, model } = require("mongoose");
const { DBCONSTANTS } = require("../constant/dbConstants");

const accessRightSchema = new Schema(
  {
    roleID: {
      type: String,
      default: ""
    },
    accessData: {
        type: Array,
        default: [],
    }
  },
  { timestamps: true, versionKey: false }
);
accessRightSchema.index({ 'roleID': 1 }, { unique: true });
const accessRight = model(DBCONSTANTS.ACCESS_RIGHT, accessRightSchema);
module.exports = accessRight;
