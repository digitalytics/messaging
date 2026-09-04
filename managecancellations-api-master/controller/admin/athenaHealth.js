const axios = require('axios');
const qs = require('qs');
const moment = require('moment');
const { errorHandler } = require('../../utils/errorHandler');
const { RESPONSE_CODE } = require('../../constant/responseCode');
const { ATHENA } = require('../../config');
const baseURL = ATHENA?.baseURL;
// Function to authenticate and obtain access token
let tokenData = null;
async function getAccessToken() {
  const encodedText = Buffer.from(ATHENA?.client_id + ':' + ATHENA?.client_secret).toString('base64');
  let data = qs.stringify({
    'grant_type': 'client_credentials',
    'scope': 'athena/service/Athenanet.MDP.*'
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${baseURL}/oauth2/v1/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedText}`
    },
    data: data
  };
  try {
    const response = await axios.request(config);
    tokenData = { ...response?.data, generated_at: Math.floor(Date.now() / 1000) };
    return response?.data;
  } catch (error) {
    console.log(error);
    throw errorHandler(error?.response?.data?.error, RESPONSE_CODE.BadRequest)
  }
}

// Function to verify if the access token is expired
function isTokenExpired(tokenInfo) {
  try {
    const expiresInSec = parseInt(tokenInfo.expires_in);
    const currentTimeSec = Math.floor(Date.now() / 1000);
    return currentTimeSec >= tokenInfo.generated_at + expiresInSec;
  } catch (err) {
    console.log({ err });
    return true; // Token is expired or invalid
  }
}
const appointmentTypes = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    let params = {
      providerid: Number(body?.providerid),
      departmentid: Number(body?.departmentid),
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/appointmenttypedropdown/mapping`, {
      params,
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    return response?.data?.appointmenttype_dropdown || [];
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};
// Function to fetch patient details by patient ID
async function getPatientDetails(patientId) {
  try {
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/patients/${patientId}`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      },
    });
    return response.data[0];
  } catch (error) {
    // console.error('Error fetching patient details:', error);
    return {};
    // throw error;
  }
}
async function getDepartmentsDetails(departmentId) {
  try {
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/departments/${departmentId}`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      },
    });
    return response.data[0];
  } catch (error) {
    // console.error('Error fetching patient details:', error);
    return {};
    // throw error;
  }
}
async function getProviderDetails(providerId) {
  try {
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/providers/${providerId}`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      },
    });
    return response?.data?.[0];
  } catch (error) {
    // console.error('Error fetching patient details:', error);
    return {};
    // throw error;
  }
}
// Athena's provider record has no `displayname` field — only firstname/lastname.
function formatProviderName(providerData) {
  const name = [providerData?.firstname, providerData?.lastname].filter(Boolean).join(' ');
  return name ? `Dr. ${name}` : '';
}
async function departmentList() {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/departments`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      },
    });
    return response?.data;
  } catch (error) {
    // console.error('Error fetching patient details:', error);
    return {};
    // throw error;
  }
}
const waitList = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    let page = body.page ? Number(body.page) : 0;
    let limit = body.sizePerPage ? Number(body.sizePerPage) : 10;
    let offset = page * limit;
    let params = {
      limit: limit,
      offset: offset
    }
    if (body?.status && body?.status !== "") {
      params.priority = body?.status
    }
    if (body?.appointmenttypeid && body?.appointmenttypeid !== "") {
      params.appointmenttypeid = body?.appointmenttypeid
    }
    if (body?.departmentId && body?.departmentId !== "") {
      params.departmentid = body?.departmentId
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/waitlist`, {
      params,
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    const waitlistEntries = response?.data?.waitlistentries || [];
    const departmentData = await getDepartmentsDetails(body?.departmentId);
    const uniqueProviderIds = [...new Set(waitlistEntries.map(e => e?.providerid).filter(id => id !== undefined && id !== null))];
    const providerNameById = new Map();
    await Promise.all(
      uniqueProviderIds.map(async (providerId) => {
        const providerData = await getProviderDetails(providerId);
        providerNameById.set(providerId, formatProviderName(providerData));
      })
    );
    const sendData = [];
    await Promise.all(
      waitlistEntries.map(async(singleData)=>{
        const patientData = await getPatientDetails(singleData?.patientid);
        sendData.push({
          ...singleData,
          firstname:patientData?.firstname,
          lastname:patientData?.lastname,
          email:patientData?.email,
          homephone:patientData?.homephone,
          countrycode:patientData?.countrycode,
          departmentName:departmentData?.name,
          providerName: providerNameById.get(singleData?.providerid) || '',
        })
      })
    )
    return {
      data: sendData || [],
      total: response?.data?.totalcount || 0
    };
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};
async function openAppointmentSlots({ body }) {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    let params = {
      departmentid: body?.departmentId,
      startdate: body?.startdate || moment().format('MM/DD/YYYY'),
      enddate: body?.enddate || moment().add(30, 'days').format('MM/DD/YYYY'),
      ignoreschedulablepermission: true,
      showfrozenslots: true
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/open`, {
      params,
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    const appointments = response?.data?.appointments || [];
    const uniqueProviderIds = [...new Set(appointments.map(a => a?.providerid).filter(id => id !== undefined && id !== null))];
    const providerNameById = new Map();
    await Promise.all(
      uniqueProviderIds.map(async (providerId) => {
        const providerData = await getProviderDetails(providerId);
        providerNameById.set(providerId, formatProviderName(providerData));
      })
    );
    const sendData = appointments.map((singleData) => ({
      ...singleData,
      providerName: providerNameById.get(singleData?.providerid) || ''
    }));
    return {
      appointments: sendData,
      totalcount: response?.data?.totalcount || 0
    };
  } catch (error) {
    // console.error('Error fetching patient details:', error);
    return {};
    // throw error;
  }
}
const listBookedAppointments = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    let page = body.page ? Number(body.page) : 0;
    let limit = body.sizePerPage ? Number(body.sizePerPage) : 10;
    let offset = page * limit;
    let params = {
      startdate: body?.startdate,
      enddate: body?.enddate,
      showcancelled: true,
      limit: limit,
      offset: offset
    }
    if(body?.appointmentstatus){
      params.appointmentstatus = body?.appointmentstatus
    }
    if(body?.providerid && body?.providerid !== ""){
      params.providerid = Number(body?.providerid)
    }
    if(body?.departmentId && body?.departmentId !== ""){
      params.departmentid = Number(body?.departmentId)
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/booked`, {
      params,
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    const sendData = [];
    await Promise.all(
      response?.data?.appointments?.map(async(singleData)=>{
        const patientData = await getPatientDetails(singleData?.patientid);
        const providerData = await getProviderDetails(singleData?.providerid);
        sendData.push({
          ...singleData,
          firstname:patientData?.firstname,
          lastname:patientData?.lastname,
          email:patientData?.email,
          homephone:patientData?.homephone,
          countrycode:patientData?.countrycode,
          providerName: formatProviderName(providerData),
        })
      })
    )
    return {
      data: sendData || [],
      total: response?.data?.totalcount || 0
    };
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};
const appointmentDetails = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/${body?.appointmentid}`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};

