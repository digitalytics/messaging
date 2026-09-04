import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Table from "../../Components/Table";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import ListAction from "../../Components/ListAction";
import DeleteModel from "../../Components/DeleteModel";
import configuration from '../../config';
import { toast } from 'react-toastify';
import Loader from "../../Components/Loader";

function Admin() {
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState({ is_view: true });
  const [isValid, setIsValid] = useState(true);
  const breadCrumbLinks = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Admin", href: "#", current: true },
  ];
  const [filters, setFilters] = useState([
    { name: "View All", type: "all", isActive: true },
    { name: "Active", type: "active", isActive: false },
    { name: "Inactive", type: "inactive", isActive: false },

  ])
  const [ids, setIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const columns = [
    {
      title: "Name",
      field: "name",
      render: (rowData) => (
        accessData?.is_edit ? <>
          <Link to={`/edit-admin/${rowData?._id}`} className="text-[#2B78C0]">
            {rowData?.name}
          </Link>
        </> : rowData?.name
      ),
    },

    {
      title: "Email",
      field: "email",
    },
    {
      title: "Role",
      field: "role",
    },
    {
      title: "Registration Date", field: "createdAt", render: (rowData) => (
        <>
          <span>
            {moment(rowData.createdAt).format("DD MMM YYYY, hh:mm A")}
          </span>
        </>
      ),
    },
    {
      title: "Last Login",
      field: "lastLogin", render: (rowData) => (
        <>
          <span>
            {moment(rowData.lastLogin).format("DD MMM YYYY, hh:mm A")}
          </span>
        </>
      ),
    },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <span
          className={
            rowData.status === "active"
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
  ];

  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filterData, setFilterData] = useState({
    page: 0, sizePerPage: 10
  });

  const inputRef = useRef();

  const handleAction = (type) => {
    if (type === 'import') {
      inputRef.current.click();
      return;
    } else if (type === "export") {
      return;
    } else if (ids.length < 1) {
      return toast.error('Please select at least one record')
    } else if (type === 'delete') {
      setShowModal(true);
      return;
    }
    const sendData = {
      ids,
      type: (type === 'makeActive') ? 'active' : (type === 'makeInactive') ? 'inactive' : type
    }
    configuration.allAPI({ url: 'admin/admin/action', method: 'PATCH', params: sendData }).then((data) => {
      if (data.payload) {
        getDatas(filterData)
        setIds([]);
        return toast.success((type === 'delete') ? 'Record deleted successfully' : 'Record update successfully')
      } else if (data.error) {
        return toast.error(data.error.message)
      } else {
        return toast.error('Something went wrong')
      }
    }).catch(error => {
      return toast.error(error.message)
    });
  };

  const actionObject = {
    import: {
      isShow: false,
      handleAction: () => handleAction('import'),
    },
    active: {
      isShow: accessData?.is_edit,
      handleAction: () => handleAction('active'),
    },
    inactive: {
      isShow: accessData?.is_edit,
      handleAction: () => handleAction('inactive'),
    },
    banned: {
      isShow: false,
      handleAction: () => handleAction('banned'),
    },
    delete: {
      isShow: accessData?.is_delete,
      handleAction: () => handleAction('delete'),
    },
    export: {
      isShow: false,
      handleAction: () => handleAction('export'),
    },
  };

  const onCheckSelection = (e, values) => {
    if (values === 'all') {
      if (e.target.checked) {
        setIds(data.map(o => o['_id']));
      } else {
        setIds([]);
      }
    } else {
      if (e.target.checked) {
        setIds([...ids, values._id]);
      } else {
        setIds(ids.filter(item => item !== values._id));
      }
    }
  };

  useEffect(() => {
    const accessRight = configuration.accessRight("admin")
    setAccessData(accessRight)
    if (accessRight?.is_view) {
      setIsValid(true);
      getDatas(filterData);
    } else {
      navigate("/dashboard");
    }
  }, []);
  function getDatas(filterKeys) {
    if (filterKeys?.status && filterKeys?.status === 'all') {
      delete filterKeys.status;
    }
    configuration.getAPIaxios({ url: 'admin/admin/list-sort', params: filterKeys }).then((data) => {
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

  function handleDelete() {
    const sendData = {
      ids,
      type: 'delete'
    }
    configuration.allAPI({ url: 'admin/admin/action', method: 'PATCH', params: sendData }).then((data) => {
      if (data.payload) {
        getDatas(filterData)
        setIds([]);
        setShowModal(false);
        return toast.success('Record deleted successfully')
      } else if (data.error) {
        return toast.error(data.error.message)
      } else {
        return toast.error('Something went wrong')
      }
    }).catch(error => {
      return toast.error(error.message)
    });
  }
  function handleCancel() {
    setShowModal(false);
  }
  function filterOnClick(type) {
    setFilters(filters.map(item => item.type === type ? { ...item, isActive: true } : { ...item, isActive: false }))
    setFilterData({ ...filterData, status: type })
    getDatas({ ...filterData, status: type });
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
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Admin" />
      <input ref={inputRef} className="hidden" type="file" />
      <main className="flex-1">
        <DeleteModel
          mode={showModal}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <ListAction actionObject={actionObject} isAddButton={accessData?.is_add} buttontitle="Add Admin" pagelink="/add-admin" />
            <div className="datatable">
              <Table
                tableTitle="admin"
                ids={ids}
                filters={filters}
                filterOnClick={filterOnClick}
                searchOnChange={searchOnChange}
                columns={columns}
                data={data}
                onCheckSelection={(accessData?.is_edit || accessData?.is_delete) && onCheckSelection}
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

export default Admin;
