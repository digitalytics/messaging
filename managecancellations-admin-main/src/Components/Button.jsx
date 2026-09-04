import React from "react";

function Button({ className, text, onClick={} }) {
  return (
    <button type="button" onClick={() => onClick()}  className={className}>
      {text}
    </button>
  );
}

export default Button;
