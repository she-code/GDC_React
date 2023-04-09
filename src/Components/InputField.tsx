import React from "react";
interface propsType {
  id: number;
  label: string;
  type: string;
}
export default function InputField(props: propsType) {
  const { id, label, type } = props;
  return (
    <React.Fragment key={id}>
      <label className="font-semibold text-xl">{label}</label>
      <input
        className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
        type={type}
      />
    </React.Fragment>
  );
}
