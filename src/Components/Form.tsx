import React, { useState, useEffect } from "react";

import Button from "./Button";
import LabelledInput from "./LabelledInput";

interface formField {
  id: number;
  label: string;
  fieldType: string;
  value: string;
}
const initialFormFields: formField[] = [
  { id: 1, label: "First Name", fieldType: "text", value: "" },
  { id: 2, label: "Last Name", fieldType: "text", value: "" },
  { id: 3, label: "Email", fieldType: "email", value: "" },
  { id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  { id: 5, label: "Phone Number", fieldType: "tel", value: "" },
];
const initialState: () => formField[] = () => {
  const formFiedlsJson = localStorage.getItem("formFields");
  const persistantFormFields = formFiedlsJson
    ? JSON.parse(formFiedlsJson)
    : initialFormFields;
  return persistantFormFields;
};
const saveFormData = (currentState: formField[]) => {
  localStorage.setItem("formFields", JSON.stringify(currentState));
};
export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(initialState());
  const [newField, setNewField] = useState("");

  useEffect(() => {
    console.log("Component mounted");
    const oldTitle = document.title;
    document.title = "Form Editor";
    return () => {
      document.title = oldTitle;
    };
  }, []);
  //save to localstorage with out button click
  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
      console.log("saved");

    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  const addField = () => {
    //queues triger
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
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };
  const removeField = (id: number) => {
    setState(state.filter((field) => field.id !== id));
  };
  const clearForm = () => {
    const updatedFields = state.map((state) => ({ ...state, value: "" }));
    setState(updatedFields);
  };
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
            value={field.value}
            removeFieldCB={removeField}
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
        <button
          className="bg-blue-600 text-white py-2 px-3 text-lg uppercase rounded-xl m-3 w-1/6 mx-auto"
          onClick={(_) => saveFormData(state)}
        >
          Save
        </button>
        <Button name={"Close Form"} handleEvent={props.closeFormCB} />
        <Button name={"Clear Form"} handleEvent={clearForm} />
      </div>
    </div>
  );
}
