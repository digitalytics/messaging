import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import ButtonCancel from "../../Components/ButtonCancel";
import Dropdown from "../../Components/Dropdown";
import configuration from '../../config';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Tab } from "@headlessui/react";
import { classNames } from "../../Utils/common";
import DatePicker from "../../Components/DatePicker";


function EditAdmin() {
  const navigate = useNavigate();
  const [fields, setFields] = useState();
  const [errors, setErrors] = useState();
  const [changePassFields, setChangePassFields] = useState();
  const [changePasserrors, setChangePassErrors] = useState();
  const [roleOptions, setRoleOptions] = useState([]);

  const breadCrumbLinks = [
    { name: "Admin", href: "/admin", current: false },
    { name: "Edit Admin", href: "#", current: true },
  ];

  const statusOptions = [
    { id: 0, name: "Active", value: "active" },
    { id: 1, name: "Inactive", value: "inactive" },
  ];
  function validation() {
    let flag = true;
    let error = {}
    if (!fields.name) {
      error['name'] = "Please enter name"
      flag = false
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (fields?.email && !emailPattern.test(fields?.email)) {
      error['email'] = "Please enter valid email"
      flag = false
    }
    if (!fields.roleId) {
      error["roleId"] = "Please select role";
      flag = false;
    }
    if (!fields.email) {
      error['email'] = "Please enter email"
      flag = false
    }
    if (!fields.gender) {
      error['gender'] = "Please select gender"
      flag = false
    }
    if (!fields.dateOfBirth) {
      error['dateOfBirth'] = "Please select date of birth"
      flag = false
    }
    if (!fields.status) {
      error['status'] = "Please select status"
      flag = false
    }
    setErrors({ ...error })
    return flag;
  }
  function changePassValidation() {
    let flag = true;
    let error = {}
    if (!changePassFields.oldPassword) {
      error['oldPassword'] = "Please enter old password"
      flag = false
    }
    if (!changePassFields.newPassword) {
      error['newPassword'] = "Please enter new password"
      flag = false
    }
    if (!changePassFields.confirm_password) {
      error['confirm_password'] = "Please enter confirm password"
      flag = false
    }
    if (changePassFields.confirm_password !== changePassFields.newPassword) {
      error['confirm_password'] = "New Password and confirmation password do not match."
      flag = false
    }
    setChangePassErrors({ ...error })
    return flag;
  }

  useEffect(() => {
    let url = window.location.href;
    let ID = url.substring(url.lastIndexOf("/") + 1);
    const loginID = localStorage.getItem("user_id");
    if (loginID !== ID) {
      const accessData = configuration.accessRight("admin");
      if (!accessData?.is_edit) {
        navigate("/dashboard");
      }
    }
    getRoles();
    configuration.getAPIaxios({ url: 'admin/admin/list', params: { ID } }).then((data) => {
      if (data) {
        setFields(data)
      }
    }).catch(error => {
      return toast.error(error.message)
    });
  }, []);
  const handleSubmit = () => {
    if (validation()) {
      configuration.allAPI({ url: 'admin/admin/update', params: fields, method: 'PATCH' }).then(async (data) => {
        if (data.payload) {
          toast.success("Record updated successfully")
          navigate("/admin")
        } else if (data.error) {
          return toast.error(data.error.message)
        } else {
          return toast.error('Something went wrong')
        }
      }).catch(error => {
        return toast.error(error.message)
      });
    }
  }
  function getRoles() {
    configuration
      .getAPIaxios({ url: "admin/role/list-sort", params: {} })
      .then((data) => {
        if (data?.total) {
          let opt = [];
          data.data.map((single) => {
            opt.push({ name: single.title, value: single._id });
          });
          setRoleOptions(opt);
        } else {
          setRoleOptions([]);
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  }
  const handleSubmitChangePass = () => {
    if (changePassValidation()) {
      configuration.allAPI({ url: 'admin/admin/change-password', params: changePassFields, method: 'PATCH' }).then(async (data) => {
        if (data.payload) {
          toast.success("Your password changed successfully")
          navigate("/admin")
        } else if (data.error) {
          return toast.error(data.error.message)
        } else {
          return toast.error('Something went wrong')
        }
      }).catch(error => {
        return toast.error(error.message)
      });
    }
  }
  return (
    <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Edit Admin" />
      <main className="flex-1">
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <div className="bg-white shadow border border-slate-200 rounded-lg px-4 py-4">
              <div className="mt-6 sm:mt-2 2xl:mt-5">
                <div className="mx-auto">
                  <Tab.Group>
                    <Tab.List className="flex">
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "w-full py-2.5 text-sm font-medium leading-5 border-b",
                            "ring-white ring-opacity-0 focus:outline-none focus:ring-0",
                            selected
                              ? "border-b-2 border-[#45B600] text-[#45B600]"
                              : "text-black"
                          )
                        }
                      >
                        Profile
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            "w-full py-2.5 text-sm font-medium leading-5 border-b",
                            "ring-white ring-opacity-0 focus:outline-none focus:ring-0",
                            selected
                              ? "border-b-2 border-[#45B600] text-[#45B600]"
                              : "text-black"
                          )
                        }
                      >
                        Change Password
                      </Tab>
                    </Tab.List>
                    <Tab.Panels className="py-5 px-6 bg-white">
                      <Tab.Panel
                        className={classNames(
                          "",
                          "ring-white ring-opacity-0 ring-offset-2"
                        )}
                      >
                        <form className="space-y-6" action="#" method="POST">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                              <Label
                                text="Name"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Input
                                  name="Name"
                                  type="text"
                                  id="Name"
                                  value={fields?.name}
                                  onChange={(e) => { setFields({ ...fields, name: e.target.value }) }}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                />
                              </div>
                              {errors?.name ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={errors?.name} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Email"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Input
                                  name="Email"
                                  type="email"
                                  id="Email"
                                  value={fields?.email}
                                  onChange={(e) => { setFields({ ...fields, email: e.target.value }) }}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                />
                              </div>
                              {errors?.email ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={errors?.email} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Select Role"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Dropdown
                                  id="id"
                                  name="name"
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                  value={fields?.roleId}
                                  options={roleOptions}
                                  disabled={true}
                                />
                              </div>
                              {errors?.roleId ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={errors?.roleId} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Date of Birth"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <DatePicker
                                  value={new Date(fields?.dateOfBirth)}
                                  startDate={new Date(fields?.dateOfBirth)}
                                  endDate={new Date(fields?.dateOfBirth)}
                                  maxDate={new Date()}
                                  onChange={(e) => setFields({ ...fields, dateOfBirth: new Date(e.startDate) })}
                                />
                              </div>
                              {errors?.dateOfBirth ? (
                                <Label className={`block text-sm text-[#025196]`} text={errors?.dateOfBirth} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Gender"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2 flex gap-2">
                                <Input
                                  name="male"
                                  type="radio"
                                  id="male"
                                  value="male"
                                  checked={(fields?.gender === 'male')}
                                  onChange={(e) => { setFields({ ...fields, gender: e.target.value }) }}
                                /><Label
                                  text="Male"
                                  htmlFor="male"
                                  className="block text-[15px] text-gray-900 font-medium"
                                />
                                <Input
                                  name="female"
                                  type="radio"
                                  id="female"
                                  value="female"
                                  checked={(fields?.gender === 'female')}
                                  onChange={(e) => { setFields({ ...fields, gender: e.target.value }) }}
                                /><Label
                                  text="Female"
                                  htmlFor="female"
                                  className="block text-[15px] text-gray-900 font-medium"
                                />
                              </div>
                              {errors?.gender ? (
                                <Label className={`block text-sm text-[#025196]`} text={errors?.gender} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Select Status"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Dropdown
                                  id="id"
                                  name="name"
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                  value={fields?.status}
                                  onChange={(e) => { setFields({ ...fields, status: e.target.value }) }}
                                  options={statusOptions}
                                />
                              </div>
                              {errors?.status ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={errors?.status} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Last Login"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                              <Label
                                text={moment(fields?.lastLogin).format('DD-MM-YYYY HH:mm A')}
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              </div>
                              {errors?.dateOfBirth ? (
                                <Label className={`block text-sm text-[#025196]`} text={errors?.dateOfBirth} />
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-5">
                            <div>
                              <Link to="/admin">
                                <ButtonCancel
                                  className="border border-white px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden bg-slate-900"
                                  text={"Cancel"}
                                />
                              </Link>
                            </div>
                            <div>
                              <Button
                                className="bg-[#2B78C0] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                                text={"Submit"}
                                onClick={() => handleSubmit()}
                              />
                            </div>
                          </div>
                        </form>
                      </Tab.Panel>
                      <Tab.Panel
                        className={classNames(
                          "",
                          "ring-white ring-opacity-0 ring-offset-2"
                        )}
                      >
                        <form className="space-y-6" action="#" method="POST">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                              <Label
                                text="Old Password"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Input
                                  name="oldPassword"
                                  type="password"
                                  id="oldPassword"
                                  onChange={(e) => { setChangePassFields({ ...changePassFields, oldPassword: e.target.value }) }}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                />
                              </div>
                              {changePasserrors?.oldPassword ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={changePasserrors?.oldPassword} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="New Password"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Input
                                  name="newPassword"
                                  type="password"
                                  id="newPassword"
                                  onChange={(e) => { setChangePassFields({ ...changePassFields, newPassword: e.target.value }) }}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                />
                              </div>
                              {changePasserrors?.newPassword ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={changePasserrors?.newPassword} />
                              ) : null}
                            </div>
                            <div>
                              <Label
                                text="Confirm  Password"
                                className="block text-[15px] text-gray-900 font-medium"
                              />
                              <div className="mt-2">
                                <Input
                                  name="ConfirmPassword"
                                  type="password"
                                  id="ConfirmPassword"
                                  onChange={(e) => { setChangePassFields({ ...changePassFields, confirm_password: e.target.value }) }}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                                />
                              </div>
                              {changePasserrors?.confirm_password ? (
                                <Label className={`block text-sm text-[#2B78C0]`} text={changePasserrors?.confirm_password} />
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-5">
                            <div>
                              <Link to="/admin">
                                <ButtonCancel
                                  className="border border-white px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden bg-slate-900"
                                  text={"Cancel"}
                                />
                              </Link>
                            </div>
                            <div>
                              <Button
                                className="bg-[#2B78C0] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                                text={"Change Password"}
                                onClick={() => handleSubmitChangePass()}
                              />
                            </div>
                          </div>
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default EditAdmin;
