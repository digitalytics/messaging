import React from "react";

function Label({ text, className, id, name, htmlFor }) {
  return (
    <label htmlFor={htmlFor} id={id} name={name} className={className}
    >
      {text}
    </label>
  );
}

export default Label;
