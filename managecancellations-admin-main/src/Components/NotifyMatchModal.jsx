import React, { Fragment, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRIORITY_STYLES = {
  HIGH: "bg-red-100 text-red-700",
  NORMAL: "bg-blue-100 text-blue-700",
  LOW: "bg-gray-200 text-gray-700"
};

function formatHour(hour) {
  const num = Number(hour);
  if (!hour && num !== 0) return "";
  return `${num % 12 || 12}:00 ${num >= 12 ? "PM" : "AM"}`;
}

// Lists waitlisted patients whose Hour/Day preferences match a specific open
// slot, and notifies them one at a time — no bulk send, no message preview.
export default function NotifyMatchModal({ slot, matches = [], notifiedIds = new Set(), onClose, onNotify }) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    setOpen(Boolean(slot));
  }, [slot]);

  const appointmentType = slot?.appointmenttype || slot?.patientappointmenttypename || "Appointment";

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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                    <BellAlertIcon className="h-6 w-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Notify Matching Patients
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500">
                      {appointmentType} — {slot?.date} {slot?.starttime} {slot?.providerName ? `with ${slot.providerName}` : ""}
                    </p>
                    <div className="mt-4 max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {matches.length ? matches.map((entry) => {
                        const matchKey = `${slot?.appointmentid}-${entry?.waitlistid}`;
                        const sent = notifiedIds.has(matchKey);
                        return (
                          <div key={matchKey} className="flex items-center justify-between gap-3 py-3 text-left">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {entry?.firstname} {entry?.lastname}
                              </p>
                              <p className="text-xs text-gray-500">
                                {entry?.dayofweekids?.length ? entry.dayofweekids.map(d => dayNames[parseInt(d) - 1]).join(", ") : "Any day"}
                                {" · "}
                                {(entry?.hourfrom || entry?.hourto) ? `${formatHour(entry?.hourfrom)} - ${formatHour(entry?.hourto)}` : "Any time"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[entry?.priority] || "bg-gray-200 text-gray-700"}`}>
                                {(entry?.priority || "").toLowerCase() || "—"}
                              </span>
                              <button
                                disabled={sent}
                                onClick={() => onNotify(entry, slot)}
                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm capitalize ${sent ? "bg-gray-200 text-gray-500 cursor-default" : "bg-[#191D38] text-white cursor-pointer"}`}
                              >
                                {sent ? "Sent" : "Notify"}
                              </button>
                            </div>
                          </div>
                        );
                      }) : (
                        <p className="py-4 text-sm text-gray-500">No waitlisted patients match this slot.</p>
                      )}
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

NotifyMatchModal.propTypes = {
  matches: PropTypes.array,
};
