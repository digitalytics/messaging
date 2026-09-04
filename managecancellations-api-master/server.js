//@ts-check
require("dotenv").config();
// eslint-disable-next-line no-console
const logger = console.log;
function ajvPlugin(ajv) {
  ajv.addKeyword("file", {
    compile: (schema, parent) => {
      parent.type = "file";
      delete parent.isFileType;
      return () => true;
    }
  });
  return ajv;
}
const cors = require("@fastify/cors");
const fastify = require("fastify")({
  logger: process.env.NODE_ENV != "production",
  ajv: {
    plugins: [ajvPlugin],
    customOptions: {
      coerceTypes: "array"
    }
  }
});
/* SWAGGER INTEGRATION START */
fastify.register(require("@fastify/swagger"), {
  hideUntagged: true,
  swagger: {
    info: {
      title: "Athena EHR",
      version: "1.0.0"
    }
  }
});
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/documentation"
});
/* SWAGGER INTEGRATION END */
fastify.register(require("@fastify/multipart"), {
  addToBody: true,
  throwFileSizeLimit: true,
  limits: {
    fileSize: 41943040,
  }
});
fastify.register(cors);
fastify.get("/", () => {
  return {
    PING: "PONG"
  };
});

/* Admin */
fastify.register(require("./router/admin/auth"), { prefix: "admin/auth" });
fastify.register(require("./router/admin/admin"), { prefix: "admin/admin" });
fastify.register(require("./router/admin/role"), { prefix: "admin/role" });
fastify.register(require("./router/admin/accessRight"), { prefix: "admin/accessRight" });
fastify.register(require("./router/admin/settings"), { prefix: "admin/settings" });
fastify.register(require("./router/admin/module"), { prefix: "admin/module" });
fastify.register(require("./router/admin/athenaHealth"), { prefix: "admin/athena-health" });
fastify.register(require("./router/admin/notification"), { prefix: "admin/notification" });

const connectServer = async () => {
  try {
    fastify.listen(
      {
        host: process.env.HOST?.toString(),
        port: parseInt(process.env.PORT || "8033")
      },
      (err) => {
        if (err) throw err;
      }
    );
    require("./db/mongo");
    logger(`Fastify server is listing on port ${process.env.PORT}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
connectServer();
