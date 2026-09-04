import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Table from "../../Components/Table";
import { Link } from "react-router-dom";
import ListAction from "../../Components/ListAction";
import DeleteModel from "../../Components/DeleteModel";
import configuration from "../../config";
import { toast } from "react-toastify";

function Module() {
  const breadCrumbLinks = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Module", href: "#", current: true },
  ];
  const [ids, setIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      title: "ID",
      field: "id",
      render: (rowData) => (
        <>
          <Link to={`/edit-module/${rowData._id}`} className="text-[#292C33] hover:text-[#B4FA64]">
            {rowData._id}
          </Link>
        </>
      ),
    },

    { title: "Name", field: "title" },
    { title: "Code", field: "code" },
  ];

  const inputRef = useRef();
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [filterData, setFilterData] = useState({
    page: 0,
    sizePerPage: 10,
  });
  const handleAction = (type) => {
    if (type === "import") {
      inputRef.current.click();
      return;
    } else if (type === "export") {
      return;
    } else if (ids.length < 1) {
      return toast.error("Please select at least one record");
    } else if (type === "delete") {
      setShowModal(true);
      return;
    }
    const sendData = {
      ids,
      type: type === "makeActive" ? "active" : type === "makeInactive" ? "inactive" : type,
    };
    configuration
      .allAPI({ url: "admin/module/action", method: "PATCH", params: sendData })
      .then((data) => {
        if (data.payload) {
          getDatas(filterData);
          setIds([]);
          return toast.success(type === "delete" ? "Record deleted successfully" : "Record update successfully");
        } else if (data.error) {
          return toast.error(data.error.message);
        } else {
          return toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  };

  const actionObject = {
    import: {
      isShow: false,
      handleAction: () => handleAction("import"),
    },
    addNewButton: {
      isShow: true,
    },
    active: {
      isShow: false,
      handleAction: () => handleAction("active"),
    },
    inactive: {
      isShow: false,
      handleAction: () => handleAction("inactive"),
    },
    banned: {
      isShow: false,
      handleAction: () => handleAction("banned"),
    },
    delete: {
      isShow: true,
      handleAction: () => handleAction("delete"),
    },
    export: {
      isShow: false,
      handleAction: () => handleAction("export"),
    },
  };

  useEffect(() => {
    getDatas(filterData);
  }, []);
  function getDatas(filterKeys) {
    if (filterKeys?.status && filterKeys?.status === "all") {
      delete filterKeys.status;
    }
    configuration
      .getAPIaxios({ url: "admin/module/list-sort", params: filterKeys })
      .then((data) => {
        if (data?.total) {
          setData(data.data);
          setTotalData(data.total);
        } else {
          setData([]);
          setTotalData(0);
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  }

  function handleDelete() {
    const sendData = {
      ids,
      type: "delete",
    };
    configuration
      .allAPI({ url: "admin/module/action", method: "PATCH", params: sendData })
      .then((data) => {
        if (data) {
          getDatas(filterData);
          setIds([]);
          setShowModal(false);
          return toast.success("Record deleted successfully");
        } else if (data?.error) {
          return toast.error(data?.error?.message);
        } else {
          return toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  }
  function handleCancel() {
    setShowModal(false);
  }
  function searchOnChange(e) {
    setFilterData({ ...filterData, search: e });
    getDatas({ ...filterData, search: e });
  }
  function onPageNavigation(type) {
    setFilterData(
      type === "next" ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 }
    );
    getDatas(
      type === "next" ? { ...filterData, page: filterData.page + 1 } : { ...filterData, page: filterData.page - 1 }
    );
  }
  function onSortKey(e) {
    if (e === filterData.sortBy) {
      setFilterData({ ...filterData, sortBy: "" });
      getDatas({ ...filterData, sortBy: "" });
    } else {
      setFilterData({ ...filterData, sortBy: e });
      getDatas({ ...filterData, sortBy: e });
    }
  }
  function onSizePerPage(e) {
    setFilterData({ ...filterData, sizePerPage: e.target.value, page: 0 });
    getDatas({ ...filterData, sizePerPage: e.target.value, page: 0 });
  }

  const onCheckSelection = (e, values) => {
    if (values === "all") {
      if (e.target.checked) {
        setIds(data.map((o) => o["_id"]));
      } else {
        setIds([]);
      }
    } else {
      if (e.target.checked) {
        setIds([...ids, values._id]);
      } else {
        setIds(ids.filter((item) => item !== values._id));
      }
    }
  };

  return (
    <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Module" />
      <input ref={inputRef} className="hidden" type="file" />
      <main className="flex-1">
        <div className="py-8">
          <DeleteModel mode={showModal} handleDelete={handleDelete} handleCancel={handleCancel} />
          <div className="px-5 sm:px-5 lg:px-5">
            <ListAction actionObject={actionObject} buttontitle="Add Module" pagelink="/add-module" />
            <div className="datatable">
              <Table
                ids={ids}
                searchOnChange={searchOnChange}
                columns={columns}
                data={data}
                onCheckSelection={onCheckSelection}
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
    </>
  );
}

export default Module;
