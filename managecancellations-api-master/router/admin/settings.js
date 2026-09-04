//@ts-check
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { validateAdmin } = require("../../utils/common");
const { updateSettings, getSettingsInfo } = require("../../controller/admin/settings");
const { settingInfoSchema } = require("../../schema/admin/settings");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", async (request, reply) => {
    const userToken = await validateAdmin(request, reply);
    if (request?.body) {
      request.body.userID = userToken?._id;
    } else {
      request.body = { userID: userToken?._id };
    }
  });

  fastify.get("/info", settingInfoSchema, async (request, replay) => {
    try {
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await getSettingsInfo({ body: {} })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.patch("/update", async (request, replay) => {
    try {
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await updateSettings({ body: request?.body })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  done();
};
