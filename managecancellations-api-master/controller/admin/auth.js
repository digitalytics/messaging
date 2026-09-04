///@ts-check
const { DBCONSTANTS } = require("../../constant/dbConstants");
const { ERROR_MESSAGES } = require("../../constant/errorMessages");
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { errorHandler } = require("../../utils/errorHandler");
const { encrypt, signToken } = require("../../utils/common");
const { selectWithAndOne, updateMany } = require("../../utils/queryCreator");
const { CONFIG } = require("../../constant/configConstants");

const signIn = async (code, body) => {
  const { email, password } = body;
  const userData = await selectWithAndOne(
    DBCONSTANTS.ADMIN,
    { email: email.trim() },
    {
      _id: 1,
      password: 1,
      status: 1,
      email: 1,
      name: 1,
      loginAt: 1,
      roleId: 1
    }
  );
  if (!userData) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_EMAIL_ADDRESS?.[code], RESPONSE_CODE.ResourceNotFound);
  }
  const encryptPassword = await encrypt(password.toString());
  if (encryptPassword !== userData.password) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_PASSWORD?.[code], RESPONSE_CODE.Invalid);
  }
  if (userData.status === "inactive") {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_INACTIVE?.[code], RESPONSE_CODE.NotActive);
  }
  const token = await signToken({
    payload: {
      _id: userData?._id
    },
    expiresIn: CONFIG?.APIexpiresIn
  });
  userData.token = token;
  const rights = await selectWithAndOne(DBCONSTANTS?.ACCESS_RIGHT, {
    roleID: userData?.roleId
  }, { _id: 1, accessData: 1 });
  if (!rights) {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCESS_NOT_EXISTS?.[code], RESPONSE_CODE.Conflict)
  }
  const roleData = await selectWithAndOne(DBCONSTANTS?.ROLE, {
    _id: userData?.roleId
  }, { _id: 1, title: 1 });
  userData.accessData = rights?.accessData || []
  userData.roleTitle = roleData?.title || ""
  const updateData = {
    loginAt: new Date(),
    lastLogin: userData?.loginAt || new Date()
  };
  console.log(updateData);
  await updateMany(DBCONSTANTS.ADMIN, { _id: userData?._id }, updateData);
  return userData;
};

const signOut = async (code, body) => {
  const { loginlog_id = "" } = body;
  if (loginlog_id && loginlog_id !== "") {
    await updateMany(DBCONSTANTS.LOGINLOG, { _id: loginlog_id }, { logoutDate: new Date() });
  }

  return {};
};

const ForgotPassword = async (code, body) => {
  const { email } = body;
  const userData = await selectWithAndOne(
    DBCONSTANTS.ADMIN,
    { email: email.trim() },
    {
      _id: 1,
      password: 1,
      status: 1,
      email: 1,
      name: 1
    }
  );
  if (!userData) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_EMAIL_ADDRESS?.[code], RESPONSE_CODE.ResourceNotFound);
  }
  if (userData.status === "inactive") {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_INACTIVE?.[code], RESPONSE_CODE.NotActive);
  }
  const resetCode =
    "USE" +
    Math.round(Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))
      .toString(36)
      .slice(1);
  await updateMany(DBCONSTANTS.ADMIN, { email: email.trim() }, { resetCode });
  return userData;
};

const ResetPassword = async (code, body) => {
  const { resetCode, password } = body;
  const userData = await selectWithAndOne(DBCONSTANTS.ADMIN, { resetCode }, { _id: 1, status: 1, email: 1, name: 1 });
  if (!userData) {
    throw errorHandler(ERROR_MESSAGES.LBL_CODE_ALREADY_USED?.[code], RESPONSE_CODE.ResourceNotFound);
  }
  if (userData.status === "inactive") {
    throw errorHandler(ERROR_MESSAGES.LBL_ACCOUNT_INACTIVE?.[code], RESPONSE_CODE.NotActive);
  }
  await updateMany(
    DBCONSTANTS.ADMIN,
    { _id: userData._id },
    {
      resetCode: "",
      password: password ? await encrypt(password.toString()) : ""
    }
  );
  return userData;
};

module.exports = { signIn, signOut, ForgotPassword, ResetPassword };
