import React from "react";

export default function RadioField(props: {
  type: string;
  label: string;
  value: string;
  id: number;
  checked: boolean;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { type, label, value, handleChangeCB, checked } = props;
  return (
    <div className="">
      <input
        type={type}
        value={value}
        onChange={(e) => handleChangeCB(e)}
        checked={checked}
        aria-label={label}
        tabIndex={0}
        className="mr-2 focus-within:outline-none focus-within:border-l-green-500 focus-within:border-l-8"
      />
      <label className="text-lg ml-2">{label}</label>
    </div>
  );
}
