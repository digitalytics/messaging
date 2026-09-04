//@ts-check
const mongoose = require("mongoose");
const config = require("../config");





mongoose
  .connect(config?.MONGO_URL)
  .then(() => {
    // eslint-disable-next-line no-console
    console.info("MONGODB CONNECTED");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("error", error);
  });
