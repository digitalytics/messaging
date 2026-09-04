import React from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "../Utils/common";

function ComboboxCustom({
  combosearchitem,
  selectedPerson,
  setSelectedPerson,
  handleFilterList,
}) {
  return (
    <div>
      <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
        <div className="relative mt-2">
          <Combobox.Input
            onChange={handleFilterList}
            className="block w-full appearance-none text-[#fff] bg-[#E1DAFC] bg-opacity-10 border-[#E1DAFC] bg-opacity-10 border border border-[#E1DAFC] rounded-[5px]  focus:border-[#EFEFF4] focus:ring-[#8dc541] focus:ring-1  px-3 py-2.5 placeholder-gray-400  text-base"
            displayValue={(person) => person?.name}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {combosearchitem.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#E1DAFC]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {combosearchitem.map((person) => (
                <Combobox.Option
                  key={person.id}
                  value={person}
                  className={({ active }) =>
                    classNames(
                      "relative select-none py-2 pl-3 pr-9 cursor-pointer",
                      active ? "text-[#2B78C0] " : "text-[#000]"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected && "font-semibold text-[#2B78C0]"
                        )}
                      >
                        {person.name}
                      </span>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-[#2B78C0]" : "text-[#2B78C0]"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}

export default ComboboxCustom;
