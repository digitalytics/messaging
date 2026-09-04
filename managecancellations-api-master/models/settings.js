//@ts-check
const { Schema, model } = require("mongoose");
const { DBCONSTANTS } = require("../constant/dbConstants");

const settingsSchema = new Schema(
  {
    radius: {
      type: Number
    },
    minBalance: {
      type: Number
    },
    bookingCharge: {
      type: Number
    },
    cancelationCharge: {
      type: Number
    },
    cancelationMin: {
      type: Number
    },
    defaultCurrency: {
      type: String
    },
    supportEmail: {
      type: String
    },
    supportMobile: {
      type: String
    },
    otpAutoFill: {
      type: Boolean
    },
    otpResendMin: {
      type: Number
    },
    timeSlotMin: {
      type: Number
    },
    facebookURL: {
      type: String
    },
    twitterURL: {
      type: String
    },
    instagramURL: {
      type: String
    },
    privacyURL: {
      type: String
    },
    termURL: {
      type: String
    },
    playStoreURL: {
      type: String
    },
    appStoreURL: {
      type: String
    },
    unpaidOrderReminderMin: {
      type: Number
    },
    missedBookingReminderMin: {
      type: Number
    },
    scheduleBookingReminderMin: {
      type: Number
    },
    cancellationReason: {
      type: [
        {
          title: {
            type: String
          }
        }
      ]
    },
    vat: {
      type: Number
    },
    onPeakPrice: {
      type: Number
    },
    onPeakStartMin: {
      type: Number
    },
    onPeakEndMin: {
      type: Number
    },
    offPeakPrice: {
      type: Number
    },
    holidays: {
      type: Array
    },
  },
  { timestamps: true, versionKey: false }
);

const Settings = model(DBCONSTANTS.SETTINGS, settingsSchema);
module.exports = Settings;
