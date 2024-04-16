import React, { useEffect, useState } from "react";

import { FaChevronDown, FaCheck } from "react-icons/fa";

function WideDropdown({
  options,
  onSelectedChange,
  altstyle = {},
  className = "",
  style = {},
  value = undefined,
  zIndex,
  disabled = false,
  blurText = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleOptionClick = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    onSelectedChange && onSelectedChange(option);
  };

  const findLabel = (value) => {
    const option = options.find((option) => option.value === value);
    return option ? option?.label : value;
  };

  return (
    <div style={altstyle} className={`relative inline-block w-full text-left`}>
      <div>
        <button
          disabled={disabled}
          style={style}
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex justify-between items-center px-4 py-2 w-full text-sm font-medium text-[#696969] bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-aeonikregular ${className}`}
        >
          <span
            style={{
              filter: blurText && disabled ? "blur(4px)" : "none",
              pointerEvents: blurText && disabled ? "none" : "auto",
            }}
          >
            {selectedOption ? findLabel(selectedOption) : options[0]?.label}
          </span>
          <FaChevronDown className="ml-2" color="#b3b3b3" strokeWidth={0.5} />
        </button>
      </div>

      {isOpen && !disabled && (
        <div
          style={{
            zIndex: zIndex || 100,
          }}
          className="absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-full cursor-pointer"
        >
          <div
            className="py-1 z-[100] relative bg-white max-h-[200px] overflow-y-auto"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map(
              (option) =>
                option && (
                  <a
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`px-4 py-2 flex items-center text-sm text-gray-700 font-aeonikregular hover:bg-gray-100 ${
                      option.value === selectedOption ? "bg-gray-200" : ""
                    }`}
                    role="menuitem"
                  >
                    {option.value === selectedOption && (
                      <FaCheck className="inline mr-2" />
                    )}
                    {option.label}
                  </a>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WideDropdown;
