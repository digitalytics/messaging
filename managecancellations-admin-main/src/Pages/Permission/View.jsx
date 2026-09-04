import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import ColumnHeader from "../../Components/AccessRight/ColumnHeader";
import Label from "../../Components/Label";
import Dropdown from "../../Components/Dropdown";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import configuration from '../../config';
import { each } from 'underscore';
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";

// List Access Rights
function View() {
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState({ is_view: true });
  const [isValid, setIsValid] = useState(false);
  const [fields, setFields] = useState();
  const [module, setModule] = useState([]);
  const [errors, setErrors] = useState({})
  const [role, setRole] = useState([]);

  const breadCrumbLinks = [
    { name: "Permission", href: "#", current: true },
  ];

  const [columnHeaders, setColumn] = useState(
    [{ title: "View", value: 'is_view', selectAll: false },
    { title: "Add", value: 'is_add', selectAll: false },
    { title: "Edit", value: 'is_edit', selectAll: false },
    { title: "Delete", value: 'is_delete', selectAll: false }]);

  useEffect(() => {
    const accessRight = configuration.accessRight("permission")
    setAccessData(accessRight)
    if (!accessRight?.is_view) {
      navigate("/dashboard");
    } else {
      setIsValid(true);
    }
    configuration.getAPIaxios({ url: 'admin/role/list', params: { status: 'active' } }).then((data) => {
      if (data) {
        let dataList = [];
        data.map((single) => {
          dataList.push({ value: single._id, name: single.title })
        })
        setRole(dataList);

      }
    }).catch(error => {
      return toast.error(error.message)
    });

  }, []);

  function allCheckBoxChange(code, e) {
    each(module, single => {
      single.data[e.target.value] = e.target.checked;
    })
    each(columnHeaders, single => {
      if (single.value === e.target.value) {
        single.selectAll = e.target.checked;
      }
    })
    setModule([...module]);
    setColumn([...columnHeaders])
  }

  function checkBoxChange(code, e) {
    each(module, single => {
      if (single.code === code) {
        single.data[e.target.value] = e.target.checked;
      }
    })
    setModule([...module]);
  }

  function changeStatus(e) {
    setFields({ ...fields, 'roleID': e.target.value })
    if (e.target.value && e.target.value !== '') {
      configuration.getAPIaxios({ url: 'admin/accessRight/list-access', params: { roleID: e.target.value } }).then((data) => {
        if (data.accessData) {
          setModule(data.accessData)
          each(columnHeaders, single => {
            single.selectAll = false;
          })
          setColumn([...columnHeaders])
        }
      }).catch(error => {
        return toast.error(error.message)
      });
    } else {
      setModule([])
    }
  }

  function handleSubmit() {
    setErrors({})
    if (!fields.roleID) {
      let error = {};
      error['roleID'] = "Please select role"
      setErrors({ ...error })
      return false;
    }
    configuration.allAPI({ url: 'admin/accessRight/update-access', params: { ...fields, accessData: module }, method: "PATCH" }).then((data) => {
      if (data?.payload?.userUpdate) {
        toast.success('Updated Successfully')
        logOut();
      } else if (data?.error) {
        return toast.error(data?.message)
      } else {
        return toast.error('Something went wrong')
      }
    }).catch(error => {
      return toast.error(error?.message)
    });
  }

  function logOut() {
    const loginId = localStorage.getItem("loginlog_id");
    configuration
      .allAPI({ url: "admin/auth/sign-out", params: { loginId }, method: "POST" })
      .then(async (data) => {
        if (data.payload) {
          {
            localStorage.removeItem("user_id");
            localStorage.removeItem("email");
            localStorage.removeItem("userName");
            localStorage.removeItem("token");
            localStorage.removeItem("rightsData");
            localStorage.clear();
            navigate("/");
            window.location.reload();
          }
        } else if (data.error) {
          return toast.error(data.error.message);
        } else {
          return toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  }

  return (
    isValid ? <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Permission" />
      <div className="py-8 px-5 sm:px-5 lg:px-5">
        <div className="relative bg-white shadow border border-slate-200 rounded-lg px-4 py-4">
          <section>
            <div className="flex flex-col">
              <div className=" overflow-x-auto">
                <div className="p align-middle inline-block min-w-full ">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                    <div className="lg:gap-y-0 lg:gap-x-8">
                      <form className="space-y-8 divide-y divide-gray-200">
                        <div className="space-y-8 divide-y divide-gray-200 sm:border-b">
                          <div className="sm:p-6">
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                              <div className="flex gap-10 justify-between">
                                <div className="w-80">
                                  <Label
                                    text="Select Role"
                                    className="block text-[16px] text-[#000]"
                                  />
                                  <div className="mt-2">
                                    <Dropdown
                                      id="id"
                                      name="name"
                                      className="block w-full appearance-none text-[#000] bg-[#E1DAFC] bg-opacity-10 border-[#E1DAFC] bg-opacity-10 border border border-[#E1DAFC] rounded-[5px]  focus:border-[#EFEFF4] focus:ring-[#8dc541] focus:ring-1  px-3 py-2.5 placeholder-gray-400  text-base"
                                      value={fields?.roleID}
                                      onChange={(e) => changeStatus(e)}
                                      options={role}
                                    />
                                    {errors.roleID ? <Label title='roleID' fieldError={errors.roleID} /> : null}
                                  </div>
                                </div>
                                {accessData?.is_edit ?
                                  <Button
                                    className="bg-[#2B78C0] px-5 mt-8 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                                    text={"Save Changes"}
                                    onClick={handleSubmit}
                                  /> : null
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden sm:rounded-lg">
                              <table
                                className="overflow-hidden border border-gray-200  rounded-lg w-full mt-5"
                                style={{ borderCollapse: "inherit" }}
                              >
                                <thead className="bg-[#E1DAFC] bg-opacity-10 border-[#E1DAFC]">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="relative px-6 py-3 text-sm font-normal text-left text-[#2B78C0]"
                                    >
                                      Module Name
                                    </th>
                                    {columnHeaders.map((header) => {
                                      return (
                                        <ColumnHeader
                                          title={header.title}
                                          key={header.value}
                                          id={header.value}
                                          name={header.value}
                                          disabled={!accessData?.is_edit}
                                          checked={header.selectAll}
                                          value={header.value}
                                          handleChange={(e) => allCheckBoxChange(header.value, e)}
                                        />
                                      );
                                    })}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#005C32]">
                                  {module.map((person, personIdx) => {
                                    return (
                                      <tr
                                        key={person.id}
                                        className={
                                          personIdx % 2 === 0
                                            ? ""
                                            : "bg-[#E1DAFC] bg-opacity-10 border-[#E1DAFC]"
                                        }
                                      >
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                          {person.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B78C0]">
                                          <input
                                            aria-describedby="comments-description"
                                            type="checkbox"
                                            name={person.title}
                                            id={person.title}
                                            value="is_view"
                                            checked={person.data?.is_view}
                                            disabled={!accessData?.is_edit}
                                            onClick={(e) => checkBoxChange(person.code, e)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B78C0]">
                                          <input
                                            aria-describedby="comments-description"
                                            type="checkbox"
                                            name={person.title}
                                            id={person.title}
                                            value="is_add"
                                            checked={person.data?.is_add}
                                            disabled={!accessData?.is_edit}
                                            onClick={(e) => checkBoxChange(person.code, e)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B78C0]">
                                          <input
                                            aria-describedby="comments-description"
                                            type="checkbox"
                                            name={person.title}
                                            id={person.title}
                                            value="is_edit"
                                            checked={person.data?.is_edit}
                                            disabled={!accessData?.is_edit}
                                            onClick={(e) => checkBoxChange(person.code, e)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                                          />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2B78C0]">
                                          <input
                                            aria-describedby="comments-description"
                                            type="checkbox"
                                            name={person.title}
                                            id={person.title}
                                            value="is_delete"
                                            checked={person.data?.is_delete}
                                            disabled={!accessData?.is_edit}
                                            onClick={(e) => checkBoxChange(person.code, e)}
                                            className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                                          />
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </> : <Loader />
  );
}

export default View;
