import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import { ClipboardDocumentListIcon, TableCellsIcon, UserGroupIcon, ClockIcon, BellAlertIcon, CalendarDaysIcon } from "@heroicons/react/20/solid";
import Table from "../../Components/Table";
import moment from "moment";
import Dropdown from "../../Components/Dropdown";
import DatePicker from "../../Components/DatePicker";
import configuration from '../../config';
import { toast } from 'react-toastify';


function Dashboard() {
  const breadCrumbLinks = [{ name: "Dashboard", href: "#", current: true }];
  const [totalData, setTotalData] = useState(0);
  const [showTableLoader, setShowTableLoader] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [data2, setData2] = useState([]);
  const [staffStats, setStaffStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [apptStats, setApptStats] = useState({ total: 0, today: 0, yesterday: 0, nextWeek: 0 });
  const [cancelledTotal, setCancelledTotal] = useState(0);
  const [apptStatsLoading, setApptStatsLoading] = useState(false);
  const [waitlistTotal, setWaitlistTotal] = useState(0);
  const [notificationStats, setNotificationStats] = useState({ delivered: 0, failed: 0 });
  const [openSlotsTotal, setOpenSlotsTotal] = useState(null);
  const [openSlotsLoading, setOpenSlotsLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: moment().startOf('week').format('YYYY-MM-DD'),
    endDate: moment().endOf('week').format('YYYY-MM-DD')
  });
  const [filterData, setFilterData] = useState({
    page: 0,
    sizePerPage: 10,
    appointmentstatus: 'x',
    startdate: moment().startOf('week').format('MM/DD/YYYY'),
    enddate: moment().endOf('week').format('MM/DD/YYYY')
  });
  const columns2 = [
    {
      title: "Appointment ID",
      field: "appointmentid"
    },
    { title: "Patient Name", field: "firstname", render: (rowData) => (<>{rowData?.firstname} {rowData?.lastname}</>) },
    { title: "Doctor Name", field: "providerName" },
    { title: "Cancelled by", field: "cancelledby" },
    { title: "Cancelled Reason", field: "cancelreasonname" },
    { title: "Cancelled At", field: "cancelleddatetime" },
  ];
  function searchOnChange(e) {
    setFilterData({ ...filterData, search: e })
    getDatas({ ...filterData, search: e });
  }
  function onPageNavigation(type) {
    setFilterData((type === 'next') ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 });
    getDatas((type === 'next') ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 });
  }

  function onSizePerPage(e) {
    setFilterData({ ...filterData, sizePerPage: e.target.value, page: 0 })
    getDatas({ ...filterData, sizePerPage: e.target.value, page: 0 });
  }
  function onSortKey(e) {
    if (e === filterData.sortBy) {
      setFilterData({ ...filterData, sortBy: '' })
      getDatas({ ...filterData, sortBy: '' });
    } else {
      setFilterData({ ...filterData, sortBy: e })
      getDatas({ ...filterData, sortBy: e });
    }
  }
  function onSizePerPage(e) {
    setFilterData({ ...filterData, sizePerPage: e.target.value, page: 0 })
    getDatas({ ...filterData, sizePerPage: e.target.value, page: 0 });
  }
  function getDatas(filterKeys) {
    if (filterKeys?.status && filterKeys?.status === 'all') {
      delete filterKeys.status;
    }
    setShowTableLoader(true);
    configuration.getAPIaxios({ url: 'admin/athena-health/list-booked-appointments', params: filterKeys }).then((data) => {
      setShowTableLoader(false);
      if (data?.total) {
        setData2(data.data);
        setTotalData(data.total);
      } else {
        setData2([]);
        setTotalData(0);
      }
    }).catch(error => {
      return toast.error(error.message)
    });
  }
  function handleSubmit(departmentId) {
    getDatas({ ...filterData, departmentId });
    setFilterData({ ...filterData, departmentId })
    getOpenSlotsForDepartment(departmentId);
    getAppointmentStats(departmentId);
  }
  function getOpenSlotsForDepartment(departmentId) {
    if (!departmentId) {
      setOpenSlotsTotal(null);
      return;
    }
    setOpenSlotsLoading(true);
    configuration.getAPIaxios({ url: 'admin/athena-health/open-appointment-slots', params: { departmentId } }).then((data) => {
      setOpenSlotsLoading(false);
      setOpenSlotsTotal(data?.totalcount || 0);
    }).catch(() => {
      setOpenSlotsLoading(false);
      setOpenSlotsTotal(0);
    });
  }
  function onDateFilterChange(range) {
    const startDate = range?.startDate || dateFilter.startDate;
    const endDate = range?.endDate || dateFilter.endDate;
    setDateFilter({ startDate, endDate });
    const startdate = moment(startDate).format('MM/DD/YYYY');
    const enddate = moment(endDate).format('MM/DD/YYYY');
    const nextFilterData = { ...filterData, startdate, enddate };
    setFilterData(nextFilterData);
    if (nextFilterData.departmentId) {
      getDatas(nextFilterData);
    }
  }
  function getWaitlistTotal() {
    configuration.getAPIaxios({ url: 'admin/athena-health/wait-list', params: { sizePerPage: 1 } }).then((data) => {
      setWaitlistTotal(data?.total || 0);
    }).catch(() => setWaitlistTotal(0));
  }
  function getNotificationStats() {
    Promise.all([
      configuration.getAPIaxios({ url: 'admin/notification/list-sort', params: { sizePerPage: 1, status: 'delivered' } }).catch(() => ({})),
      configuration.getAPIaxios({ url: 'admin/notification/list-sort', params: { sizePerPage: 1, status: 'failed' } }).catch(() => ({}))
    ]).then(([delivered, failed]) => {
      setNotificationStats({ delivered: delivered?.total || 0, failed: failed?.total || 0 });
    });
  }
  function getStaffStats() {
    const statusParams = [{}, { status: 'active' }, { status: 'inactive' }];
    Promise.all(statusParams.map((extraParams) =>
      configuration.getAPIaxios({ url: 'admin/admin/list-sort', params: { sizePerPage: 1, ...extraParams } }).catch(() => ({}))
    )).then(([all, active, inactive]) => {
      setStaffStats({
        total: all?.total || 0,
        active: active?.total || 0,
        inactive: inactive?.total || 0
      });
    });
  }
  function getAppointmentCount(startdate, enddate, appointmentstatus, departmentId) {
    return configuration.getAPIaxios({
      url: 'admin/athena-health/list-booked-appointments',
      params: { sizePerPage: 1, startdate, enddate, departmentId, ...(appointmentstatus ? { appointmentstatus } : {}) }
    }).then((data) => data?.total || 0).catch(() => 0);
  }
  function getAppointmentStats(departmentId) {
    if (!departmentId) {
      setApptStats({ total: 0, today: 0, yesterday: 0, nextWeek: 0 });
      setCancelledTotal(0);
      return;
    }
    setApptStatsLoading(true);
    const today = moment().format('MM/DD/YYYY');
    const yesterday = moment().subtract(1, 'day').format('MM/DD/YYYY');
    const weekStart = moment().startOf('week').format('MM/DD/YYYY');
    const weekEnd = moment().endOf('week').format('MM/DD/YYYY');
    const nextWeekStart = moment().add(1, 'week').startOf('week').format('MM/DD/YYYY');
    const nextWeekEnd = moment().add(1, 'week').endOf('week').format('MM/DD/YYYY');
    Promise.all([
      getAppointmentCount(weekStart, weekEnd, undefined, departmentId),
      getAppointmentCount(today, today, undefined, departmentId),
      getAppointmentCount(yesterday, yesterday, undefined, departmentId),
      getAppointmentCount(nextWeekStart, nextWeekEnd, undefined, departmentId),
      getAppointmentCount(weekStart, weekEnd, 'x', departmentId)
    ]).then(([total, today, yesterday, nextWeek, cancelled]) => {
      setApptStatsLoading(false);
      setApptStats({ total, today, yesterday, nextWeek });
      setCancelledTotal(cancelled);
    });
  }
  useEffect(() => {
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
    getStaffStats();
    getWaitlistTotal();
    getNotificationStats();
  }, []);
  return (
    <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Dashboard" />
      <main className="flex-1">
        <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-3 mt-10 overflow-hidden rounded-2xl">
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Total Staff Members</dt>
            <dd className="">
              <UserGroupIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {staffStats.total}
            </dd>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 pt-1.5 pb-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active : {staffStats.active}</span>
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 pt-1.5 pb-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Inactive : {staffStats.inactive}</span>
          </div>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Total appointment</dt>
            <dd className="">
              <TableCellsIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            {!filterData?.departmentId ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10">
                Select a department below
              </dd>
            ) : apptStatsLoading ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10 animate-pulse">
                Loading...
              </dd>
            ) : (
              <>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                  {apptStats.total}
                </dd>
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 pt-1.5 pb-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Today : {apptStats.today}</span>
                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 pt-1.5 pb-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Yesterday : {apptStats.yesterday}</span>
                <span className="inline-flex items-center rounded-md bg-pink-50 px-2 pt-1.5 pb-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">Next Week : {apptStats.nextWeek}</span>
              </>
            )}
          </div>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Cancelled appointment</dt>
            <dd
              className="">
              <ClipboardDocumentListIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            {!filterData?.departmentId ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10">
                Select a department below
              </dd>
            ) : apptStatsLoading ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10 animate-pulse">
                Loading...
              </dd>
            ) : (
              <>
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                  {cancelledTotal}
                </dd>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 pt-1.5 pb-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">Scheduled this week</span>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 pt-1.5 pb-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                  {departments.find((d) => String(d.value) === String(filterData?.departmentId))?.name}
                </span>
              </>
            )}
          </div>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Total Waiting</dt>
            <dd className="">
              <ClockIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {waitlistTotal}
            </dd>
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 pt-1.5 pb-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">Practice-wide</span>
          </div>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Notifications Sent</dt>
            <dd className="">
              <BellAlertIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {notificationStats.delivered + notificationStats.failed}
            </dd>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 pt-1.5 pb-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Delivered : {notificationStats.delivered}</span>
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 pt-1.5 pb-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">Failed : {notificationStats.failed}</span>
          </div>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
            <dt className="text-sm font-medium leading-6 text-gray-500">Open Slots</dt>
            <dd className="">
              <CalendarDaysIcon className="w-8 text-[#2B78C0]" aria-hidden="true" />
            </dd>
            {openSlotsTotal === null ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10">
                Select a department below
              </dd>
            ) : openSlotsLoading ? (
              <dd className="w-full flex-none text-sm text-gray-500 leading-10 animate-pulse">
                Loading...
              </dd>
            ) : (
              <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                {openSlotsTotal}
              </dd>
            )}
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 pt-1.5 pb-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
              {departments.find((d) => String(d.value) === String(filterData?.departmentId))?.name || "No department selected"}
            </span>
          </div>
        </dl>
        <div className='rounded-2xl bg-white px-6 py-5 input-field mt-10 mb-10'>
          <div className="flex items-center pb-5 gap-5">
            <h1 className="font-bold text-1xl pt-2">Cancelled Appointment</h1>
            <div>
              <div className="mt-2">
                <Dropdown
                  id="id"
                  name="name"
                  lable="---Select Department---"
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                  value={filterData?.departmentId}
                  onChange={(e) => handleSubmit(e.target.value)}
                  options={departments}
                  loading={departmentsLoading}
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <DatePicker
                  asSingle={false}
                  useRange={true}
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  onChange={onDateFilterChange}
                />
              </div>
            </div>
          </div>
          <div className='-mt-12'>
            <Table
              filters={[]}
              columns={columns2}
              data={data2}
              searchOnChange={searchOnChange}
              onPageNavigation={onPageNavigation}
              totalData={totalData}
              filterData={filterData}
              SearchItems={false}
              onSortKey={onSortKey}
              onSizePerPage={onSizePerPage}
              showTableLoader={showTableLoader}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
