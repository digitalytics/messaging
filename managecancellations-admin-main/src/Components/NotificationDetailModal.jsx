import React, { Fragment, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import moment from "moment";

const STATUS_STYLES = {
  delivered: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-700"
};

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="col-span-2 text-gray-900 break-words">{value || "—"}</span>
    </div>
  );
}

export default function NotificationDetailModal({ notification, onClose }) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    setOpen(Boolean(notification));
  }, [notification]);

  const appointment = [notification?.slotDate, notification?.slotTime].filter(Boolean).join(" ")
    || (notification?.appointmentid ? `Appointment #${notification.appointmentid}` : "");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={onClose}>
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <EnvelopeIcon className="h-6 w-6 text-blue-700" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between gap-2">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        {notification?.patientName || "Notification"}
                      </Dialog.Title>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[notification?.status] || "bg-gray-100 text-gray-600"}`}>
                        {notification?.status || "—"}
                      </span>
                    </div>
                    <div className="mt-3 divide-y divide-gray-100 border-y border-gray-100">
                      <Row label="Email" value={notification?.email} />
                      <Row label="Home Phone" value={notification?.homephone ? `${notification?.countrycode || ""} ${notification.homephone}` : ""} />
                      <Row label="Department" value={notification?.departmentName} />
                      <Row label="Priority" value={notification?.priority} />
                      <Row label="Appointment" value={appointment} />
                      <Row label="Provider" value={notification?.providerName} />
                      <Row label="Type" value={notification?.appointmentType} />
                      <Row label="Sent" value={notification?.createdAt ? moment(notification.createdAt).format("DD MMM YYYY, hh:mm A") : ""} />
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900">{notification?.subject}</p>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{notification?.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
                <Button
                  className="bg-[#000] px-5 py-2.5 w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
                  text={"Close"}
                  onClick={onClose}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

NotificationDetailModal.propTypes = {
  notification: PropTypes.object,
};
