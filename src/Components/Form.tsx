import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import LabelledInput from "./LabelledInput";
import FormsList from "./FormsList";

interface formData {
  id: number;
  title: string;
  formFields: formField[];
}
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
const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};
const initialState: (id: number) => formData = (id) => {
  const localForms = getLocalForms();
  const selectedForm = localForms!.find((form) => form.id === id);
  if (selectedForm) {
    return selectedForm;
  } else {
    const newForm = {
      id: Number(new Date()),
      title: "Untitled",
      formFields: initialFormFields,
    };
    return newForm;
  }
};

const saveLocalForms = (localForms: formData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
};

const saveFormData = (currentState: formData) => {
  const localForms = getLocalForms();
  const index = localForms.findIndex((form) => form.id === currentState.id);
  if (index !== -1) {
    // update the existing form
    localForms[index] = currentState;
    saveLocalForms(localForms);
  } else {
    // add a new form
    const updatedLocalForms = [...localForms, currentState];
    saveLocalForms(updatedLocalForms);
  }
};
export default function Form(props: { closeFormCB: () => void; id: any }) {
  const [state, setState] = useState(() => initialState(props.id!));
  const [newField, setNewField] = useState("");
  const [displayForms, setDisplayForms] = useState("form");
  const titleRef = useRef<HTMLInputElement>(null);

  //updates the title
  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Form Editor";
    titleRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

  //saves to localstorage with out button click
  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  //creates field
  const addField = () => {
    //queues triger
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        {
          id: Number(new Date()),
          label: newField,
          fieldType: "text",
          value: newField,
        },
      ],
    });
    setNewField("");
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };
  const closeFormsList = () => setDisplayForms("forms");

  //removes field
  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
  };

  // clears the form input values
  const clearForm = () => {
    const updatedFields = state.formFields.map((state) => ({
      ...state,
      value: "",
    }));
    setState({
      ...state,
      formFields: updatedFields,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const existingData = [...state.formFields];
    let valueToUpdate = existingData.find((field) => field.id === id);
    valueToUpdate!.value = e.target.value;
    setState({
      ...state,
      formFields: existingData,
    });
  };

  return (
    <div className="p-4 divide-y-2 divide-dotted flex-col gap-2">
      {displayForms === "form" ? (
        <>
          {" "}
          <div>
            <input
              type="text"
              className="border-2 border-gray-500 rounded-lg p-2 my-2 flex-1  w-full"
              value={state.title}
              onChange={(e) => setState({ ...state, title: e.target.value })}
              ref={titleRef}
            />
            {state.formFields.map((field) => (
              <LabelledInput
                key={field.id}
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
        </>
      ) : (
        <FormsList closeFormsListCB={closeFormsList} />
      )}
    </div>
  );
}
