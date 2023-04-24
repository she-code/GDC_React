import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, navigate } from "raviger";
import { getLocalForms, getLocalResponses } from "../utils/storageUtils";
import {
  DropdownField,
  RadioType,
  formData,
  formField,
  textFieldTypes,
} from "../types/formTypes";
import EditableField from "./EditableField";

import CustomInputField from "./CustomInputField";
import CustomHeader from "./CustomHeader";
import CustomFieldWithOption from "./CustomFieldWithOption";
import Divider from "./Divider";

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
  {
    kind: "radio",
    id: 6,
    label: "Choose color",
    options: ["red", "#ffff00", "rgb(45,67,247)"],
    value: "",
    fieldType: "color",
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
export default function Form(props: { id: number }) {
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
    if (newField) {
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
      } else if (type === "radio" || type === "color") {
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
                value: "",
                kind: "radio",
                options: [],
              },
            ],
          });
        }
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
      //setNewField("");
    } else {
      emptyFieldAlert();
    }

    setNewField("");

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
    toast.info("The form is up-to-date", {
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
    toast.info("Field name can't be empty", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

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
  const updateOptions = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    index: number
  ) => {
    const existingData = [...state.formFields];

    let valueToUpdate = existingData.find((field) => field.id === id);
    (valueToUpdate as DropdownField | RadioType).options.forEach(
      (option: string, i: number) => {
        if (index === i) {
          (valueToUpdate as DropdownField | RadioType).options[i] =
            e.target.value;
          console.log({ option }, e.target.value);
          // responses.forEach((response) => {
          //   response.responses.forEach((res) => {
          //     if (
          //       res.question ===
          //       (valueToUpdate as DropdownField | RadioType).options[i]
          //     ) {
          //       res.question = e.target.value;
          //       localStorage.setItem(
          //         "savedResponses",
          //         JSON.stringify(responses)
          //       );
          //     }
          //   });
          // });
        }
        // option = e.target.value;
      }
    );
    // valueToUpdate!.label = e.target.value;
    // console.log(valueToUpdate);
    setState({
      ...state,
      formFields: existingData,
    });

    console.log(existingData);
  };

  return (
    <div className="p-4  flex-col gap-2 mx-auto  w-10/12  max-h-screen overflow-y-auto my-5  scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
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

      <div className="flex gap-2 w-11/12 items-center">
        <div className="flex rounded-lg shadow-lg h-14 items-center p-3">
          <span className="font-semibold mr-1">Type:</span>
          <select
            name="typeSelecter"
            id=""
            className="px-2 focus:outline-none font-light "
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
            <option value="select">multi-select</option>
            <option value="color">color-picker</option>
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
          onClick={addField}
        >
          Add Field
        </button>
      </div>

      <CustomHeader title="Created Fields" margin={true} />
      <div className="my-7 w-11/12  ">
        {state.formFields.length > 0 ? (
          <>
            {state.formFields.map((field) => {
              switch (field.kind) {
                case "text":
                  return (
                    <div className="divide divide-x-2" key={field.id}>
                      <EditableField
                        key={field.id}
                        field={field}
                        handleChangeCB={handleChange}
                        removeFieldCB={removeField}
                      />
                      <Divider />
                    </div>
                  );
                case "dropdown":
                  return (
                    <CustomFieldWithOption
                      field={field}
                      handleChangeCB={handleChange}
                      id={field.id}
                      removeFieldCB={removeField}
                      setState={setState}
                      state={state}
                      updateOptionCB={updateOptions}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );
                case "radio":
                  return (
                    <CustomFieldWithOption
                      field={field}
                      handleChangeCB={handleChange}
                      id={field.id}
                      removeFieldCB={removeField}
                      setState={setState}
                      state={state}
                      updateOptionCB={updateOptions}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );
                default:
                  return <div>no fields</div>;
              }
            })}
          </>
        ) : (
          <div>No fields Created</div>
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
