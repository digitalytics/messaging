const { STATUS_CONSTANTS } = require("../../constant/status");

const createSchema = {
  schema: {
    tags: ["Admin API"],
    consumes: ["multipart/form-data"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    },
    body: {
      type: "object",
      required: ["title", "code"],
      properties: {
        title: { type: "string" },
        code: { type: "string" },
      }
    }
  }
};

const listSchema = {
  schema: {
    tags: ["Admin API"],
    query: {
      type: "object",
      properties: {
        ID: { type: "string" },
      }
    }
  }
};

const updateSchema = {
  schema: {
    tags: ["Admin API"],
    consumes: ["multipart/form-data"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    },
    body: {
      type: "object",
      required: ["_id", "title", "code"],
      properties: {
        _id: { type: "string" },
        title: { type: "string" },
        code: { type: "string" },
      }
    }
  }
};

const actionSchema = {
  schema: {
    tags: ["Admin API"],
    consumes: ["multipart/form-data"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    },
    body: {
      type: "object",
      required: ["ids", "type"],
      properties: {
        ids: {
          type: "array",
          items: { type: "string" }
        },
        type: { type: "string", enum: [STATUS_CONSTANTS.DELETE] }
      }
    }
  }
};

const listSortSchema = {
  schema: {
    tags: ["Admin API"],
    query: {
      type: "object",
      properties: {
        page: { type: "number" },
        sizePerPage: { type: "number" },
        sortBy: { type: "string" },
        search: { type: "string" },
      }
    }
  }
};

module.exports = {
  createSchema,
  listSchema,
  updateSchema,
  actionSchema,
  listSortSchema
};
