import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import { Link, navigate } from "raviger";
import { getLocalForms } from "../utils/storageUtils";
import { formData, formField } from "../types/formTypes";

const initialFormFields: formField[] = [
  { id: 1, label: "First Name", fieldType: "text", value: "" },
  { id: 2, label: "Last Name", fieldType: "text", value: "" },
  { id: 3, label: "Email", fieldType: "email", value: "" },
  { id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  { id: 5, label: "Phone Number", fieldType: "tel", value: "" },
];

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
export default function Form(props: { id: any }) {
  const [state, setState] = useState(() => initialState(props.id!));
  const [newField, setNewField] = useState("");
  const [type, setType] = useState("text");
  const titleRef = useRef<HTMLInputElement>(null);

  //programatically updates the form Id in the url
  useEffect(() => {
    state.id !== props.id && navigate(`/forms/${state.id}`);
  }, [state.id, props.id]);

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
          fieldType: type,
          value: newField,
        },
      ],
    });
    setNewField("");
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };

  //removes field
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    console.log("called");
    const existingData = [...state.formFields];
    let valueToUpdate = existingData.find((field) => field.id === id);
    valueToUpdate!.label = e.target.value;
    console.log(valueToUpdate);
    setState({
      ...state,
      formFields: existingData,
    });
  };

  return (
    <div className="p-4 divide-y-2 divide-dotted flex-col gap-2 ">
      <div>
        <input
          type="text"
          className="border-2 border-gray-500 rounded-lg p-2 my-2 flex-1  w-full"
          value={state.title}
          onChange={(e) => setState({ ...state, title: e.target.value })}
          ref={titleRef}
        />
        {state.formFields.map((field) => (
          <div className="flex justify-between" key={field.id}>
            <input
              className="border-0 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
              type="text"
              value={field.label}
              onChange={(e) => handleChange(e, field.id)}
            />
            <button
              className=" py-2 px-3 text-red-500"
              onClick={(_) => removeField(field.id)}
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
        ))}
      </div>
      <div className="flex gap-2">
        <select
          name="typeSelecter"
          id=""
          className="px-2 focus:outline-none border-2 border-gray-200"
          onChange={(e) => {
            setType(e.target.value);
            console.log(type);
          }}
        >
          <option value="text">text</option>
          <option value="tel">tel</option>
          <option value="password">password</option>
          <option value="email">email</option>
          <option value="date">date</option>
          <option value="number">number</option>
        </select>
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
        <Link
          href="/"
          className="bg-yellow-600 text-white py-2 px-3 text-lg uppercase rounded-xl m-3 w-1/6 text-center"
        >
          Close Form
        </Link>

        <Button name={"Clear Form"} handleEvent={clearForm} />
      </div>
    </div>
  );
}
