import PropTypes from "prop-types";
import React from "react";

// For Table Header Checkbox
function ColumnHeader({ title, id, name, handleChange, checked, value, disabled }) {
  return (
    <th
      scope="col"
      className="relative px-6 py-3 text-sm font-normal text-left text-[#2B78C0]"
    >
      <div className="flex items-center gap-3">
      <input
        aria-describedby="comments-description"
        name={name}
        type="checkbox"
        id={id}
        value={value}
        checked={checked}
        disabled={disabled}
        onClick={(e) => handleChange(e)}
        className="h-5 w-5 rounded border-gray-300 text-gray-900 shadow-none focus:ring-0 outline-none"
      />{" "}
       <p>{title}</p>
      </div>
    </th>
  );
}

ColumnHeader.propTypes = {
  title: PropTypes.string,
};

ColumnHeader.defaultProps = {
  title: "",
};

export default ColumnHeader;
