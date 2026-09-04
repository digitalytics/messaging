"use strict";
const AWS = require("aws-sdk");
const { aws } = require("../config");
// Image uplaod & delete in AWS s3
class S3Handler {
  constructor() {
    this._objectsToUpload = null;
    this._s3 = new AWS.S3();
    this.ses = new AWS.SES({ apiVersion: "2010-12-01" });
    this.sns = new AWS.SNS({ apiVersion: "2010-03-31", region: aws.snsRegion });
  }
  
  config(requestParam) {
    AWS.config.update({
      accessKeyId: requestParam.keyId,
      secretAccessKey: requestParam.key,
      region: requestParam.region
    });
    this._s3 = new AWS.S3();
    this.ses = new AWS.SES({ apiVersion: "2010-12-01" });
    this.sns = new AWS.SNS({ apiVersion: "2010-03-31", region: aws.snsRegion });
  }

  imageUpload(requestParam, isPrivate = false) {
    return new Promise((resolve, reject) => {
      let ACLOption = {};
      if (!isPrivate) ACLOption = { ACL: "public-read" };
      const params = {
        Bucket: requestParam.bucket,
        Key: requestParam.file_name,
        Body: requestParam.data,
        ContentType: requestParam.contentType,
        ...ACLOption
      };
      this._s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
        return;
      });
    });
  }
  imageDelete(requestParam) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: requestParam.bucket,
        Delete: {
          Objects: requestParam.objects,
          Quiet: false
        }
      };
      this._s3.deleteObjects(params, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
        return;
      });
    });
  }
  /**
   * Method used to get image on AWS using s3.
   *
   * @param {Object} requestParam - An object with keys bucket, key(path of image where it is stored)
   */
  imageGet(requestParam) {
    return new Promise((resolve, reject) => {
      this._s3.getSignedUrl(
        "getObject",
        { Bucket: requestParam.bucket, Key: requestParam.key, Expires: 300 },
        (error, s3Object) => {
          if (error) {
            reject(error);
            return;
          }

          if (!s3Object) {
            reject(new Error("null"));
            return;
          }

          const formattedObject = {
            body: s3Object
          };
          resolve(formattedObject);
          return;
        }
      );
    });
  }

  /**
   * Method used to send email on AWS using SES
   *
   * @param {Object} requestParam - An object with keys bucket, key(path of image where it is stored)
   */
  sendEmail(requestParam) {
    return new Promise((resolve, reject) => {
      if (aws.sesRegion && aws.sesRegion !== "") {
        AWS.config.update({
          region: aws.sesRegion
        });
        this.ses = new AWS.SES({ apiVersion: "2010-12-01" });
      }

      const params = {
        Destination: {
          ToAddresses: requestParam.to_email,
          CcAddresses: requestParam.cc_email || []
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: requestParam.description
            }
          },
          Subject: {
            Charset: "UTF-8",
            Data: requestParam.subject
          }
        },
        ReturnPath: requestParam.fromEmail,
        Source: requestParam.fromEmail
      };

      this.ses.sendEmail(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
        return;
      });
    });
  }
  
  /**
   * Method used to send email on AWS using SNS
   *
   * @param {Object} requestParam - An object with keys bucket, key(path of image where it is stored)
   */
  sendSNS(requestParam) {
    return new Promise((resolve, reject) => {
      if (aws.snsRegion && aws.snsRegion !== "") {
        AWS.config.update({
          region: aws.snsRegion
        });
        this.sns = new AWS.SNS({ apiVersion: "2010-03-31", region: aws.snsRegion });
      }

      const params = {
        Message: requestParam?.message,
        PhoneNumber: requestParam?.phoneNumber,
      };
      console.log({params});
      this.sns.publish(params, (err, data) => {
        console.log({err});
        if (err) {
          reject(err);
          return;
        }
        console.log({data});
        resolve(data);
        return;
      });
    });
  }

  writeFile(file_data, fileName, bucket, contentType) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: fileName,
        Body: file_data,
        ContentType: contentType,
        ACL: "public-read"
      };
      this._s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
        return;
      });
    });
  }
}

module.exports = S3Handler;
