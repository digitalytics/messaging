//@ts-check
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { defaultLanguage } = require("../../config");
const { create, action, list, listSort, update } = require("../../controller/admin/module");
const {
  createSchema,
  listSchema,
  listSortSchema,
  updateSchema,
  actionSchema
} = require("../../schema/admin/module");

module.exports = function (fastify, opts, done) {
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
  done();
};
