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

function AddRoles() {
  const navigate = useNavigate();
  const [fields, setFields] = useState();
  const [errors, setErrors] = useState();

  const breadCrumbLinks = [
    { name: "Roles", href: "/roles", current: false },
    { name: "Add Role", href: "#", current: true },
  ];

  const statusOptions = [
    {  id: 0, name: "Active", value: "active" },
    { id: 1,  name: "Inactive", value: "inactive" },
  ];

  function handleChange(name, value) {
    setFields({ ...fields, [name]: value });
  }

  function validation() {
    let flag = true;
    let error = {}
    if (!fields.title) {
      error['title'] = "Please enter title"
      flag = false
    }
    if (!fields.status) {
      error['status'] = "Please select status"
      flag = false
    }
    setErrors({ ...error })
    return flag;
  }

  const handleSubmit = () => {
    if (validation()) {
      configuration.allAPI({ url: 'admin/role/create', params: fields, method: 'PUT' }).then(async (data) => {
        if (data.payload) {
          toast.success("Record added successfully")
          navigate("/roles")
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
  
  useEffect(() => {
    const accessRight = configuration.accessRight("role")
    if (!accessRight?.is_add) {
      navigate("/dashboard");
    }
  }, []);
  
  return (
    <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Add Role" />
      <main className="flex-1">
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <div className="bg-white shadow border border-slate-200 rounded-lg px-4 py-4">
              <form className="space-y-6" action="#" method="POST">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <Label
                      text="Title"
                      className="block text-[15px] text-gray-900 font-medium"
                    />
                    <div className="mt-2">
                      <Input
                        name="Title"
                        type="text"
                        id="Title"
                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:border-[#2B78C0] focus:ring-[#2B78C0] sm:text-sm sm:leading-6 px-3 py-2.5"
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    {errors?.title ? (
                      <Label className={`block text-sm text-[#025196]`} text={errors?.title} />
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
                        onChange={(e) => handleChange("status", e.target.value)}
                        options={statusOptions}
                      />
                    </div>
                    {errors?.status ? (
                      <Label className={`block text-sm text-[#025196]`} text={errors?.status} />
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-5">
                  <div>
                    <Link to="/roles">
                      <ButtonCancel
                        className="border border-white px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden bg-[#2B78C0]"
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

export default AddRoles;
