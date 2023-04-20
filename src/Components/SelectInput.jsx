import React, { useEffect, useState } from "react";

const SelectWithCheckboxes = ({ options, onCheckedCB, fieldLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

//   const handleOptionClick = (option) => {
//     const isSelected = selectedOptions.includes(option);
//     setSelectedOptions(
//       isSelected
//         ? selectedOptions.filter((selected) => selected !== option)
//         : [...selectedOptions, option]
//     );
//     onCheckedCB(selectedOptions)
//   };
const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
    onCheckedCB(selectedOptions);
  };
  useEffect(() => {
    onCheckedCB(selectedOptions)
    console.log("from selected",selectedOptions)
  }, [selectedOptions])
  
  return (
    <div className="select-with-checkboxes ">

      <button className="dropdown-toggle py-2 px-3 mt-5 border-2 border-gray-300 " onClick={() => setIsOpen(!isOpen)}>
        {selectedOptions.length === 0 ? (
          "Select options"
        ) : (
          selectedOptions.join(", ")
        )}
      </button>
      {isOpen && (
        <ul className=" shadow-lg bg-gray-300 w-full">
          {options.map((option) => (
            <li key={option}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectWithCheckboxes;
