import React from "react";
interface propsType {
  id: number;
  label: string;
  type: string;
  value: string;
  removeFieldCB: (id: number) => void;
  handleInputChangeCB: (e: any, id: number) => void;
}
export default function LabelledInput(props: propsType) {
  const { id, label, type, removeFieldCB, value, handleInputChangeCB } = props;
  return (
    <React.Fragment key={id}>
      <label className="font-semibold text-xl">{label}</label>
      <div className="flex gap-2">
        <input
          className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
          type={type}
          value={value}
          onChange={(e) => handleInputChangeCB(e, id)}
        />
        <button
          className="bg-blue-600 text-white p-2 text-lg uppercase rounded-xl m-3 w-1/6 mx-auto"
          onClick={(_) => removeFieldCB(id)}
        >
          Remove
        </button>{" "}
      </div>
    </React.Fragment>
  );
}
