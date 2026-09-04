import React, { useState } from "react";
import { classNames } from "../Utils/common";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowSmallUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Loader from "./Loader";
function Table({
  filters = [],
  columns = [],
  data = [],
  ids = [],
  tableTitle,
  onCheckSelection,
  onPageNavigation,
  searchOnChange,
  onSortKey,
  filterData = {},
  totalData = 0,
  SearchItems = true,
  Pagination = true,
  showTableLoader = false,
  filterOnClick,
  onSizePerPage
}) {
  const pageOptions = []
  function addPush(number) {
    if (totalData > number) {
      pageOptions.push(number)
    }
  }
  // addPush(5)
  addPush(10)
  addPush(50)
  addPush(100)
  addPush(200)
  addPush(500)
  const [state, setState] = useState({
    name: '',
    typing: false,
    typingTimeout: 0
  })

  return (
    <section className="mx-auto">

      <div className="mt-6 xl:flex xl:items-center xl:justify-between">
        <div className="inline-flex overflow-hidden bg-white hover:bg-gray-50 border divide-x rounded-lg xl-mb-3 mb-0 shadow-sm">
          {filters.map(({ name, type, isActive }, index) => {
            return (
              <button
                key={index}
                id={type}
                onClick={() => filterOnClick(type)}
                className={classNames(
                  "px-5 py-2 text-xs font-semibold text-gray-900 transition-colors duration-200 sm:text-sm",
                  isActive ? "bg-gray-900 text-white" : ""
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
        {SearchItems && (
          <div className="relative flex items-center mt-4 md:mt-0">
            <span className="absolute">
              <MagnifyingGlassIcon className="w-6 mx-3 text-gray-400" />
            </span>{" "}
            <input
              value={state.name}
              type="text"
              placeholder="Search"
              onChange={(e) => {

                // (e) => searchOnChange(e)
                if (state.typingTimeout) {
                  clearTimeout(state.typingTimeout);
                }
                setState({
                  name: e.target.value,
                  typing: false,
                  typingTimeout: setTimeout(function () {
                    searchOnChange(e.target.value);
                  }, 1000)
                });
              }
              }
              className="pr-5 md:w-80 pl-11 rtl:pr-11 rtl:pl-5 focus:outline-none block w-full appearance-none text-gray-900 bg-white rounded-[5px] border-[#dfe8f2] focus:border-[#2B78C0] focus:ring-[#2B78C0] focus:ring-1  px-3 py-2.5 placeholder-gray-400  text-base"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden bg-white shadow border border-slate-200 rounded-lg px-4 py-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 border-[#E1DAFC]">
                  <tr>
                    {onCheckSelection && (
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-medium text-left rtl:text-right text-slate-900"
                      >
                        <input
                          id="comments"
                          aria-describedby="comments-description"
                          name="comments"
                          type="checkbox"
                          checked={ids.length && ids.length === data.length}
                          onChange={(e) => onCheckSelection(e, 'all')}
                          className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                        />
                      </th>
                    )}
                    {columns.map((single, key) => {
                      return (
                        <th
                          key={key}
                          scope="col"
                          className="py-3.5 px-4 text-sm font-medium text-left rtl:text-right text-slate-900"
                        >
                          <button onClick={() => (single.isSort === 'no') ? null : onSortKey(single.field)} className="flex items-center gap-x-3 focus:outline-none">
                            <span>{single.title}</span>
                            {(filterData.sortBy === single.field) ? <ArrowSmallUpIcon className="w-4 flex-none" /> : null}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                {showTableLoader ?
                  <tbody className="divide-y divide-gray-200">
                    <tr><td colSpan={columns.length + (onCheckSelection ? 1 : 0)}>
                      <Loader />
                    </td></tr>
                  </tbody> :
                  data.length ?
                    <tbody className="divide-y divide-gray-200">
                      {data.map((singleItem, dataIndex) => {
                        return (
                          <tr
                            key={"table_row_" + dataIndex}
                            id={"table_row_" + dataIndex}
                          >
                            {onCheckSelection && (
                              <td className="px-4 py-4 text-sm font-medium text-slate-900">
                                <input
                                  id="comments"
                                  aria-describedby="comments-description"
                                  name="comments"
                                  type="checkbox"
                                  checked={ids.includes(singleItem?._id || singleItem?.label_id)}
                                  onChange={(e) => onCheckSelection(e, singleItem)}
                                  className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
                                />
                              </td>
                            )}
                            {columns.map((singleCol, colIndex) => {
                              return !singleCol.render ? (
                                <td
                                  className="px-4 py-4 text-sm font-medium text-slate-900"
                                  key={"table_data_" + colIndex + dataIndex}
                                >
                                  {singleItem[singleCol.field]}
                                </td>
                              ) : (
                                <td
                                  className="px-4 py-4 text-sm font-medium text-slate-900"
                                  key={"table_data_" + colIndex + dataIndex}
                                >
                                  <singleCol.render {...singleItem} />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody> :
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr><td colSpan={columns.length + 1} className="text-center py-10">
                        <img className="w-48 mx-auto" src="/img/noData.png" alt="No data found" />
                        There are not any {tableTitle || `records`} available.
                      </td></tr>
                    </tbody>
                }

              </table>
            </div>
          </div>
        </div>
      </div>
      {Pagination && (
        <div className="mt-6 sm:flex sm:items-center sm:justify-between">
          <div className="text-sm text-slate-900">
            <span className="font-medium text-slate-900">
              {(filterData?.page === 0) ? (totalData >= 1) ? 1 : 0 : (filterData?.page * filterData?.sizePerPage) + 1} - {((filterData?.page + 1) * filterData?.sizePerPage) < totalData ? (filterData?.page + 1) * filterData?.sizePerPage : totalData} of {totalData}
            </span>
          </div>
          <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
            {pageOptions.length > 0 ?
              <select
                id={"pageSige"}
                name={"pageSige"}
                className="block w-20 appearance-none text-black bg-white rounded-[5px] border-[#2B78C0]  focus:border-[#2B78C0] focus:ring-[#2B78C0] focus:ring-1  px-3 py-2 placeholder-gray-400  text-base"
                value={filterData?.sizePerPage}
                onChange={onSizePerPage}
              >
                {pageOptions.map((opt, indx) => {
                  return (
                    <option value={opt} key={indx}>
                      {opt}
                    </option>
                  );
                })}
                <option value={totalData} key={100}>All</option>
              </select> : null
            }
            <button
              onClick={() => onPageNavigation('previous')}
              className={` ${(filterData?.page <= 0) ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center w-1/2 px-5 py-2 text-sm text-[#fff] capitalize transition-colors duration-200 bg-[#2B78C0] border rounded-md sm:w-auto gap-x-2`}
              disabled={filterData?.page <= 0}
            >
              <ArrowLongLeftIcon className="w-6" />
              <span>previous</span>
            </button>{" "}
            <button
              onClick={() => onPageNavigation('next')}
              className={` ${(filterData?.page >= (Math.ceil(totalData / filterData?.sizePerPage) - 1)) ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center w-1/2 px-5 py-2 text-sm text-[#fff] capitalize transition-colors duration-200 bg-[#2B78C0] border rounded-md sm:w-auto gap-x-2`}
              disabled={filterData?.page >= (Math.ceil(totalData / filterData?.sizePerPage) - 1)}
            >
              <span>Next</span> <ArrowLongRightIcon className="w-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Table;
