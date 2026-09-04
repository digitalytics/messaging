import React from "react";

function TextArea({ name, id, className, placeholder, rows, onChange, value}) {
  return (
    <>
      <textarea
        rows={rows}
        name={name}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        className={className}
      />
    </>
  );
}

export default TextArea;
