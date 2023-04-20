import React from "react";

export default function LabelledDropDown() {
  return <div>LabelledDropDown</div>;
}
// import React, { useState } from "react";

// const SelectWithCheckboxes = ({ options, onChange, fieldLabel }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const handleOptionClick = (option) => {
//     const isSelected = selectedOptions.includes(option);
//     setSelectedOptions(
//       isSelected
//         ? selectedOptions.filter((selected) => selected !== option)
//         : [...selectedOptions, option]
//     );
//   };

//   return (
//     <div className="select-with-checkboxes ">

//       <button className="dropdown-toggle py-2 px-3 mt-5 border-2 border-gray-300 " onClick={() => setIsOpen(!isOpen)}>
//         {selectedOptions.length === 0 ? (
//           "Select options"
//         ) : (
//           selectedOptions.join(", ")
//         )}
//       </button>
//       {isOpen && (
//         <ul className=" shadow-lg bg-gray-300 w-full">
//           {options.map((option) => (
//             <li key={option}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={selectedOptions.includes(option)}
//                   onChange={() => handleOptionClick(option)}
//                 />
//                 {option}
//               </label>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SelectWithCheckboxes;
