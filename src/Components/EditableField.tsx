import React from "react";
import { TextField, formField } from "../types/formTypes";

export default function EditableField(props: {
  field: formField;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  removeFieldCB: (id: number, label: string) => void;
}) {
  const { handleChangeCB, removeFieldCB, field } = props;
  return (
    <div className="flex  items-center  justify-between" key={field.id}>
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-green-600"></div>
        {field.kind === "dropdown" ? (
          <p className="capitalize  text-base text-gray-500">
            <span className="mx-1 font-semibold text-base  text-black">(</span>
            Multi-Select
            <span className=" font-semibold text-xl mx-1  text-black">)</span>
          </p>
        ) : (
          <p className="capitalize  text-base text-gray-500">
            <span className="mx-1 font-semibold text-base  text-black">(</span>
            {(field as TextField).fieldType}
            <span className=" font-semibold text-xl mx-1  text-black">)</span>
          </p>
        )}
        <input
          className="border-0 border-l-blue-500 rounded-lg py-3  font-semibold text-lg
      my-2  w-min focus:outline-none focus:border-l-green-500 focus:border-l-8 h-10 capitalize"
          type="text"
          value={field.label}
          onChange={(e) => handleChangeCB(e, field.id)}
        />
      </div>

      <button
        className=" py-2 px-3 text-red-500"
        onClick={(_) => removeFieldCB(field.id, field.label)}
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
  );
}
