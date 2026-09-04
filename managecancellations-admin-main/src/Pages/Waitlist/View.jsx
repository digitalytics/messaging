import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Table from "../../Components/Table";
import { useNavigate } from "react-router-dom";
import configuration from '../../config';
import { toast } from 'react-toastify';
import Loader from "../../Components/Loader";
import Label from "../../Components/Label";
import Dropdown from "../../Components/Dropdown";
import DatePicker from "../../Components/DatePicker";
import DeleteModel from "../../Components/DeleteModel";
import NotifyMatchModal from "../../Components/NotifyMatchModal";
import moment from "moment";

const PRIORITY_ORDER = { HIGH: 0, NORMAL: 1, LOW: 2 };

function View() {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [accessData, setAccessData] = useState({});
  const [showTableLoader, setShowTableLoader] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openSlot, setOpenSlots] = useState([]);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [showSlotsLoader, setShowSlotsLoader] = useState(false);
  const [providerFilter, setProviderFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null });
  const [notifyModalSlot, setNotifyModalSlot] = useState(null);
  const [notifiedIds, setNotifiedIds] = useState(new Set());
  const SLOTS_PREVIEW_COUNT = 12;
  const breadCrumbLinks = [
    { name: "Waitlist", href: "#", current: true },
  ];
  const [filters, setFilters] = useState([
    { name: "View All", type: "all", isActive: true },
    { name: "Low", type: "LOW", isActive: false },
    { name: "Normal", type: "NORMAL", isActive: false },
    { name: "High", type: "HIGH", isActive: false }
  ])
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const columns = [
    { title: "Wait List ID", field: "waitlistid", isPrimary: true, render: (rowData) => (`#${rowData?.waitlistid}`) },
    { title: "Appointment ID", field: "appointmentid" },
    { title: "Patient", field: "firstname", render: (rowData) => (`${rowData?.firstname} ${rowData?.lastname}`) },
    { title: "Department", field: "departmentName" },
    { title: "Provider", field: "providerName" },
    { title: "Priority", field: "priority" },
    { title: "Hour From", field: "hourfrom", render: (rowData) => (rowData?.hourfrom ? (Number(rowData?.hourfrom) % 12 || 12) + ":00 " + (Number(rowData?.hourfrom) >= 12 ? "PM" : "AM") : "") },
    { title: "Hour To", field: "hourto", render: (rowData) => (rowData?.hourto ? (Number(rowData?.hourto) % 12 || 12) + ":00 " + (Number(rowData?.hourto) >= 12 ? "PM" : "AM") : "") },
    { title: "Day", field: "dayofweekids", render: (rowData) => (rowData?.dayofweekids?.map(day => dayNames[parseInt(day) - 1]).join(", ")) },
    { title: "Created Date", field: "created" },
    {
      title: "Action",
      field: "action",
      isSort: "no",
      render: (rowData) => (
        <span className="flex gap-2">
          {accessData?.is_delete ? (
            <button
              onClick={() => { setDeleteId(rowData?.waitlistid); setShowDeleteModal(true); }}
              className="inline-flex items-center px-3 py-0.5 rounded-md text-sm cursor-pointer bg-[#D80027] text-white capitalize"
            >
              Delete
            </button>
          ) : null}
        </span>
      ),
    },
  ];
  const [waitlistData, setWaitlistData] = useState([])
  const [filterData, setFilterData] = useState({
    page: 0, sizePerPage: 10, departmentId: '', status: 'all', search: ''
  });

  useEffect(() => {
    const accessRight = configuration.accessRight("waitingList")
    setAccessData(accessRight);
    if (accessRight?.is_view) {
      setIsValid(true);
      setDepartmentsLoading(true);
      configuration.getAPIaxios({ url: 'admin/athena-health/department-list', params: {} }).then((data) => {
        setDepartmentsLoading(false);
        if (data?.departments?.length) {
          let opt = [];
          data.departments.map((single) => {
            opt.push({ name: single.name, value: single.departmentid });
          });
          setDepartments(opt);
        } else {
          setDepartments([]);
        }
      }).catch(error => {
        setDepartmentsLoading(false);
        return toast.error(error.message)
      });
      // getDatas(filterData);
    } else {
      navigate("/dashboard");
    }
  }, []);

  function getDatas(departmentId) {
    setShowTableLoader(true);
    configuration.getAPIaxios({ url: 'admin/athena-health/wait-list', params: { departmentId, sizePerPage: 500 } }).then((data) => {
      setShowTableLoader(false);
      setWaitlistData(data?.data || []);
    }).catch(error => {
      setShowTableLoader(false);
      return toast.error(error.message)
    });
  }
  function handleDelete() {
    configuration.deleteAPIaxios({ url: 'admin/athena-health/delete-wait-list', params: { waitlistid: deleteId } }).then(() => {
      setShowDeleteModal(false);
      getDatas(filterData.departmentId);
      return toast.success('Removed from waitlist successfully');
    }).catch(error => {
      setShowDeleteModal(false);
      return toast.error(error.message);
    });
  }
  function handleCancel() {
    setShowDeleteModal(false);
  }
  function getSlotDayId(slot) {
    const parsed = slot?.date ? moment(slot.date, 'MM/DD/YYYY') : null;
    return parsed && parsed.isValid() ? String(parsed.day() + 1) : null;
  }
  function getSlotStartHour(slot) {
    const hour = slot?.starttime ? parseInt(slot.starttime.split(':')[0], 10) : NaN;
    return Number.isNaN(hour) ? null : hour;
  }
  function entryMatchesSlot(entry, slot) {
    const slotDayId = getSlotDayId(slot);
    const dayOk = !entry?.dayofweekids?.length || (slotDayId && entry.dayofweekids.includes(slotDayId));
    const hasHourPref = entry?.hourfrom || entry?.hourto;
    const slotHour = getSlotStartHour(slot);
    const hourOk = !hasHourPref || (slotHour !== null && slotHour >= Number(entry?.hourfrom || 0) && slotHour < Number(entry?.hourto || 24));
    return Boolean(dayOk && hourOk);
  }
  function matchesForSlot(slot) {
    return waitlistData
      .filter((entry) => entry?.email && entryMatchesSlot(entry, slot))
      .sort((a, b) => {
        const priorityDiff = (PRIORITY_ORDER[a?.priority] ?? 3) - (PRIORITY_ORDER[b?.priority] ?? 3);
        if (priorityDiff !== 0) return priorityDiff;
        return (moment(a?.created).valueOf() || 0) - (moment(b?.created).valueOf() || 0);
      });
  }
  function buildSlotEmail(entry, slot) {
    const endtime = (slot?.starttime && slot?.duration)
      ? moment(slot.starttime, 'HH:mm').add(Number(slot.duration), 'minutes').format('HH:mm')
      : '';
    const appointmentType = slot?.appointmenttype || slot?.patientappointmenttypename || 'appointment';
    const timeRange = `${slot?.starttime || ''}${endtime ? ' - ' + endtime : ''}`;
    const provider = slot?.providerName || 'one of our providers';
    const department = entry?.departmentName || '';
    const subject = `A ${appointmentType} slot opened up for you on ${slot?.date}`;
    const message = `Hi ${entry?.firstname || 'there'}, a ${appointmentType} slot has opened on ${slot?.date} at ${timeRange} with ${provider}${department ? ` in ${department}` : ''}, matching your preferred schedule. Please contact us as soon as possible to book this slot before it's taken.`;
    return { subject, message };
  }
  function handleNotifySlotMatch(entry, slot) {
    const matchKey = `${slot?.appointmentid}-${entry?.waitlistid}`;
    const { subject, message } = buildSlotEmail(entry, slot);
    configuration.allAPI({
      url: 'admin/notification/send',
      method: 'POST',
      params: {
        patientID: entry?.patientid,
        patientName: `${entry?.firstname} ${entry?.lastname}`,
        email: entry?.email,
        homephone: entry?.homephone,
        countrycode: entry?.countrycode,
        subject,
        message,
        appointmentid: slot?.appointmentid,
        waitlistid: entry?.waitlistid,
        departmentName: entry?.departmentName,
        priority: entry?.priority,
        slotDate: slot?.date,
        slotTime: slot?.starttime,
        providerName: slot?.providerName,
        appointmentType: slot?.appointmenttype || slot?.patientappointmenttypename
      }
    }).then((data) => {
      if (data?.payload) {
        setNotifiedIds(prev => new Set(prev).add(matchKey));
        return toast.success('Notification sent successfully');
      } else if (data?.error) {
        return toast.error(data.error.message);
      } else {
        return toast.error('Something went wrong');
      }
    }).catch(error => {
      return toast.error(error.message);
    });
  }
  function filterOnClick(type) {
    setFilters(filters.map(item => item.type === type ? { ...item, isActive: true } : { ...item, isActive: false }))
    setFilterData({ ...filterData, status: type, page: 0 })
  }
  function searchOnChange(e) {
    setFilterData({ ...filterData, search: e, page: 0 })
  }
  function onPageNavigation(type) {
    setFilterData((type === 'next') ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 });
  }
  function onSortKey(e) {
    // Not implemented: the backend never supported sorting for this endpoint either.
    setFilterData({ ...filterData, sortBy: e === filterData.sortBy ? '' : e });
  }
  function onSizePerPage(e) {
    setFilterData({ ...filterData, sizePerPage: e.target.value, page: 0 })
  }

  function handleSubmit(departmentId) {
    getDatas(departmentId);
    setFilterData({ page: 0, sizePerPage: 10, departmentId, status: 'all', search: '' })
    setFilters(filters.map(item => ({ ...item, isActive: item.type === 'all' })))
    setShowAllSlots(false);
    setProviderFilter('');
    setTypeFilter('');
    setDateFilter({ startDate: null, endDate: null });
    setNotifyModalSlot(null);
    setNotifiedIds(new Set());
    setShowSlotsLoader(true);
    configuration.getAPIaxios({ url: 'admin/athena-health/open-appointment-slots', params: { departmentId } }).then((data) => {
      setShowSlotsLoader(false);
      setOpenSlots(data?.appointments || [])
    }).catch(error => {
      setShowSlotsLoader(false);
      return toast.error(error.message)
    });
  }


  const providerOptions = [];
  const seenProviderIds = new Set();
  openSlot.forEach((single) => {
    const key = single?.providerid ?? 'unassigned';
    if (!seenProviderIds.has(key)) {
      seenProviderIds.add(key);
      providerOptions.push({ name: single?.providerName || 'Unassigned', value: String(key) });
    }
  });
  const typeOptions = [];
  const seenTypeIds = new Set();
  openSlot.forEach((single) => {
    const key = single?.appointmenttypeid ?? single?.appointmenttype ?? single?.patientappointmenttypename ?? 'unknown';
    if (!seenTypeIds.has(key)) {
      seenTypeIds.add(key);
      typeOptions.push({ name: single?.appointmenttype || single?.patientappointmenttypename || 'Unknown type', value: String(key) });
    }
  });
  const filteredSlots = openSlot.filter((single) => {
    const providerKey = String(single?.providerid ?? 'unassigned');
    const typeKey = String(single?.appointmenttypeid ?? single?.appointmenttype ?? single?.patientappointmenttypename ?? 'unknown');
    const matchesDate = !dateFilter?.startDate || !dateFilter?.endDate || (
      single?.date && moment(single.date, 'MM/DD/YYYY').isValid() &&
      moment(single.date, 'MM/DD/YYYY').isBetween(moment(dateFilter.startDate), moment(dateFilter.endDate), 'day', '[]')
    );
    return (!providerFilter || providerKey === providerFilter) && (!typeFilter || typeKey === typeFilter) && matchesDate;
  });

  const filteredWaitlist = waitlistData.filter((row) => {
    const matchesPriority = !filterData?.status || filterData.status === 'all' || row?.priority === filterData.status;
    const searchTerm = (filterData?.search || '').trim().toLowerCase();
    const matchesSearch = !searchTerm || `${row?.firstname || ''} ${row?.lastname || ''}`.toLowerCase().includes(searchTerm);
    return matchesPriority && matchesSearch;
  });
  const page = filterData?.page || 0;
  const sizePerPage = Number(filterData?.sizePerPage) || 10;
  const pagedWaitlist = filteredWaitlist.slice(page * sizePerPage, (page + 1) * sizePerPage);

  return (
    isValid ? <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Waitlist" />
      <main className="flex-1">
        <div className="py-8">
          <DeleteModel
            mode={showDeleteModal}
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
          <NotifyMatchModal
            slot={notifyModalSlot}
            matches={notifyModalSlot ? matchesForSlot(notifyModalSlot) : []}
            notifiedIds={notifiedIds}
            onClose={() => setNotifyModalSlot(null)}
            onNotify={handleNotifySlotMatch}
          />
          <div className="px-5 sm:px-5 lg:px-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-5">
              <div>
                <Label
                  text="Select Department"
                  className="block text-[15px] text-gray-900 font-medium"
                />
                <div className="mt-2">
                  <Dropdown
                    id="id"
                    name="name"
                    className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                    value={filterData?.departmentId}
                    onChange={(e) => handleSubmit(e.target.value)}
                    options={departments}
                    loading={departmentsLoading}
                  />
                </div>
              </div>
            </div>
            {filterData?.departmentId ? (
              <div className="mb-3">
                <h3 className="text-[17px] font-semibold text-gray-900">Open Appointment Slots</h3>
                <p className="text-sm text-gray-500">These time slots are currently unbooked and available to offer a waiting patient.</p>
              </div>
            ) : null}
            {filterData?.departmentId ? (
              showSlotsLoader ? (
                <Loader />
              ) : openSlot?.length ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-3">
                    <div>
                      <Label
                        text="Filter by Provider"
                        className="block text-[13px] text-gray-700 font-medium"
                      />
                      <div className="mt-1">
                        <Dropdown
                          id="providerFilter"
                          name="name"
                          lable="All Providers"
                          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 px-3 py-2"
                          value={providerFilter}
                          onChange={(e) => { setProviderFilter(e.target.value); setShowAllSlots(false); }}
                          options={providerOptions}
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        text="Filter by Appointment Type"
                        className="block text-[13px] text-gray-700 font-medium"
                      />
                      <div className="mt-1">
                        <Dropdown
                          id="typeFilter"
                          name="name"
                          lable="All Types"
                          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 px-3 py-2"
                          value={typeFilter}
                          onChange={(e) => { setTypeFilter(e.target.value); setShowAllSlots(false); }}
                          options={typeOptions}
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        text="Filter by Date"
                        className="block text-[13px] text-gray-700 font-medium"
                      />
                      <div className="mt-1">
                        <DatePicker
                          asSingle={false}
                          useRange={true}
                          startDate={dateFilter.startDate}
                          endDate={dateFilter.endDate}
                          onChange={(e) => { setDateFilter({ startDate: e?.startDate || null, endDate: e?.endDate || null }); setShowAllSlots(false); }}
                        />
                      </div>
                    </div>
                  </div>
                  {filteredSlots.length ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 pb-3">
                        {(showAllSlots ? filteredSlots : filteredSlots.slice(0, SLOTS_PREVIEW_COUNT)).map((single) => {
                          const endtime = (single?.starttime && single?.duration)
                            ? moment(single.starttime, "HH:mm").add(Number(single.duration), 'minutes').format("HH:mm")
                            : '';
                          const matches = matchesForSlot(single);
                          return <div key={`${single?.appointmentid}-${single?.date}-${single?.starttime}`} className="relative bg-white shadow border border-l-4 border-l-emerald-500 border-slate-200 rounded-lg px-4 py-4">
                            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Available
                            </span>
                            <Label
                              text={single?.appointmenttype || single?.patientappointmenttypename || 'Appointment'}
                              className="block text-[15px] text-gray-900 font-semibold pr-16"
                            />
                            <Label
                              text={single?.date}
                              className="block text-[13px] text-gray-700"
                            />
                            <Label
                              text={`${single?.starttime || ''} ${endtime ? '- ' + endtime : ''}${single?.duration ? ` (${single.duration} min)` : ''}`}
                              className="block text-[13px] text-gray-700"
                            />
                            <Label
                              text={single?.providerName || 'Provider not assigned'}
                              className="block text-[13px] text-gray-500"
                            />
                            {matches.length ? (
                              <button
                                onClick={() => setNotifyModalSlot(single)}
                                className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md"
                              >
                                🔔 {matches.length} waiting — Notify
                              </button>
                            ) : null}
                          </div>
                        })}
                      </div>
                      {filteredSlots.length > SLOTS_PREVIEW_COUNT ? (
                        <button
                          onClick={() => setShowAllSlots(!showAllSlots)}
                          className="text-sm text-[#2B78C0] hover:underline pb-5"
                        >
                          {showAllSlots ? 'Show fewer' : `Show all ${filteredSlots.length} slots`}
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <div className="pb-5 text-sm text-gray-500">No open slots match this filter.</div>
                  )}
                </>
              ) : (
                <div className="pb-5 text-sm text-gray-500">No open slots for this department right now.</div>
              )
            ) : null}
            <div className="mb-3">
              <h3 className="text-[17px] font-semibold text-gray-900">Waitlist</h3>
              <p className="text-sm text-gray-500">Patients waiting to be offered an appointment for this department.</p>
            </div>
            <div className="datatable">
              <Table
                tableTitle="admin"
                ids={[]}
                filters={filters}
                filterOnClick={filterOnClick}
                searchOnChange={searchOnChange}
                columns={columns}
                data={pagedWaitlist}
                onPageNavigation={onPageNavigation}
                totalData={filteredWaitlist.length}
                filterData={filterData}
                onSortKey={onSortKey}
                onSizePerPage={onSizePerPage}
                showTableLoader={showTableLoader}
              />
            </div>
          </div>
        </div>
      </main>
    </> : <Loader />
  );
}

export default View;
