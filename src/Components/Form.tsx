import React, { useState } from "react";

import Button from "./Button";
import LabelledInput from "./LabelledInput";

const formFields = [
  { id: 1, label: "First Name", fieldType: "text", value: "" },
  { id: 2, label: "Last Name", fieldType: "text", value: "" },
  { id: 3, label: "Email", fieldType: "email", value: "" },
  { id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  { id: 5, label: "Phone Number", fieldType: "tel", value: "" },
];
export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(formFields);
  const [newField, setNewField] = useState("");

  //creates  a new field
  const addField = () => {
    setState([
      ...state,
      {
        id: Number(new Date()),
        label: newField,
        fieldType: "text",
        value: newField,
      },
    ]);
    setNewField("");
  };

  //removes a field with the given id
  const removeField = (id: number) => {
    setState(state.filter((field) => field.id !== id));
  };

  //clears the form
  const clearForm = () => {
    const updatedFields = state.map((state) => ({ ...state, value: "" }));
    setState(updatedFields);
  };

  //makes the form fields editable
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const existingData = [...state];
    let valueToUpdate = existingData.find((field) => field.id === id);
    valueToUpdate!.value = e.target.value;
    setState(existingData);
  };
  return (
    <div className="p-4 divide-y-2 divide-dotted flex-col gap-2">
      <div>
        {state.map((field) => (
          <LabelledInput
            id={field.id}
            label={field.label}
            type={field.fieldType}
            removeFieldCB={removeField}
            value={field.value}
            handleInputChangeCB={handleChange}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newField}
          className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
          onChange={(e) => {
            setNewField(e.target.value);
          }}
        />
        <Button name={"Add field"} handleEvent={addField} />
      </div>
      <div className="flex gap-4">
        <Button name={"Submit"} handleEvent={() => {}} />

        <Button name={"Close Form"} handleEvent={props.closeFormCB} />
        <Button name={"Clear Form"} handleEvent={clearForm} />
      </div>
    </div>
  );
}
