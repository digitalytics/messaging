//@ts-check
const { create, list, update, action, verifyUserSession, listSort } = require("../../controller/admin/role");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { defaultLanguage } = require("../../config");
const { errorHandler } = require("../../utils/errorHandler");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { validateAdmin } = require("../../utils/common");
const { createSchema, updateSchema, actionSchema, listSchema, listSortSchema } = require("../../schema/admin/role");

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

  fastify.put("/create", createSchema, async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await create(code, request.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.get("/list", listSchema, async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await list(code, requestQuery)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.get("/list-sort", listSortSchema, async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await listSort(code, requestQuery)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.patch("/update", updateSchema, async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await update(code, request?.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.patch("/action", actionSchema, async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await action(code, request?.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  fastify.get("/verifySession", async (request, reply) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      reply.status(RESPONSE_CODE.OK).send(formatResponse(null, await verifyUserSession({ code, body: request?.body })));
    } catch (error) {
      reply.status(error?.code || 500).send(failure(error));
    }
  });

  done();
};
