import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./Button";
import ButtonCancel from "./ButtonCancel";

// Alert Box
export default function DeleteModel({ mode, handleDelete, handleCancel, message = '' }) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  useEffect(() => {
    setOpen(mode)
  }, [mode])
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => setOpen(true)}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom dark:bg-[#262626] bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="dark:bg-[#262626] bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg dark:text-white leading-6 font-medium text-gray-900">
                      Delete Record
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-base dark:text-white text-gray-500">
                        {message && message !== ''?message:`Are you sure you want to delete this record? All of your data will be permanently removed.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-[#262626] border-t dark:border-gray-600  px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-5">
                <ButtonCancel
                  className="bg-[#D80027] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                  text={"Delete"}
                  onClick={handleDelete}
                  />
                <Button
                  className="bg-[#000] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                  text={"Cancel"}
                  onClick={handleCancel}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

DeleteModel.propTypes = {
  mode: PropTypes.bool,
};

DeleteModel.defaultProps = {
  mode: false,
};

// export default DeleteModel;
