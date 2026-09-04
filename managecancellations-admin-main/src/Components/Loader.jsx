import React, { Fragment } from "react";
import loader from "../Assets/images/loader.gif";

const Loader = () => {
  return (
    <Fragment>
      <div className="w-full mx-auto h-custom flex items-center justify-center">
        <img className="overflow-auto w-16" src={loader} />
      </div>
    </Fragment>
  );
};

export default Loader;
