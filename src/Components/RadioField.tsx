import React from "react";

export default function RadioField(props: {
  type: string;
  label: string;
  value: string;
  id: number;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}) {
  const { type, label, value, handleChangeCB, id } = props;
  return (
    <div className="">
      <input
        type={type}
        value={value}
        onChange={(e) => handleChangeCB(e, id)}
      />
      <label className="font-semibold text-xl ml-2">{label}</label>
    </div>
  );
}
