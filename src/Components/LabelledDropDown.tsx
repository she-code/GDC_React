import React, { useState } from "react";

export default function LabelledDropDown(props: {
  field: any;
  state: any;
  setState: (state: any) => void;
  label: string;
  removeFieldCB: (id: number, label: string) => void;
}) {
  const { field, state, setState, removeFieldCB, label } = props;
  const [option, setOption] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  //adds dropdown option
  const addOption = (id: number) => {
    const previousState = [...state.formFields];
    const fieldToUpdate = previousState.filter((field) => field.id === id)[0];
    if (fieldToUpdate && "options" in fieldToUpdate) {
      if (option !== "") {
        fieldToUpdate.options = [...fieldToUpdate.options, option];
        setState({ ...state, formFields: previousState });
      }
    }
    setOption("");
  };

  const updateSelectedOption = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const previousState = [...state.formFields];
    const fieldToUpdate = previousState.filter((field) => field.id === id)[0];
    if (fieldToUpdate && "options" in fieldToUpdate) {
      fieldToUpdate.options.forEach((option: any, index: any) => {
        if (index === selectedIndex - 1) {
          fieldToUpdate.options[index] = e.target.value;
          setSelectedOption(e.target.value);
        }
      });
      setState({ ...state, formFields: previousState });
    }
    console.log("why", { fieldToUpdate }, { selectedOption }, e.target.value);
  };
  return (
    <div className="flex " key={field.id}>
      <div className="flex">
        <p className="py-5 mr-2 font-semibold text-xl">{field.label}</p>
        <div className="flex mr-5">
          <input
            type="text"
            placeholder="Selected option"
            className="border-2 border-gray-400 border-l-blue-500 
            h-10 p-2
            rounded-lg m-2 focus:outline-none focus:border-l-yellow-500 focus:border-l-8"
            value={selectedOption}
            onChange={(e) => updateSelectedOption(e, field.id)}
          />
          <select
            className="focus:outline-none"
            key={field.id}
            value={field.value}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setSelectedIndex(e.target.selectedIndex);
            }}
          >
            <option>Select an option to edit</option>
            {field.options.map((option: any, index: any) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className=" flex w-3/4 ml-5 pl-5">
        <input
          className="border-2 border-gray-400 border-l-blue-500 rounded-lg p-2 m-2  h-10
           focus:outline-none focus:border-l-yellow-500 focus:border-l-8 w-full"
          placeholder="Add Option"
          type="text"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        />
        <button
          onClick={(_) => addOption(field.id)}
          className="bg-blue-600 text-white px-3 text-lg uppercase rounded-xl m-3 w-14 mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <button
          className=" p-2  m-3 w-1/6 mx-auto text-red-500"
          onClick={(_) => removeFieldCB(field.id, label)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
