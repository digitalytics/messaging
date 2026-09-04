import React, { useEffect, useState } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import ButtonCancel from "../../Components/ButtonCancel";
import Dropdown from "../../Components/Dropdown";
import configuration from '../../config';
import DatePicker from "../../Components/DatePicker";
import { toast } from 'react-toastify';

function AddAdmin() {
  const navigate = useNavigate();
  const [fields, setFields] = useState();
  const [errors, setErrors] = useState();
  const [roleOptions, setRoleOptions] = useState([]);

  const breadCrumbLinks = [
    { name: "Admin", href: "/admin", current: false },
    { name: "Add Admin", href: "#", current: true },
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
    if (!fields.email) {
      error['email'] = "Please enter email"
      flag = false
    }
    if (!fields.password) {
      error['password'] = "Please enter password"
      flag = false
    }
    if (!fields.confirm_password) {
      error['confirm_password'] = "Please enter confirm password"
      flag = false
    }
    if (fields.confirm_password !== fields.password) {
      error['confirm_password'] = "Password and confirmation password do not match."
      flag = false
    }
    if (!fields.roleId) {
      error["roleId"] = "Please select role";
      flag = false;
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

  useEffect(() => {
    const accessData = configuration.accessRight("admin");
    if (!accessData?.is_add) {
      navigate("/dashboard");
    }
    getRoles();
  }, []);

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

  const handleSubmit = () => {
    if (validation()) {
      configuration.allAPI({ url: 'admin/admin/create', params: fields, method: 'PUT' }).then(async (data) => {
        if (data.payload) {
          toast.success("Record added successfully")
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
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Add Admin" />
      <main className="flex-1">
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <div className="bg-white shadow border border-slate-200 rounded-lg px-4 py-4">
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
                      text="Password"
                      className="block text-[15px] text-gray-900 font-medium"
                    />
                    <div className="mt-2">
                      <Input
                        name="Password"
                        type="password"
                        id="Password"
                        onChange={(e) => { setFields({ ...fields, password: e.target.value }) }}
                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                      />
                    </div>
                    {errors?.password ? (
                      <Label className={`block text-sm text-[#2B78C0]`} text={errors?.password} />
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
                        onChange={(e) => { setFields({ ...fields, confirm_password: e.target.value }) }}
                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                      />
                    </div>
                    {errors?.confirm_password ? (
                      <Label className={`block text-sm text-[#2B78C0]`} text={errors?.confirm_password} />
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
                        onChange={(e) => { setFields({ ...fields, roleId: e.target.value }) }}
                        options={roleOptions}
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AddAdmin;
