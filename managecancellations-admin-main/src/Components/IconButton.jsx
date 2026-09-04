import React from "react";

function IconButton({ className, text, icon, onClick={} }) {
  return (
    <button type="button" onClick={onClick} className={className}>      
      <div className="flex items-center gap-3">
        <span className="relative">{icon} </span>
        <span className="relative">{text}</span>
      </div>
    </button>
  );
}

export default IconButton;
