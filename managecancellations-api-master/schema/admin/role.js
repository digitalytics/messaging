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
      required: ["title", "status"],
      properties: {
        title: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] }
      }
    }
  }
};

const listSchema = {
  schema: {
    tags: ["Admin API"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    },
    query: {
      type: "object",
      properties: {
        ID: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] }
      }
    }
  }
};

const listSortSchema = {
  schema: {
    tags: ["Admin API"],
    headers: {
      type: "object",
      required: ["authorization"],
      properties: {
        authorization: {
          type: "string"
        }
      }
    },
    query: {
      type: "object",
      properties: {
        page: { type: "number" },
        sizePerPage: { type: "number" },
        sortBy: { type: "string" },
        search: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] }
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
      required: ["_id"],
      properties: {
        _id: { type: "string" },
        title: { type: "string" },
        status: { type: "string", enum: ["active", "inactive"] }
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
        type: { type: "string" }
      }
    }
  }
};

module.exports = {
  createSchema,
  listSchema,
  listSortSchema,
  updateSchema,
  actionSchema
};
