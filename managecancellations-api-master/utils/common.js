/* eslint-disable no-console */
//@ts-check
const { ERROR_MESSAGES } = require("../constant/errorMessages");
const { RESPONSE_CODE } = require("../constant/responseCode");
const { errorHandler } = require("./errorHandler");
const { Types } = require("mongoose");
const { defaultLanguage, aws, JWT } = require("../config");
const awsHandler = require("../utils/aws-handler");
const AWSHandler = new awsHandler();
AWSHandler.config({ keyId: aws.keyId, key: aws.key, region: aws.region });
const { failure } = require("./responseHandler");
const jwt = require("jsonwebtoken");
const { CONFIG } = require("../constant/configConstants");
const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const password = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";

const validateEmail = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !emailRegex.test(email);
};

const validateMobile = (mobile) => {
  const mobileRegex = /^[6789]\d{9}$/;
  return !mobileRegex.test(mobile);
};

const isValidObjectID = ({ ID, CODE = defaultLanguage }) => {
  if (!Types.ObjectId.isValid(ID)) {
    throw errorHandler(ERROR_MESSAGES.LBL_INVALID_ID?.[CODE], RESPONSE_CODE.BadRequest);
  }
};

const toObjectID = ({ ID }) => {
  isValidObjectID({ ID });
  return new Types.ObjectId(ID);
};
const getObjectID = () => {
  return new Types.ObjectId();
};

const generateInviteCode = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const uploadFile = async (file, bucket, isPrivate = false) => {
  const randomStr = generateInviteCode(9);
  const fileType = file.mimetype;
  const fileExt = file.filename.split(".").pop();
  file.file_name = `${randomStr}.${fileExt}`;
  file.bucket = bucket;
  file.contentType = fileType;
  const imgData = await AWSHandler.imageUpload(file, isPrivate);
  return { url: imgData.Location, file: file.file_name };
};

const deleteFile = async (body) => {
  const { ID, bucketName } = body;
  const fileName = `${aws?.folderName}/${aws?.S3BucketNoPrefix?.[bucketName]}/${ID}`;
  await AWSHandler.imageDelete({
    objects: [{ Key: fileName }],
    bucket: aws?.bucketName
  });
  return {
    success: true
  };
};

const writeFile = async (htmlTemplate, fileName, bucket) => {
  let writeData = await AWSHandler.writeFile(htmlTemplate, fileName, bucket, "db");
  return writeData.Location;
};
const getImageURL = async (bucketName, imageName) => {
  let folder = bucketName.split("/");
  folder.shift();
  folder = folder.join("/");
  const image = await AWSHandler.imageGet({
    bucket: aws.bucketName,
    key: `${folder}/${imageName}`
  });
  return image.body;
};

const signToken = async ({ payload, expiresIn = CONFIG?.APIexpiresIn }) => {
  const secret = JWT?.secret ?? "";
  return jwt?.sign(payload, secret, { expiresIn });
};

const validateAdmin = async (request, reply) => {
  const code = request.headers["code"] || defaultLanguage;
  try {
    const secret = JWT.secret ?? "";
    const { authorization } = request.headers;
    return jwt.verify(authorization, secret);
  } catch (error) {
    reply
      .status(RESPONSE_CODE.Unauthorized || 500)
      .send(failure(errorHandler(ERROR_MESSAGES.LBL_INVALID_USER?.[code], RESPONSE_CODE.Unauthorized)));
  }
};

const generateOTPCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// crypto.createCipher was removed in modern Node.js; this replicates its
// legacy key/IV derivation (EVP_BytesToKey, md5, no salt) via createCipheriv
// so it stays byte-compatible with values already encrypted by createCipher.
const deriveKeyIv = (secret, keyLen, ivLen) => {
  let derived = Buffer.alloc(0);
  let prev = Buffer.alloc(0);
  while (derived.length < keyLen + ivLen) {
    prev = crypto.createHash("md5").update(Buffer.concat([prev, Buffer.from(secret)])).digest();
    derived = Buffer.concat([derived, prev]);
  }
  return { key: derived.subarray(0, keyLen), iv: derived.subarray(keyLen, keyLen + ivLen) };
};

const encrypt = (text) => {
  return new Promise((resolve) => {
    const { key, iv } = deriveKeyIv(password, 32, 16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(text, "utf8", "hex");
    crypted += cipher.final("hex");
    resolve(crypted);
    return;
  });
};

function generateIdTag() {
  return Array.from(
    { length: 18 },
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
  ).join("");
}

function generateId(lable) {
  let timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  let randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(4, "0"); // Generate random number between 0 and 999 and pad with leading zeros
  return `${lable}${timestamp}${randomNum}`; // Concatenate timestamp and random number to create unique ID
}

function generateTransactionId() {
  // let timestamp = new Date().getTime().toString(); // Get current timestamp as a string
  let randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(4, "0"); // Generate random number between 0 and 999 and pad with leading zeros
  return parseInt(randomNum); // Concatenate timestamp and random number to create unique ID
}


const convertM2H = (totalTimeInMin) => {
  return `${Math.floor(totalTimeInMin / 60) <= 9 ? `0${Math.floor(totalTimeInMin / 60)}` : Math.floor(totalTimeInMin / 60)
    }:${totalTimeInMin % 60 <= 9 ? `0${totalTimeInMin % 60}` : totalTimeInMin % 60 || "00"}`;
};

module.exports = {
  validateEmail,
  isValidObjectID,
  generateInviteCode,
  toObjectID,
  uploadFile,
  getImageURL,
  validateMobile,
  validateAdmin,
  signToken,
  generateOTPCode,
  writeFile,
  getObjectID,
  deleteFile,
  encrypt,
  generateIdTag,
  generateTransactionId,
  convertM2H,
  generateId,
};
