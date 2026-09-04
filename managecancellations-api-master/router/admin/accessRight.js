//@ts-check
const { updateAccess, listAccess } = require("../../controller/admin/accessRight");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { defaultLanguage } = require("../../config");
const { validateAdmin } = require("../../utils/common");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", async (request, reply) => {
    const userToken = await validateAdmin(request, reply);
    if (request?.body) {
      // @ts-ignore
      request.body.userID = userToken?._id;
    } else {
      // @ts-ignore
      request.body = { userID: userToken?._id };
    }
  });

  fastify.get("/list-access", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await listAccess(code, requestQuery)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.patch("/update-access", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await updateAccess(code, request?.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  done();
};
