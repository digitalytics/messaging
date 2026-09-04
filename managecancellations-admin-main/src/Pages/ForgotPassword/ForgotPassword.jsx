import React, { useState } from "react";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import configuration from '../../config';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  function validation() {
    let flag = true;
    let error = {}
    if (!fields.email) {
      error['email'] = "Please enter email"
      flag = false
    }
    setErrors({ ...error })
    return flag;
  }
  const handleSubmit = () => {
    if (validation()) {
      configuration.postAPI({ url: 'admin/auth/forgot-password', params: fields }).then(async (data) => {
        if (data.payload) {
          toast.success("Reset password link sent on your email")
          navigate("/")
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
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto w-auto" src="../img/logo.svg" alt="logo" />
        <h2 className="mt-6 text-center text-3xl tracking-tight text-gray-900 admin-semibold">
          Forgot Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow px-8 py-8 rounded-lg">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label
                text="Email"
                className="block text-[16px] text-gray-900 font-medium"
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
              {errors.email ? (
                <Label className={`block text-sm text-[#2B78C0]`} text={errors.email} />
              ) : null}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm gap-2 flex text-[#fff]">
                <Link
                  to="/"
                  className="admin-medium text-[#2B78C0] hover:text-[#8EC640]"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div>
              <Button
                className="bg-[#2B78C0] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden admin-medium"
                text={"Submit"}
                onClick={() => handleSubmit()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
