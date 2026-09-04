const settingInfoSchema = {
  schema: {
    tags: ["Admin API", "Mobile API"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    }
  }
};
module.exports = {
  settingInfoSchema
};
