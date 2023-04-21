import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import { Link, navigate } from "raviger";
import { getLocalForms, getLocalResponses } from "../utils/storageUtils";
import { formData, formField, textFieldTypes } from "../types/formTypes";
import LabelledDropDown from "./LabelledDropDown";
import EditableField from "./EditableField";
import OptionAdder from "./RadioOptionAdder";

const initialFormFields: formField[] = [
  { kind: "text", id: 1, label: "First Name", fieldType: "text", value: "" },
  { kind: "text", id: 2, label: "Last Name", fieldType: "text", value: "" },
  { kind: "text", id: 3, label: "Email", fieldType: "email", value: "" },
  {
    kind: "dropdown",
    id: 4,
    label: "Priority",
    options: ["High", "Low"],
    value: "",
  },
  {
    kind: "radio",
    id: 5,
    label: "Easy",
    options: ["Yes", "No"],
    value: "",
    fieldType: "radio",
  },
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
  const [type, setType] = useState<textFieldTypes>("text");
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
    if (type === "select") {
      setState({
        ...state,
        formFields: [
          ...state.formFields,
          {
            id: Number(new Date()),
            label: newField,
            value: "",
            kind: "dropdown",
            options: [],
          },
        ],
      });
    } else if (type === "radio") {
      setState({
        ...state,
        formFields: [
          ...state.formFields,
          {
            id: Number(new Date()),
            label: newField,
            fieldType: type,
            value: "",
            kind: "radio",
            options: [],
          },
        ],
      });
    } else {
      setState({
        ...state,
        formFields: [
          ...state.formFields,
          {
            id: Number(new Date()),
            label: newField,
            fieldType: type,
            value: "",
            kind: "text",
          },
        ],
      });
    }

    setNewField("");
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };

  //removes field
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeField = (id: number, label: string) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
    //removes the field from the saved responses
    const responses = getLocalResponses();
    responses.forEach((response) => {
      response.responses = response.responses.filter(
        (r) => r.question !== label
      );
    });
    localStorage.setItem("savedResponses", JSON.stringify(responses));
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
  //updates the label
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
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
                <EditableField
                  key={field.id}
                  field={field}
                  handleChangeCB={handleChange}
                  removeFieldCB={removeField}
                />
              );
            case "dropdown":
              return (
                <LabelledDropDown
                  key={field.id}
                  field={field}
                  state={state}
                  setState={setState}
                  label={field.label}
                  removeFieldCB={removeField}
                />
              );
            case "radio":
              return (
                <div className="flex items-center">
                  <EditableField
                    field={field}
                    handleChangeCB={handleChange}
                    removeFieldCB={removeField}
                  />
                  <div className=" max-h-36 overflow-y-auto  w-40 border-3 border-gray-200 ">
                    {field.options.map((option) => (
                      <p>{option}</p>
                    ))}
                  </div>
                  <OptionAdder
                    setState={setState}
                    state={state}
                    id={field.id}
                  />
                </div>
              );
            default:
              break;
          }
        })}
      </div>
      <div className="flex gap-2 my-3">
        <select
          name="typeSelecter"
          id=""
          className="px-2 focus:outline-none border-2 border-gray-200"
          onChange={(e) => {
            setType(e.target.value as textFieldTypes);
            console.log(type);
          }}
        >
          <option value="text">text</option>
          <option value="tel">tel</option>
          <option value="password">password</option>
          <option value="email">email</option>
          <option value="date">date</option>
          <option value="number">number</option>
          <option value="textarea">textarea</option>
          <option value="radio">radio</option>
          <option value="select">select</option>
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
