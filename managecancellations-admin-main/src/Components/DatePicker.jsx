import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

function DatePicker({ value, onChange, startDate, endDate, minDate, maxDate, asSingle = true, useRange = false }) {
  value = { startDate, endDate }
  return (
    <>
      <div className="cus_date">
        <Datepicker
          primaryColor={"emerald"}
          value={value}
          classNames="px-5 py-2.5"
          containerClassName="relative text-gray-900"
          asSingle={asSingle}
          useRange={useRange}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </>
  );
}

export default DatePicker;
