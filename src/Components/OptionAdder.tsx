import React, { useState } from "react";
import { formData } from "../types/formTypes";

export default function OptionAdder(props: {
  emptyFieldAlertCB: () => void;
  addOptionCB: (option: string) => void;
}) {
  const { emptyFieldAlertCB, addOptionCB } = props;
  const [option, setOption] = useState("");

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
        onClick={(_) => {
          if (!option) {
            emptyFieldAlertCB();
            return;
          }
          addOptionCB(option);
          setOption("");
        }}
        className="bg-green-600 text-white px-3 text-lg capitalize rounded-xl m-3  mx-auto h-10"
      >
        Add
      </button>
    </div>
  );
}
