import { useState } from "react";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function MyInputAndDropdown() {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <button
        onClick={toggleDropdown}
        className="absolute inset-y-0 right-0 flex items-center px-2 border-l border-gray-300 bg-white rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 top-full left-0 w-full max-h-60 overflow-auto bg-white rounded-md shadow-lg border border-gray-300">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className={`block w-full px-4 py-2 text-left ${
                option.value === selectedOption.value
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
