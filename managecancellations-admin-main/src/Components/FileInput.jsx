import PropTypes from "prop-types";
import React, { useState } from "react";

// For Input Element
function TextInput({ id, name, handleChange, value }) {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <img
        className="relative h-32 w-32  mx-auto rounded-lg border"
        name={name} id={id} src={value}
        alt=""
        onError={(e)=> e.target.src ="../img/avatar.png"}
      />
      <label
        htmlFor={id}
        className="absolute inset-0 flex h-32 w-32  mx-auto items-center rounded-lg justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
      >
        <span>Change</span>
        <span className="sr-only">Photo</span>
        <input
          type="file"
          id={name} name={name}
          onChange={handleChange}
          accept="image/*"
          className="absolute inset-0 h-32 w-32  mx-auto cursor-pointer rounded-lg border-gray-300 opacity-0"
        />
      </label>
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

TextInput.defaultProps = {
  id: "",
  name: "",
};

export default TextInput;
