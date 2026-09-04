//@ts-check
const { signIn, signOut, ForgotPassword, ResetPassword } = require("../../controller/admin/auth");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { defaultLanguage } = require("../../config");
const { errorHandler } = require("../../utils/errorHandler");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { validateEmail } = require("../../utils/common");

module.exports = function (fastify, opts, done) {
  fastify.post("/sign-in", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      if (validateEmail(request.body?.email)) {
        throw errorHandler(ERROR_MESSAGES.LBL_INVALID_EMAIL_ADDRESS?.[code], RESPONSE_CODE.NotAcceptable);
      }
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await signIn(code, request.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.post("/sign-out", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await signOut(code, request.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.post("/forgot-password", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      if (validateEmail(request.body?.email)) {
        throw errorHandler(ERROR_MESSAGES.LBL_INVALID_EMAIL_ADDRESS?.[code], RESPONSE_CODE.NotAcceptable);
      }
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await ForgotPassword(code, request.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.post("/reset-password", async (request, replay) => {
    try {
      const code = request.headers["code"] || defaultLanguage;
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await ResetPassword(code, request.body)));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });

  done();
};
