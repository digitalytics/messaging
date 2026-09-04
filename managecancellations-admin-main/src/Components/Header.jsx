import React, { Fragment, useEffect, useState } from "react";
import { Bars3BottomLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../Utils/common";
import { Link, useNavigate } from "react-router-dom";
import configuration from '../config';
import Nav from "../Components/nav";
function Header({ setSidebarOpen, setCurrency, pagetitle, setUnReadTickets }) {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("")
  function verifyToken() {
    try {
      var retrievedObject = localStorage.getItem("token");
      if (retrievedObject) {
        configuration.getAPIaxios({ url: 'admin/admin/verifySession' }).then((data) => {
          if (data.isValid) {
            setCurrency(data?.currency);
            localStorage.setItem("rightsData", JSON.stringify(data?.accessData));
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
    verifyToken();
    setUserID(localStorage.getItem("user_id"))
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 w-full">
        <div className="flex items-center gap-x-12 cus-manu">
          <h1><img
            className="w-28"
            src="./img/logo.svg"
            alt="Your Company"
          /></h1>
          <Nav />
        </div>
        <div className="ml-4 flex items-center gap-5 lg:ml-6">
          <Link to="/contact-us">
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none mt-2"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </Link>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="flex max-w-xs items-center rounded-full bg-[#006838] text-sm focus:outline-none ">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-opacity-5 bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                {/* {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        to={item.href}
                        className={classNames(
                          active ? "" : "",
                          "block px-4 py-2 text-sm text-[#fff]"
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))} */}
                <Menu.Item key={'setting'}>
                  {({ active }) => (
                    <Link
                      to={userID && userID !== '' ? `/edit-admin/${userID}` : '#'}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-900"
                      )}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item key={'Sign out'}>
                  {({ active }) => (
                    <div
                      onClick={() => {
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('email');
                        localStorage.removeItem("token");
                        navigate('/');
                      }}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-900 cursor-pointer"
                      )}
                    >
                      Sign out
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Header;
