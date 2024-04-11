// src/components/Dropdown.js
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

function Dropdown({
  startIcon,
  base,
  style,
  options,
  onSelectedChange,
  value,
  full,
  disabled
}) {
    
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [inputOpt, setInputOpt] = useState(options[0]);
  const [filtOptions, setFiltOptions] = useState(options);
  const drpRef = useRef(null);
  const inputRef = useRef();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelectedChange && onSelectedChange(option);
    setInputOpt(option);
  };

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
      setInputOpt(value);
    }
  }, [value]);

  useEffect(() => {
    setFiltOptions(options);
  }, [options]);

  useEffect(() => {
    window.addEventListener("click", () => {
      if (drpRef.current) {
        setIsOpen(false);
      }
    });
  }, []);

  return (
    <div
      style={{
        width: full ? "100%" : undefined,
        zIndex: style?.zIndex || undefined,
      }}
      className="relative inline-block text-left col-span-3"
    >
      <div>
        <button
          style={{ width: full ? "100%" : undefined, ...style }}
          onClick={(e) => {
            e.stopPropagation();

            setIsOpen(!isOpen);

            inputRef.current?.focus();
          }}
          className={`inline-flex justify-between items-center px-4 py-3 text-sm font-medium text-${
            disabled ? "gray-500" : "#696969"
          } bg-${disabled ? "hover:bg-gray-100" : "white"} border border-${
            disabled ? "gray-200" : "#f2f2f2"
          } rounded-md  font-aeonikregular w-32`}
          disabled={disabled}
        >
          {startIcon && startIcon}
          <span className="mr-1">{base}</span>
          <input
            ref={inputRef}
            type="text"
            className={`border-none outline-none bg-transparent w-full `}
            autoComplete="password"
            value={inputOpt}
            readOnly={disabled}
            onChange={(e) => {
              setInputOpt(e.target.value);

              setFiltOptions(
                options.filter(
                  (x) => x.toLowerCase().indexOf(e.target.value) !== -1
                )
              );
              setIsOpen(true);
            }}
          />
          <FaChevronDown
            className="ml-2 min-w-[14px]"
            color={style?.color ? style.color : "#b3b3b3"}
            strokeWidth={0.5}
          />
        </button>
      </div>

      {isOpen && (
        <div
          ref={drpRef}
          style={style}
          className={`absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 h-fit z-10 overflow-y-scroll overflow-x-hidden max-h-[300px] cursor-pointer`}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {filtOptions.map((option) => (
              <a
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 font-aeonikregular hover:bg-gray-100 ${
                  option === selectedOption ? "bg-gray-200" : ""
                }`}
                role="menuitem"
              >
                {option === selectedOption && (
                  <FaCheck className="inline mr-2" />
                )}
                {option ? option : "Please Select"}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
