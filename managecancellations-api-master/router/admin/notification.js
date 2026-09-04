//@ts-check
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { defaultLanguage } = require("../../config");
const { listSort, sendNotification } = require("../../controller/admin/notification");

module.exports = function (fastify, opts, done) {

  fastify.get("/list-sort", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await listSort(code, requestQuery)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.post("/send", async (request, replay) => {
    try {
      const requestBody = { ...request?.body };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await sendNotification(requestBody)));
    } catch (error) {
      replay.status(Number.isInteger(error?.code) ? error.code : 500).send(failure(error));
    }
  });

  done();
};
