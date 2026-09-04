import React from "react";
import Select from 'react-select';



function MultiSelect({ selectedOption, setSelectedOption, options, className }) {
  return (
    <div className="App">
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        className={className}
        isMulti={true}
        value={selectedOption}
      />
    </div>
  );
}

export default MultiSelect;
