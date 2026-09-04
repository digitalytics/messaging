import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Table from "../../Components/Table";
import NotificationDetailModal from "../../Components/NotificationDetailModal";
import { useNavigate } from "react-router-dom";
import configuration from '../../config';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from "../../Components/Loader";

const PRIORITY_STYLES = {
  HIGH: "bg-red-100 text-red-700",
  NORMAL: "bg-blue-100 text-blue-700",
  LOW: "bg-gray-200 text-gray-700"
};

function Notifications() {
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState({ is_view: true });
  const [isValid, setIsValid] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const breadCrumbLinks = [
    { name: "Notifications", href: "#", current: true },
  ];
  const [filters, setFilters] = useState([
    { name: "All", type: "all", isActive: true },
    { name: "Delivered", type: "delivered", isActive: false },
    { name: "Failed", type: "failed", isActive: false }
  ])
  const columns = [
    { title: "Patient", field: "patientName", isPrimary: true },
    { title: "Email", field: "email" },
    { title: "Department", field: "departmentName", render: (rowData) => (rowData?.departmentName || "—") },
    {
      title: "Priority",
      field: "priority",
      render: (rowData) => (rowData?.priority ? (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[rowData.priority] || "bg-gray-200 text-gray-700"}`}>
          {rowData.priority.toLowerCase()}
        </span>
      ) : "—")
    },
    {
      title: "Appointment",
      field: "slotDate",
      render: (rowData) => {
        if (rowData?.slotDate) {
          return <span>{rowData.slotDate} {rowData?.slotTime || ""}</span>;
        }
        return rowData?.appointmentid ? `#${rowData.appointmentid}` : "—";
      }
    },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <span
          className={
            rowData.status === "delivered"
              ? "inline-flex items-center px-3 py-0.5 rounded-md text-sm bg-emerald-200 text-emerald-800 capitalize"
              : rowData.status === "pending"
                ? "inline-flex items-center px-3 py-0.5 rounded-md text-sm bg-yellow-200 text-yellow-800 capitalize"
                : "inline-flex items-center px-3 py-0.5 rounded-md text-sm bg-red-200 text-red-800 capitalize"
          }
        >
          {rowData.status}
        </span>
      ),
    },
    { title: "Created At", field: "createdAt", render: (rowData) => (<span>{moment(rowData.createdAt).format("DD MMM YYYY, hh:mm A")}</span>) },
    {
      title: "Action",
      field: "action",
      isSort: "no",
      render: (rowData) => (
        <button
          onClick={() => setSelectedNotification(rowData)}
          className="inline-flex items-center px-3 py-0.5 rounded-md text-sm cursor-pointer bg-[#191D38] text-white capitalize"
        >
          View
        </button>
      ),
    },
  ];

  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filterData, setFilterData] = useState({
    page: 0, sizePerPage: 10, status: 'all'
  });

  useEffect(() => {
    const accessRight = configuration.accessRight("notification")
    setAccessData(accessRight)
    if (accessRight?.is_view) {
      setIsValid(true);
      getDatas(filterData);
    } else {
      navigate("/dashboard");
    }
  }, []);

  function getDatas(filterKeys) {
    configuration.getAPIaxios({ url: 'admin/notification/list-sort', params: filterKeys }).then((data) => {
      if (data?.total) {
        setData(data.data);
        setTotalData(data.total);
      } else {
        setData([]);
        setTotalData(0);
      }
    }).catch(error => {
      return toast.error(error.message)
    });
  }

  function filterOnClick(type) {
    setFilters(filters.map(item => item.type === type ? { ...item, isActive: true } : { ...item, isActive: false }))
    setFilterData({ ...filterData, status: type, page: 0 })
    getDatas({ ...filterData, status: type, page: 0 });
  }
  function searchOnChange(e) {
    setFilterData({ ...filterData, search: e })
    getDatas({ ...filterData, search: e });
  }
  function onPageNavigation(type) {
    setFilterData((type === 'next') ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 });
    getDatas((type === 'next') ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 });
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


  return (
    isValid ? <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Notifications" />
      <main className="flex-1">
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <NotificationDetailModal
              notification={selectedNotification}
              onClose={() => setSelectedNotification(null)}
            />
            <div className="datatable">
              <Table
                tableTitle="admin"
                ids={[]}
                filters={filters}
                filterOnClick={filterOnClick}
                searchOnChange={searchOnChange}
                columns={columns}
                data={data}
                onPageNavigation={onPageNavigation}
                totalData={totalData}
                filterData={filterData}
                onSortKey={onSortKey}
                onSizePerPage={onSizePerPage}
              />
            </div>
          </div>
        </div>
      </main>
    </> : <Loader />
  );
}

export default Notifications;
