import React from "react";
interface propsType {
  id: number;
  label: string;
  type: string;
  value: string;
  removeFieldCB: (id: number) => void;
  handleInputChangeCB: (e: any, id: number) => void;
  disabled: boolean;
}
export default function LabelledInput(props: propsType) {
  const {
    id,
    label,
    type,
    disabled,
    removeFieldCB,
    value,
    handleInputChangeCB,
  } = props;
  return (
    <div key={id}>
      <label className="font-semibold text-xl">{label}</label>
      <div className="flex gap-2">
        <input
          className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
          type={type}
          value={value}
          onChange={(e) => handleInputChangeCB(e, id)}
          // disabled={disabled}
        />
        <button
          className=" p-2  m-3 w-1/6 mx-auto text-red-500"
          onClick={(_) => removeFieldCB(id)}
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
