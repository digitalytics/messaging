//@ts-check
const { Schema, model } = require("mongoose");
const { DBCONSTANTS } = require("../constant/dbConstants");

const moduleSchema = new Schema(
  {
    title: {
      type: String
    },
    code: {
      type: String,
      unique: true
    }
  },
  { timestamps: true, versionKey: false }
);

const modules = model(DBCONSTANTS.MODULE, moduleSchema);
module.exports = modules;
