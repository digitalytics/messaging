//@ts-check
const { RESPONSE_CODE } = require("../../constant/responseCode");
const { formatResponse, failure } = require("../../utils/responseHandler");
const { listBookedAppointments, waitList, appointmentDetails, deleteWaitList, appointmentTypes, departmentList, openAppointmentSlots, listCancelReasons, createAppointmentSlot, bookAppointment, cancelAppointment } = require("../../controller/admin/athenaHealth");

module.exports = function (fastify, opts, done) {
  fastify.get("/wait-list", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await waitList({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/appointment-types", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await appointmentTypes({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/list-booked-appointments", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await listBookedAppointments({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/department-list", async (request, replay) => {
    try {
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await departmentList()));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/open-appointment-slots", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await openAppointmentSlots({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/appointment-detail", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await appointmentDetails({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.delete("/delete-wait-list", async (request, replay) => {
    try {
      const requestQuery = { ...request?.query };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await deleteWaitList({ body: requestQuery })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.post("/create-slot", async (request, replay) => {
    try {
      const requestBody = { ...request?.body };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await createAppointmentSlot({ body: requestBody })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.get("/cancel-reasons", async (request, replay) => {
    try {
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await listCancelReasons()));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.put("/book-appointment", async (request, replay) => {
    try {
      const requestBody = { ...request?.body };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await bookAppointment({ body: requestBody })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  fastify.put("/cancel-appointment", async (request, replay) => {
    try {
      const requestBody = { ...request?.body };
      replay.status(RESPONSE_CODE.OK).send(formatResponse(null, await cancelAppointment({ body: requestBody })));
    } catch (error) {
      replay.status(error?.code || 500).send(failure(error));
    }
  });
  done();
};
