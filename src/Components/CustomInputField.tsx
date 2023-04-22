import React from "react";

export default function CustomInputField(props: {
  value: string;
  type: string;
  handleInputChangeCB: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.RefObject<HTMLInputElement>;
}) {
  const { value, handleInputChangeCB, type, ref } = props;
  return (
    <input
      className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
      type={type}
      value={value}
      onChange={(e) => handleInputChangeCB(e)}
      ref={ref}
    />
  );
}
