import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import { Link, navigate } from "raviger";
import { getLocalForms } from "../utils/storageUtils";
import { formData, formField, textFieldTypes } from "../types/formTypes";
import LabelledInput from "./LabelledInput";

const initialFormFields: formField[] = [
  { kind: "text", id: 1, label: "First Name", fieldType: "text", value: "" },
  { kind: "text", id: 2, label: "Last Name", fieldType: "text", value: "" },
  { kind: "text", id: 3, label: "Email", fieldType: "email", value: "" },
  { kind: "text", id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  { kind: "text", id: 5, label: "Phone Number", fieldType: "tel", value: "" },
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
          fieldType: "text",
          value: newField,
          kind: "text",
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
        {state.formFields.map((field) => {
          switch (field.kind) {
            case "text":
              return (
                <LabelledInput
                  id={field.id}
                  label={field.label}
                  type={field.fieldType}
                  value={field.value}
                  handleInputChangeCB={handleChange}
                  removeFieldCB={removeField}
                  disabled={true}
                />
              );
            case "dropdown":
              return <div></div>;
            default:
              break;
          }
        })}
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
