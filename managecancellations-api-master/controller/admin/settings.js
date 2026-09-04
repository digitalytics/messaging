///@ts-check

const { DBCONSTANTS } = require("../../constant/dbConstants");
const { updateSingleGenrics, selectSingleInfoGenrics } = require("../genrics");

const getSettingsInfo = async ({ body }) => {
  let { projectStage } = body;
  projectStage = projectStage ? projectStage : {};
  return selectSingleInfoGenrics({ tableName: DBCONSTANTS.SETTINGS, matchStage: {}, projectStage });
};
const updateSettings = async ({ body }) => {
  const updateResponse = await updateSingleGenrics({
    tableName: DBCONSTANTS.SETTINGS,
    matchStage: {},
    updateStage: {
      $set: body
    },
    options: { upsert: true }
  });
  return {
    success: !!(updateResponse?.modifiedCount || updateResponse?.upsertedCount)
  };
};

module.exports = {
  updateSettings,
  getSettingsInfo
};