const deleteWaitList = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    // Check if the access token is expired
    if (isTokenExpired(tokenData)) {
      await getAccessToken(); // Generate a new access token
    }
    const response = await axios.delete(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/waitlist/${body?.waitlistid}`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};
async function listCancelReasons() {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    if (isTokenExpired(tokenData)) {
      await getAccessToken();
    }
    const response = await axios.get(`${baseURL}/v1/${ATHENA?.practiceid}/appointmentcancelreasons`, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`
      }
    });
    return response?.data;
  } catch (error) {
    console.error(error?.response?.data);
    return {};
  }
}

// Creates a brand-new open appointment slot. Confirmed against the
// eleanorhealth/go-athenahealth open-source client's CreateAppointmentSlot
// implementation — useful for testing since this sandbox's naturally
// occurring open slots are all in the past.
const createAppointmentSlot = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    if (isTokenExpired(tokenData)) {
      await getAccessToken();
    }
    const form = qs.stringify({
      appointmentdate: body?.appointmentdate,
      appointmenttime: body?.appointmenttime,
      departmentid: body?.departmentid,
      providerid: body?.providerid,
      ...(body?.appointmenttypeid ? { appointmenttypeid: body.appointmenttypeid } : {}),
      ...(body?.reasonid ? { reasonid: body.reasonid } : {})
    });
    const response = await axios.post(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/open`, form, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response?.data;
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};

// Books a patient into an existing (open) appointment slot.
// PUT /v1/{practiceid}/appointments/{appointmentid} — confirmed against the
// eleanorhealth/go-athenahealth open-source client's BookAppointment implementation.
const bookAppointment = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    if (isTokenExpired(tokenData)) {
      await getAccessToken();
    }
    const form = qs.stringify({
      patientid: body?.patientid,
      ignoreschedulablepermission: true,
      ...(body?.appointmenttypeid ? { appointmenttypeid: body.appointmenttypeid } : {}),
      ...(body?.departmentid ? { departmentid: body.departmentid } : {}),
      ...(body?.reasonid ? { reasonid: body.reasonid } : {}),
      ...(body?.bookingnote ? { bookingnote: body.bookingnote } : {})
    });
    const response = await axios.put(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/${body?.appointmentid}`, form, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response?.data;
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};

// Cancels a booked appointment. Athena's open-source SDK doesn't wrap a
// standalone cancel call (only reschedule, which cancels+rebooks together),
// so this uses the PUT .../cancel pattern referenced in athenahealth's own
// GitHub issue tracker — verify the response live against the sandbox.
const cancelAppointment = async ({ body }) => {
  try {
    if (!tokenData?.access_token) {
      await getAccessToken();
    }
    if (isTokenExpired(tokenData)) {
      await getAccessToken();
    }
    const form = qs.stringify({
      cancellationreason: body?.cancellationreason || 'Cancelled via test portal',
      patientid: body?.patientid,
      ...(body?.departmentid ? { departmentid: body.departmentid } : {}),
      ...(body?.cancelreasonid ? { appointmentcancelreasonid: body.cancelreasonid } : {})
    });
    const response = await axios.put(`${baseURL}/v1/${ATHENA?.practiceid}/appointments/${body?.appointmentid}/cancel`, form, {
      headers: {
        Authorization: `Bearer ${tokenData?.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response?.data;
  } catch (error) {
    console.error(error?.response?.data);
    throw errorHandler(error?.response?.data?.error, error?.response?.status)
  }
};

module.exports = {
  getAccessToken,
  listBookedAppointments,
  appointmentTypes,
  waitList,
  appointmentDetails,
  deleteWaitList,
  departmentList,
  openAppointmentSlots,
  listCancelReasons,
  createAppointmentSlot,
  bookAppointment,
  cancelAppointment
};
