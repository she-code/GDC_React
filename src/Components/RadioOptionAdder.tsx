import React, { useState } from "react";
import { formData } from "../types/formTypes";

export default function OptionAdder(props: {
  state: formData;
  setState: (state: formData) => void;
  id: number;
}) {
  const { state, setState, id } = props;
  const [option, setOption] = useState("");

  //adds option to radio  and dropdown
  const addRadioOption = (id: number) => {
    const previousState = [...state.formFields];
    const fieldToUpdate = previousState.filter((field) => field.id === id)[0];
    if (fieldToUpdate && "options" in fieldToUpdate) {
      if (option !== "") {
        fieldToUpdate.options = [...fieldToUpdate.options, option];
        setState({ ...state, formFields: previousState });
        console.log("updated state", { state }, fieldToUpdate.options, {
          option,
        });
      }
    }
    setOption("");
  };
  return (
    <div className=" flex w-4/5 ml-5 pl-5 items-center">
      <input
        className="border-2 border-gray-400 border-l-blue-500 rounded-lg p-2 m-2  h-10
        focus:outline-none focus:border-l-yellow-500 focus:border-l-8 w-2/3 align-middle"
        placeholder="Add Option"
        type="text"
        value={option}
        onChange={(e) => setOption(e.target.value)}
      />

      <button
        onClick={(_) => addRadioOption(id)}
        className="bg-green-600 text-white px-3 text-lg capitalize rounded-xl m-3  mx-auto h-10"
      >
        Add
      </button>
    </div>
  );
}
