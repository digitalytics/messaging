import React from "react";

function Input({ name, type, id, className,placeholder,required, onChange, value, disabled=false, min, checked }) {
  return <input min={min} placeholder={placeholder} required={required} name={name} value={value} type={type} id={id} disabled={disabled} className={className} onChange={onChange} checked={checked}/>;
}

export default Input;
