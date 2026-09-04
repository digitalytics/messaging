import React, { useState, useEffect } from "react";
import Breadcrumb from "../../Components/Breadcrumb";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import ButtonCancel from "../../Components/ButtonCancel";
import configuration from "../../config";
import { toast } from "react-toastify";


function EditModule() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});

  const breadCrumbLinks = [
    { name: "Module", href: "/module", current: false },
    { name: "Edit Module", href: "#", current: true },
  ];

  useEffect(() => {
    let url = window.location.href;
    let ID = url.substring(url.lastIndexOf("/") + 1);
    configuration
      .getAPIaxios({ url: "admin/module/list", params: { ID } })
      .then((data) => {
        if (data) {
          setFields(data);
        }
      })
      .catch((error) => {
        // console.log(error)
        return toast.error(error.message);
      });
  }, []);

  function validation() {
    let flag = true;
    let error = {};
    if (!fields?.title) {
      error["title"] = "Please enter title";
      flag = false;
    }
    setErrors({ ...error });
    return flag;
  }

  const handleSubmit = () => {
    if (validation()) {
      configuration
        .allAPI({ url: "admin/module/update", params: fields, method: "PATCH" })
        .then(async (data) => {
          if (data.payload) {
            toast.success("Record updated successfully");
            navigate("/module");
          } else if (data.error) {
            return toast.error(data.error.message);
          } else {
            return toast.error("Something went wrong");
          }
        })
        .catch((error) => {
          // console.log(error)
          return toast.error(error.message);
        });
    }
  };

  return (
    <>
      <Breadcrumb pages={breadCrumbLinks} pagetitle="Edit Module" />
      <main className="flex-1">
        <div className="py-8">
          <div className="px-5 sm:px-5 lg:px-5">
            <div className="bg-white cus_shadow border py-4 px-4">
              <form className="space-y-6" action="#" method="POST">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <Label text="Name" className="block text-[16px] text-[#000000]" />
                    <div className="mt-2">
                      <Input
                        name="Name"
                        type="text"
                        id="Name"
                        className="block w-full appearance-none text-black bg-white rounded-[5px] border-[#EFEFF4]  focus:border-[#EFEFF4] focus:ring-[#B4FA64] focus:ring-1  px-3 py-2.5 placeholder-gray-400  text-base"
                        onChange={(e) => {
                          setFields({ ...fields, title: e.target.value });
                        }}
                        value={fields?.title}
                      />
                      {errors?.title ? (
                        <Label className={`block text-sm text-[#D80027]`} text={errors?.title} />
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <Label text="Code" className="block text-[16px] text-[#000000]" />
                    <div className="mt-2">
                      <Input
                        name="Code"
                        type="text"
                        id="Code"
                        className="block w-full appearance-none text-black bg-white rounded-[5px] border-[#EFEFF4]  focus:border-[#EFEFF4] focus:ring-[#B4FA64] focus:ring-1  px-3 py-2.5 placeholder-gray-400  text-base"
                        value={fields?.code}
                        disabled={true}
                      />
                      {errors?.code ? (
                        <Label className={`block text-sm text-[#D80027]`} text={errors?.code} />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-5">
                  <div>
                    <Link to="/module">
                      <ButtonCancel
                        className="bg-[#D80027] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                        text={"Cancel"}
                      />
                    </Link>
                  </div>
                  <div>
                    <Button
                      className="bg-[#000] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
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

export default EditModule;
