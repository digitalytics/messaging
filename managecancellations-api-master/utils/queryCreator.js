//@ts-check
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const { ERROR_MESSAGES } = require("../constant/errorMessages");
const { errorHandler } = require("./errorHandler");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { defaultLanguage } = require("../config");
const { CONFIG } = require("../constant/configConstants");

fs.readdir(__dirname + "/../models/", (err, files) => {
  if (!err) {
    files.forEach((file) => {
      require(path.join(__dirname + "/../models/", file));
    });
  }
});

const handleDatabaseErrors = (error, code = defaultLanguage) => {
  // eslint-disable-next-line no-console
  console.log("error", error);
  const DB_ERROR_TYPE = {
    MONGO_SERVER_ERROR: "MongoServerError",
    VALIDATION_ERROR: "ValidationError",
    CAST_ERROR: "CastError"
  };
  if (error.name === DB_ERROR_TYPE?.MONGO_SERVER_ERROR) {
    if (error?.code === 11000) {
      if (error?.keyValue?.mobile) {
        throw errorHandler(ERROR_MESSAGES.LBL_MOBILE_ALREADY_EXISTS[code], RESPONSE_CODE.Conflict);
      } else if (error?.keyValue?.email) {
        throw errorHandler(ERROR_MESSAGES.LBL_EMAIL_ADDRESS_ALREADY_EXISTS[code], RESPONSE_CODE.Conflict);
      }
      throw errorHandler(ERROR_MESSAGES.LBL_ALREADY_EXIST[code], RESPONSE_CODE.Conflict);
    } else if (error?.code === 16755) {
      throw errorHandler(ERROR_MESSAGES.LBL_LOCATION_MISSING[code], RESPONSE_CODE.BadRequest);
    } else {
      throw error;
    }
  } else if (error.name === DB_ERROR_TYPE?.VALIDATION_ERROR) {
    throw errorHandler(ERROR_MESSAGES.LBL_VALIDATION_FAILED[code], RESPONSE_CODE.BadRequest);
  } else if (error.name === DB_ERROR_TYPE?.CAST_ERROR) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_DATATYPE[code], RESPONSE_CODE.BadRequest);
  } else {
    throw error;
  }
};

module.exports = {
  selectWithAnd: async (collectionName, comparisonColumnsAndValues = {}, columnsToSelect, sortColumnAndValues) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.find(comparisonColumnsAndValues, columnsToSelect).sort(sortColumnAndValues).lean();
    } catch (error) {
      handleDatabaseErrors(error);
    }
  },
  selectWithAndSortPaginate: async (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect,
    sizePerPage = CONFIG?.sizePerPage,
    page = CONFIG?.initialPage,
    columnToSort
  ) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection
        .find(comparisonColumnsAndValues, columnsToSelect)
        .sort(columnToSort)
        .limit(sizePerPage)
        .skip(sizePerPage * page)
        .lean();
    } catch (error) {
      handleDatabaseErrors(error);
    }
  },
  selectWithAndPaginate: async (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect,
    sizePerPage,
    page,
    code = defaultLanguage
  ) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      page = parseInt(page);
      sizePerPage = parseInt(sizePerPage);
      return await dbCollection
        .find(comparisonColumnsAndValues, columnsToSelect)
        .limit(sizePerPage)
        .skip(sizePerPage * page)
        .lean();
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  selectWithAndSort: async (
    collectionName,
    comparisonColumnsAndValues,
    columnsToSelect,
    columnToSort,
    code = defaultLanguage
  ) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.find(comparisonColumnsAndValues, columnsToSelect).sort(columnToSort).lean();
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  selectWithAndOne: async (collectionName, comparisonColumnsAndValues, columnsToSelect, code = defaultLanguage) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.findOne(comparisonColumnsAndValues, columnsToSelect).lean();
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  insertSingle: async (collectionName, columnsAndValues, code = defaultLanguage) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.create(columnsAndValues);
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  updateSingle: async (collectionName, targetColumnsAndValues, columnsToUpdate, code = defaultLanguage, options) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.updateOne(targetColumnsAndValues, columnsToUpdate, {
        multi: true,
        runValidators: true,
        ...options
      });
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  updateMany: async (collectionName, targetColumnsAndValues, columnsToUpdate, code = defaultLanguage, options) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.updateMany(targetColumnsAndValues, columnsToUpdate, {
        multi: true,
        runValidators: true,
        ...options
      });
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  removeMultiple: async (collectionName, targetColumnsAndValues) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.deleteMany(targetColumnsAndValues);
    } catch (error) {
      handleDatabaseErrors(error);
    }
  },
  removeSingle: async (collectionName, targetColumnsAndValues) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.deleteOne(targetColumnsAndValues);
    } catch (error) {
      handleDatabaseErrors(error);
    }
  },
  joinWithAnd: async (collectionName, params) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.aggregate(params).exec();
    } catch (error) {
      handleDatabaseErrors(error);
    }
  },
  insertMultiple: async (collectionName, columnsAndValues, code = defaultLanguage) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.insertMany(columnsAndValues);
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  },
  countRecord: async (collectionName, columnsAndValues, code = defaultLanguage) => {
    try {
      const dbCollection = mongoose.model(collectionName);
      return await dbCollection.countDocuments(columnsAndValues);
    } catch (error) {
      handleDatabaseErrors(error, code);
    }
  }
};
