import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, navigate } from "raviger";
import { getLocalForms, getLocalResponses } from "../utils";
import { formData, formField } from "../utils/types/types";
import CustomInputField from "./CustomInputField";
import Divider from "./Divider";
import CustomHeader from "./CustomHeader";

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
export default function Form(props: { id: number }) {
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
    if (newField) {
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
    }
    //when you want to update use clousers
    //state=>
    //clousers give the value at the time of trigger
  };

  //removes field
  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
    //removes the field from the saved responses
    const responses = getLocalResponses();
    responses.forEach((response) => {
      response.responses = response.responses.filter(
        (r) => r.questionId !== id
      );
    });
    localStorage.setItem("savedResponses", JSON.stringify(responses));
  };

  // creates toast
  const notify = () =>
    toast.info("Form is up to date", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //informs user empty fields are not allowd
  const emptyFieldAlert = () =>
    toast.info("Field can't be empty", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
    const responses = getLocalResponses();
    responses.forEach((response) => {
      response.responses.forEach((res) => {
        if (res.questionId === valueToUpdate?.id) {
          res.question = valueToUpdate.label;
          localStorage.setItem("savedResponses", JSON.stringify(responses));
        }
      });
    });
  };

  const updateFormTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, title: e.target.value });
    const responses = getLocalResponses();
    responses.forEach((response) => {
      if (response.formId === state.id) {
        response.formTitle = state.title;
        localStorage.setItem("savedResponses", JSON.stringify(responses));
      }
    });
  };
  return (
    <div className="p-4  flex-col gap-2 mx-auto  w-10/12">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className=" w-11/12 mr-6">
        <div className="mb-3">
          <CustomInputField
            value={state.title}
            handleInputChangeCB={updateFormTitle}
            type="text"
            elementRef={titleRef}
            key={state.id}
          />
        </div>
      </div>
      <div className="flex items-center my-5">
        <CustomHeader title="Select Field Type" />
      </div>

      <div className="flex gap-2 w-11/12 items-center">
        <div className="flex rounded-lg shadow-lg h-14 items-center p-3">
          <span className="font-semibold mr-1">Type:</span>
          <select
            name="typeSelecter"
            id=""
            className="px-2 focus:outline-none font-light "
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
        </div>

        <input
          type="text"
          value={newField}
          className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2  w-2/3 focus:outline-none focus:border-l-green-500 focus:border-l-8"
          onChange={(e) => {
            setNewField(e.target.value);
          }}
        />
        <button
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-green-500"
          onClick={(_) => {
            addField();
            if (newField === "") {
              emptyFieldAlert();
            }
          }}
        >
          Add Field
        </button>
      </div>
      <CustomHeader title="Created Fields" margin={true} />
      <div className="my-7 w-3/4  max-h-72 overflow-y-auto ">
        {state.formFields.length ? (
          <>
            {state.formFields.map((field) => (
              <div className="flex flex-col " key={field.id}>
                <div className="flex justify-between">
                  <div className="flex justify-start divide-x divide-solid-100">
                    <div className="py-3 mt-2 capitalize font-semibold border-l-5 w-20">
                      {field.fieldType}
                    </div>
                    <input
                      className="border-0 border-l-blue-500 text-lg rounded-lg p-3 m-2 w-max focus:outline-none focus:border-l-green-500 focus:border-l-8"
                      type="text"
                      value={field.label}
                      onChange={(e) => handleChange(e, field.id)}
                    />
                  </div>

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
                <Divider />
              </div>
            ))}
          </>
        ) : (
          <div>No Field Created</div>
        )}
      </div>

      <div className="flex gap-4 w-11/12 items-start justify-between">
        <button
          className="bg-gray-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500"
          onClick={(_) => {
            saveFormData(state);
            notify();
          }}
        >
          Save
        </button>
        <Link
          href="/"
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 text-center hover:bg-green-500"
        >
          Close Form
        </Link>

        {/* <Button name={"Clear Form"} handleEvent={clearForm} /> */}
      </div>
    </div>
  );
}
