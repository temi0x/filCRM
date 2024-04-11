import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

function CustomSelect({ options, value, onChange, className, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value) || {};

  return (
    <div className={`relative rounded-md ${className}`}>
      <div
        className="p-[0.6rem] flex space-x-2 items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-aeonikregular text-[0.875rem] text-[#4E4E4E]">
          {selectedOption.label || placeholder}
        </span>
        <FiChevronDown color="#4E4E4E" size={16} />
      </div>

      {isOpen && (
        <div className="absolute w-40 mt-2 border-[#f2f2f2] border rounded-lg bg-white z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 font-aeonikregular text-xs ${
                option.className || ""
              } cursor-pointer hover:bg-gray-200`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
