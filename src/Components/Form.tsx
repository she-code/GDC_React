import React, { useState, useEffect, useRef, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link } from "raviger";
import { FormItem, textFieldTypes } from "../types/formTypes";

import CustomInputField from "./CustomInputField";

import { getForm, getFormFields, updateForm } from "../utils/apiUtils";
import { initialState } from "../types/formReducerTypes";
import { FormReducer } from "../reducers/formReducer";

const fetchForm = async (id: number) => {
  try {
    const data: FormItem = await getForm(id);
    // setFormsListCB(data.results);
    console.log({ data });
    if (!data) {
      throw Error("No data found");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const update_Form = async (id: number, form: FormItem) => {
  try {
    const updatedForm: FormItem = await updateForm(id, form);
    if (!updatedForm) {
      throw Error("No data found");
    }
    return updatedForm;
  } catch (error) {}
};

export default function Form(props: { id: number }) {
  const [state, dispatch] = useReducer(FormReducer, initialState);
  const [newField, setNewField] = useState("");
  const [type, setType] = useState<textFieldTypes>("text");
  // const [kind, setKind] = useState<FormFieldKind>("text");

  const titleRef = useRef<HTMLInputElement>(null);
  //programatically updates the form Id in the url
  // useEffect(() => {
  //   state?.id !== props.id && navigate(`/forms/${state?.id}`);
  // }, [state?.id, props.id]);

  useEffect(() => {
    console.log("useEffect");
    const getForm = async () => {
      const form = await fetchForm(props.id);
      dispatch({ type: "FETCH_FORM", form: form ? form : { title: "" } });
      if (form?.id) {
        const formFields = await getFormFields(form?.id);
        console.log({ formFields });
        dispatch({ type: "FETCH_FORM_FIELDS", formFields: formFields.results });
      }
      console.log({ form });
    };
    getForm();
  }, []);

  //updates the title
  useEffect(() => {
    const oldTitle = document.title;
    document.title = "Form Editor";
    titleRef.current?.focus();
    return () => {
      document.title = oldTitle;
    };
  }, []);

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

  return (
    <div
      className="p-4  flex-col gap-2 mx-auto  w-10/12  max-h-screen overflow-y-auto my-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full
    "
    >
      <div className=" w-11/12 mr-6">
        <div className="mb-3">
          <CustomInputField
            value={state?.form?.title ?? ""}
            handleInputChangeCB={(e) => {
              // dispatch({
              //   type: "update_title",
              //   title: e.target.value,
              // });
            }}
            type="text"
            elementRef={titleRef}
            key={state?.form?.id}
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
            setNewField(e.target.value);
          }}
        />
        <button
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-green-500"
          onClick={
            (_) => {
              // const form = createFormFields(state?.form?.id, newField, type);
            }
            // dispatch({
            //   type: "add_field",
            //   label: newField,
            //   fieldType: type,
            //   kind: "",
            //   callback: () => setNewField(""),
            // })
          }
        >
          Add Field
        </button>
      </div>
      <div>
        {state?.formFields?.map((formField) => {
          return <div>{formField.label}</div>;
        })}
      </div>
      {/* <CustomHeader title="Created Fields" margin={true} />
      <div className="my-7 w-11/12  ">
        {state.formFields.length > 0 ? (
          <>
            {state.formFields.map((field) => {
              switch (field.kind) {
                case "text":
                  return (
                    <div className="divide divide-x-2" key={field.id}>
                      <EditableField
                        field={field}
                        handleChangeCB={(e) => {
                          dispatch({
                            type: "update_label",
                            value: e.target.value,
                            id: field.id,
                          });
                        }}
                        removeFieldCB={(id) =>
                          dispatch({ type: "remove_field", id: id })
                        }
                      />
                      <Divider />
                    </div>
                  );
                case "dropdown":
                  return (
                    <CustomFieldWithOption
                      key={field.id}
                      field={field}
                      handleChangeCB={(e) => {
                        dispatch({
                          type: "update_label",
                          value: e.target.value,
                          id: field.id,
                        });
                      }}
                      id={field.id}
                      removeFieldCB={(id) =>
                        dispatch({ type: "remove_field", id: id })
                      }
                      addOptionCB={(option) =>
                        dispatch({
                          type: "add_option",
                          fieldId: field.id,
                          option: option,
                        })
                      }
                      removeOptionCB={(index) =>
                        dispatch({
                          type: "remove_option",
                          fieldId: field.id,
                          optionId: index,
                        })
                      }
                      updateOptionCB={(option, index) => {
                        dispatch({
                          type: "update_option",
                          fieldId: field.id,
                          option: option,
                          index: index,
                        });
                      }}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );

                default:
                  return (
                    <CustomFieldWithOption
                      key={field.id}
                      field={field}
                      handleChangeCB={(e) => {
                        dispatch({
                          type: "update_label",
                          value: e.target.value,
                          id: field.id,
                        });
                      }}
                      id={field.id}
                      removeFieldCB={(id) =>
                        dispatch({ type: "remove_field", id: id })
                      }
                      addOptionCB={(option) =>
                        dispatch({
                          type: "add_option",
                          fieldId: field.id,
                          option: option,
                        })
                      }
                      removeOptionCB={(index) =>
                        dispatch({
                          type: "remove_option",
                          fieldId: field.id,
                          optionId: index,
                        })
                      }
                      updateOptionCB={(option, index) => {
                        dispatch({
                          type: "update_option",
                          fieldId: field.id,
                          option: option,
                          index: index,
                        });
                      }}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );
              }
            })} */}
      <div>wait</div>
      {/* </>
        ) : (
          <div>No fields Created</div>
        )} */}
      {/* </div> */}

      <div className="flex gap-4 w-11/12 items-start justify-between">
        <button
          className="bg-gray-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500"
          onClick={(_) => {
            // saveFormData(state);
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
