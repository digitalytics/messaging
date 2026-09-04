import React, { Fragment } from "react";
import IconButton from "./IconButton";
import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  EllipsisVerticalIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../Utils/common";
import { Link } from "react-router-dom";
import { CSVLink, CSVDownload } from "react-csv";
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function ListAction({
  actionObject,
  pagelink,
  buttontitle,
  isAddButton = true,
  csvData = [],
  csvName = ''
}) {
  function printInvoice() {
    const doc = new jsPDF('landscape')
    doc.autoTable({ html: '#table' })
    doc.autoTable({
      columnStyles: { 0: { halign: 'left' } }, // Cells in first column centered and green
      margin: { top: 10 },
      head: csvData.slice(0,1),
      body: csvData.slice(1)
    })
    doc.save(csvName + '.pdf')
  }
  return (
    <div className="sm:flex sm:items-center sm:justify-end">
      <div className="flex items-center mt-4 gap-x-3">
        {isAddButton && (
          <Link to={pagelink}>
            <IconButton
              className="bg-[#2B78C0] px-4 py-2  w-full text-white text-[16px] rounded-[5px] relative group overflow-hidden"
              text={buttontitle}
              icon={<PlusCircleIcon className="w-5" />}
            />
          </Link>
        )}
        {Object.values(actionObject).some(item => item.isShow)?
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center rounded-full border-2 py-2 px-2 border-[#000] outline-none ">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon
                  className="h-5 w-5  text-[#000]"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-[#fff] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {actionObject.import.isShow && (
                    <Menu.Item>
                      {({ Import }) => (
                        <button
                          onClick={actionObject.import.handleAction}
                          className={classNames(
                            Import
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <CloudArrowUpIcon className="w-5" /> <span>Import</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject.export.isShow && (
                    <Menu.Item>
                      {({ Import }) => (
                        <button
                          onClick={actionObject.export.handleAction}
                          className={classNames(
                            Import
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <DocumentArrowDownIcon className="w-5" />{" "}
                          <span>Export</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject.active.isShow && (
                    <Menu.Item>
                      {({ Active }) => (
                        <button
                          onClick={actionObject.active.handleAction}
                          className={classNames(
                            Active
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <CheckCircleIcon className="w-5" />{" "}
                          <span>Make Active</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject.inactive.isShow && (
                    <Menu.Item>
                      {({ Inactive }) => (
                        <button
                          onClick={actionObject.inactive.handleAction}
                          className={classNames(
                            Inactive
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <MinusCircleIcon className="w-5" />{" "}
                          <span>Make Inactive</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  {actionObject.delete.isShow && (
                    <Menu.Item>
                      {({ Delete }) => (
                        <button
                          onClick={actionObject.delete.handleAction}
                          className={classNames(
                            Delete
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <TrashIcon className="w-5" /> <span>Delete</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject?.downloadpdf?.isShow && (
                    <Menu.Item>
                      {({ Downloadpdf }) => (
                        <button
                          onClick={actionObject.downloadpdf.handleAction}
                          className={classNames(
                            Downloadpdf
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <ArrowDownTrayIcon className="w-5" /> <span onClick={()=>printInvoice()}>Download as PDF</span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject?.downloadcsv?.isShow && (
                    <Menu.Item>
                      {({ Downloadcsv }) => (
                        <button
                          onClick={actionObject.downloadcsv.handleAction}
                          className={classNames(
                            Downloadcsv
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <ArrowDownTrayIcon className="w-5" /> 
                          <span><CSVLink data={csvData} filename={`${(csvName && csvName === '') ? 'Data' : csvName}.csv`}>Download as CSV</CSVLink></span>
                        </button>
                      )}
                    </Menu.Item>
                  )}
                  {actionObject?.downloadexcel?.isShow && (
                    <Menu.Item>
                      {({ Downloadexcel }) => (
                        <button
                          onClick={actionObject.downloadexcel.handleAction}
                          className={classNames(
                            Downloadexcel
                              ? "bg-gray-100 text-[#000]"
                              : "text-[#000]",
                            "block px-4 py-2 text-base font-medium cursor-pointer flex items-center gap-3"
                          )}
                        >
                          <ArrowDownTrayIcon className="w-5" /> 
                          <span><CSVLink data={csvData} filename={`${(csvName && csvName === '') ? 'Data' : csvName}.xls`}>Download as Excel</CSVLink></span>

                        </button>
                      )}
                    </Menu.Item>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>:null
        }
      </div>
    </div>
  );
}
