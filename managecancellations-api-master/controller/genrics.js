const { defaultLanguage } = require("../config");
const { selectWithAndOne, updateSingle, insertSingle, selectWithAnd, joinWithAnd } = require("../utils/queryCreator");

const insertSingleGenrics = async ({ tableName, insertStage }) => {
  const response = await insertSingle(tableName, insertStage);
  return JSON.parse(JSON.stringify(response));
};
const selectSingleInfoGenrics = async ({ tableName, matchStage, projectStage }) => {
  return await selectWithAndOne(tableName, matchStage, projectStage);
};
const selectMultipleInfoGenrics = async ({ tableName, matchStage, projectStage }) => {
  return await selectWithAnd(tableName, matchStage, projectStage);
};
const updateSingleInfoGenrics = async ({ tableName, matchStage, updateStage }) => {
  return await updateSingle(tableName, matchStage, updateStage);
};
const selectAggregateGenrics = async ({ tableName, pipeLine }) => {
  return await joinWithAnd(tableName, pipeLine);
};
const updateSingleGenrics = async ({ tableName, matchStage, updateStage, options = {} }) => {
  return await updateSingle(tableName, matchStage, updateStage, defaultLanguage, options);
};
module.exports = {
  selectSingleInfoGenrics,
  updateSingleInfoGenrics,
  insertSingleGenrics,
  selectMultipleInfoGenrics,
  selectAggregateGenrics,
  updateSingleGenrics
};
