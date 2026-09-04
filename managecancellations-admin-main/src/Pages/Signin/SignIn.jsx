import React, { useEffect, useState } from "react";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import configuration from '../../config';
import { toast } from 'react-toastify';

function SignIn() {
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
    if (!fields.password) {
      error['password'] = "Please enter password"
      flag = false
    }
    setErrors({ ...error })
    return flag;
  }
  function verifyToken() {
    try {
      var retrievedObject = localStorage.getItem("token");
      if (retrievedObject) {
        configuration.getAPIaxios({ url: 'admin/admin/verifySession' }).then((data) => {
          if (data.isValid) {
            navigate("/dashboard")
          } else {
            navigate("/");
          }
        }).catch(error => {
          navigate("/");
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    }
  }
  useEffect(() => {
    verifyToken()
  }, []);

  const handleSubmit = () => {
    if (validation()) {
      configuration.postAPI({ url: 'admin/auth/sign-in', params: fields }).then(async (data) => {
        if (data.payload) {
          localStorage.setItem('user_id', data.payload._id);
          localStorage.setItem('email', data.payload.email);
          localStorage.setItem('token', data.payload.token);
          localStorage.setItem("rightsData", JSON.stringify(data?.payload?.accessData));
          navigate("/dashboard")
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
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900 admin-semibold">
          Sign in to your account
        </h2>        
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow px-8 py-8 rounded-lg">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <Label
                text="Email"
                className="block text-[15px] text-gray-900"
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

            <div>
              <Label
                text={"Password"}
                className="block text-[15px] text-gray-900"
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
              {errors.password ? (
                <Label className={`block text-sm text-[#2B78C0]`} text={errors.password} />
              ) : null}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-[#2B78C0] hover:text-[#8EC640] admin-medium"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                className="bg-[#2B78C0] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden admin-medium"
                text={"Sign In"}
                onClick={() => handleSubmit()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
