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
      />
      <label className="text-lg ml-2">{label}</label>
    </div>
  );
}
