import React from "react";

function ButtonCancel({ className, text, onClick=null }) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {text}
    </button>
  );
}

export default ButtonCancel;
