import React, { useState, useEffect, useRef, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, navigate } from "raviger";
import { getLocalForms, getLocalResponses } from "../utils/storageUtils";
import {
  DropdownField,
  FormFieldKind,
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

//creates field
// const addField = () => {
//   if (newField) {
//     if (type === "select") {
//       setState({
//         ...state,
//         formFields: [
//           ...state.formFields,
//           {
//             id: Number(new Date()),
//             label: newField,
//             value: "",
//             kind: "dropdown",
//             options: [],
//           },
//         ],
//       });
//     } else if (type === "radio" || type === "color") {
//       //queues triger
//       if (newField) {
//         setState({
//           ...state,
//           formFields: [
//             ...state.formFields,
//             {
//               id: Number(new Date()),
//               label: newField,
//               fieldType: type,
//               value: "",
//               kind: "radio",
//               options: [],
//             },
//           ],
//         });
//       }
//     } else {
//       setState({
//         ...state,
//         formFields: [
//           ...state.formFields,
//           {
//             id: Number(new Date()),
//             label: newField,
//             fieldType: type,
//             value: "",
//             kind: "text",
//           },
//         ],
//       });
//     }
//     //setNewField("");
//   } else {
//     emptyFieldAlert();
//   }

//   setNewField("");

//   //when you want to update use clousers
//   //state=>
//   //clousers give the value at the time of trigger
// };

// //removes field
// const removeField = (id: number) => {
//   setState({
//     ...state,
//     formFields: state.formFields.filter((field) => field.id !== id),
//   });
//   //removes the field from the saved responses
//   const responses = getLocalResponses();
//   responses.forEach((response) => {
//     response.responses = response.responses.filter(
//       (r) => r.questionId !== id
//     );
//   });
//   localStorage.setItem("savedResponses", JSON.stringify(responses));
// };
type RemoveAction = {
  type: "remove_field";
  id: number;
};

const getNewField = (kind: string, label: string) => {
  const id = Number(new Date()); // generate a random alphanumeric id
  return {
    id,
    kind,
    label,
  };
};

type AddAction = {
  type: "add_field";
  label: string;
  kind: FormFieldKind;
  callback: () => void;
};
type FormActions = RemoveAction | AddAction;
//Action reducer
const reducer = (state: formData, action: FormActions) => {
  switch (action.type) {
    case "add_field": {
      const newField = getNewField(action.kind, action.label);
      if (newField.label.length > 0) {
        action.callback();
        return {
          ...state,
          formFields: [...state.formFields, newField],
        };
      }
      return state;
    }
    case "remove_field": {
      return {
        ...state,
        formFields: state.formFields.filter((field) => field.id !== action.id),
      };
    }
  }
};
// case "update_option": {
//   return {
//     ...state,
//     formFields: state.formFields?.map((field) => {
//       if (field.id === action.fieldId && field.kind !== "text") {
//         return {
//           ...field,
//           options: (field as DropdownField | RadioType).options?.map(
//             (option: string, index: number) => {
//               if (index === action.index) {
//                 return action.option;
//               }
//               return option;
//             }
//           ),
//         };
//       }
//       return field;
//     }),
//   };
// }
// }
type ChangeText = {
  type: "change_text";
  value: string;
};
type ClearText = {
  type: "clear_text";
};
type NewFieldActions = ChangeText | ClearText;
const newFieldReducer = (state: string, action: NewFieldActions) => {
  switch (action.type) {
    case "change_text": {
      return action.value;
    }
    case "clear_text": {
      return "";
    }
  }
};
export default function FormWithReducer(props: { id: number }) {
  const [state, setState] = useState(() => initialState(props.id!));
  const [newField, dispatchNewFieldAction] = useReducer(newFieldReducer, "");
  const [type, setType] = useState<textFieldTypes>("text");
  const [kind, setKind] = useState<FormFieldKind>("text");

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

  const dispatchAction = (action: FormActions) => {
    //  setState((prevState) => reducer(prevState, action));
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
    const existingData = [...state.formFields];
    let valueToUpdate = existingData.find((field) => field.id === id);
    valueToUpdate!.label = e.target.value;
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

  const handleKindChange = (type: textFieldTypes) => {
    if (type === "radio" || type === "color") {
      setKind("radio");
    } else if (type === "select") {
      setKind("dropdown");
    } else setKind("text");
  };
  useEffect(() => {
    handleKindChange(type);
  }, [type]);

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
  const responses = getLocalResponses();
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
          responses.forEach((response) => {
            response.responses.forEach((res) => {
              if (
                res.response ===
                (valueToUpdate as DropdownField | RadioType).options[i]
              ) {
                res.response = option;
              }
            });
          });
        }
        // option = e.target.value;
      }
    );
    localStorage.setItem("savedResponses", JSON.stringify(responses));
    setState({
      ...state,
      formFields: existingData,
    });
  };

  return (
    <div
      className="p-4  flex-col gap-2 mx-auto  w-10/12  max-h-screen overflow-y-auto my-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full
    "
    >
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
            dispatchNewFieldAction({
              type: "change_text",
              value: e.target.value,
            });
          }}
        />
        <button
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-green-500"
          onClick={(_) =>
            dispatchAction({
              type: "add_field",
              kind: kind,
              label: newField,
              callback: () => dispatchNewFieldAction({ type: "clear_text" }),
            })
          }
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
                        removeFieldCB={(id) =>
                          dispatchAction({ type: "remove_field", id: id })
                        }
                      />
                      <Divider />
                    </div>
                  );
                case "dropdown":
                  return (
                    // <CustomFieldWithOption
                    //   key={field.id}
                    //   field={field}
                    //   handleChangeCB={handleChange}
                    //   id={field.id}
                    //   removeFieldCB={(id) =>
                    //     dispatchAction({ type: "remove_field", id: id })
                    //   }
                    //   //   setState={setState}
                    //   state={state}
                    //   //   updateOptionCB={updateOptions}
                    //   emptyFieldAlertCB={emptyFieldAlert}
                    // />
                    <div>hi</div>
                  );
                case "radio":
                  return (
                    //     <CustomFieldWithOption
                    //       key={field.id}
                    //       field={field}
                    //       handleChangeCB={handleChange}
                    //       id={field.id}
                    //       removeFieldCB={(id) =>
                    //         dispatchAction({ type: "remove_field", id: id })
                    //       }
                    //       //   setState={setState}
                    //       state={state}
                    //       //   updateOptionCB={updateOptions}
                    //       emptyFieldAlertCB={emptyFieldAlert}
                    //     />
                    <div>ui</div>
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
