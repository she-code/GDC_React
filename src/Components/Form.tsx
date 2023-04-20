import React, { useState, useEffect, useRef } from "react";

import Button from "./Button";
import { Link, navigate } from "raviger";
import { getLocalForms } from "../utils/storageUtils";
import { formData, formField, textFieldTypes } from "../types/formTypes";
import LabelledInput from "./LabelledInput";
import RadioField from "./RadioField";

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
  const [option, setOption] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [type, setType] = useState<textFieldTypes>("text");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const titleRef = useRef<HTMLInputElement>(null);
  const indexRef = useRef(null);
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

  //adds dropdown option
  const addOption = (id: number) => {
    const previousState = [...state.formFields];
    const fieldToUpdate = previousState.filter((field) => field.id === id)[0];
    if (fieldToUpdate && "options" in fieldToUpdate) {
      fieldToUpdate.options = [...fieldToUpdate.options, option];
      setState({ ...state, formFields: previousState });
    }
  };
  //creates field
  const addField = () => {
    type === "select"
      ? // console.log("Select");
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
        })
      : setState({
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

    setNewField("");
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };
  // useEffect(() => {
  //   addField();
  // }, [addField, type]);

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
  const updateSelectedOption = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const previousState = [...state.formFields];
    const fieldToUpdate = previousState.filter((field) => field.id === id)[0];
    if (fieldToUpdate && "options" in fieldToUpdate) {
      // fieldToUpdate.options.map((option,index) => {
      //   // if (option === selectedOption) {
      //   //   option = e.target.value;
      //   //   setSelectedOption(e.target.value);
      //   // }

      // });
      fieldToUpdate.options.forEach((option, index) => {
        if (index === selectedIndex - 1) {
          fieldToUpdate.options[index] = e.target.value;
          setSelectedOption(e.target.value);
        }
      });
      fieldToUpdate.options = [...fieldToUpdate.options, option];
      setState({ ...state, formFields: previousState });
    }
    console.log("why", { fieldToUpdate }, selectedOption, e.target.value);
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
                <div>
                  {field.fieldType === "radio" ? (
                    <RadioField
                      type={field.fieldType}
                      label={field.label}
                      value={field.value}
                      id={field.id}
                      handleChangeCB={handleChange}
                    />
                  ) : (
                    <LabelledInput
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      type={field.fieldType}
                      value={field.value}
                      handleInputChangeCB={handleChange}
                      removeFieldCB={removeField}
                      disabled={true}
                    />
                  )}
                </div>
              );
            case "dropdown":
              return (
                // <select
                //   key={field.id}
                //   value={field.value}
                //   onChange={(e) => handleChange(e, field.id)}
                // >
                //   <option>Select an option</option>
                //   {field.options.map((option, index) => (
                //     <option key={index} value={option}>
                //       {option}
                //     </option>
                //   ))}
                // </select>
                <div className="flex justify-between" key={field.id}>
                  <div className="flex">
                    <p className="p-5">{field.label}</p>
                    {/* <SelectWithCheckboxes
                        options={field.options}
                        onCheckedCB={undefined}
                        fieldLabel={field.label}
                      /> */}
                    <div>
                      <input
                        //key={field.id}
                        type="text"
                        value={selectedOption}
                        onChange={(e) => updateSelectedOption(e, field.id)}
                      />
                      <select
                        key={field.id}
                        value={field.value}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                          setSelectedIndex(e.target.selectedIndex);
                        }}
                        // ref={indexRef}
                      >
                        <option>Select an option</option>
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="w-8/12 flex justify-between">
                    <input
                      className="border-2 border-gray-400 border-l-blue-500 rounded-lg p-2 m-2 w-9/12 focus:outline-none focus:border-l-yellow-500 focus:border-l-8"
                      type="text"
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                    />
                    <button
                      onClick={(_) => addOption(field.id)}
                      className="bg-blue-600 text-white py-2 px-3 text-lg uppercase rounded-xl m-3 w-2/6 mx-auto"
                    >
                      Add Option
                    </button>
                    <button className=" p-2  m-3 w-1/6 mx-auto text-red-500">
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
                </div>
              );
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
