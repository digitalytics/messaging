import React from "react";

function Dropdown({ name, id, className, value, options, onChange, disabled = false, loading = false, lable = "" }) {
  return (
    <select
      id={id}
      name={name}
      className={loading ? `${className} animate-pulse cursor-wait` : className}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
    >
      <option value="">{loading ? "Loading..." : (lable !== "" ? lable : "---Select---")}</option>
      {options.map((opt, indx) => {
        return (
          <option value={opt.value} key={opt?.id || indx}>
            {opt.name}
          </option>
        );
      })}
    </select>
  );
}

export default Dropdown;
