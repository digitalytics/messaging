import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Link } from "react-router-dom";

function Breadcrumb({ pages, pagetitle }) {
  return (
    <>
      <nav className="flex px-4 py-2" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center">
          <li>
            <div>
              <a href="#" className="text-slate-900">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                {page.current ? (
                  <span
                    className="text-sm text-gray-500"
                    aria-current={page.current ? "page" : null}
                  >
                    {page.name}
                  </span>
                ) : (
                  <Link
                    to={page.href}
                    className="text-sm text-slate-900"
                    aria-current={page.current ? "page" : null}
                  >
                    {page.name}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight pl-4 admin-semibold">
            {pagetitle}
          </h2>
        </div>
      </div>
    </>
  );
}

export default Breadcrumb;
