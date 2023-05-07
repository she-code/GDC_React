import React, { useState, useEffect, useRef, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, navigate } from "raviger";
import { FormFieldKind, FormItem } from "../types/formTypes";

import CustomInputField from "./CustomInputField";

import { FormFieldType, initialState } from "../types/formReducerTypes";
import { FormReducer } from "../reducers/formReducer";
import {
  createFormFields,
  deleteFormField,
  getForm,
  getFormFields,
} from "../utils/apiUtils";
import { Pagination } from "../types/common";
import Modal from "./common/Modal";
import UpdateForm from "./UpdateForm";
import CustomFieldWithOption from "./CustomFieldWithOption";
import Divider from "./Divider";
import EditableField from "./EditableField";
import CustomHeader from "./CustomHeader";

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

// create FormFields

export default function Form(props: { id: number }) {
  const [state, dispatch] = useReducer(FormReducer, initialState);
  const [newForm, setNewForm] = useState(false);
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
        const formFields: Pagination<FormFieldType> = await getFormFields(
          { offset: 0, limit: 10 },
          form?.id
        );

        console.log({ formFields });
        dispatch({ type: "FETCH_FORM_FIELDS", formFields: formFields.results });
      }
      console.log({ formFields: state.formFields });
    };
    getForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleFieldCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (state.form.id === undefined) throw Error("Form Id is undefined");
      console.log({ field: state?.formField }, state.form.id);
      const newField = await createFormFields(
        state?.form?.id,
        state?.formField
      );
      if (newField) {
        dispatch({
          type: "ADD_FORM_FIELD",
          formField: newField,
          callBack: () => {
            dispatch({ type: "CLEAR_FORM_FIELD", kind: "TEXT", label: "" });
          },
        });
        //window.location.reload();
        navigate(`/forms/${state?.form?.id}`);
      }
      console.log({ newField });
      // dispatch({ type: "ADD_FORM_FIELD", formField: newField,  });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFieldDelete = async (id: number) => {
    try {
      if (state?.form?.id === undefined) throw Error("Form Id is undefined");
      await deleteFormField(state?.form?.id, id);
      dispatch({
        type: "DELETE_FORM_FIELD",
        formFieldId: id,
      });
      navigate(`/forms/${state?.form?.id}`);
    } catch (error) {
      console.error(error);
    }
  };
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
              dispatch({ type: "SET_FORM_TITLE", title: e.target.value });
            }}
            type="text"
            elementRef={titleRef}
            key={state?.form?.id}
          />
        </div>
      </div>
      <form onSubmit={handleFieldCreate}>
        <div className="flex gap-2 w-11/12 items-center">
          <div className="flex rounded-lg shadow-lg h-14 items-center p-3">
            <span className="font-semibold mr-1">Kind:</span>
            <select
              name="KindSelecter"
              id=""
              className="px-2 focus:outline-none font-light "
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD_KIND",
                  kind: e.target.value as FormFieldKind,
                });
              }}
            >
              <option value="TEXT">text</option>
              <option value="RADIO">radio</option>
              <option value="DROPDOWN">dropdown</option>
              <option value="COLOR">color</option>
            </select>
          </div>

          <input
            type="text"
            value={state.formField.label ?? ""}
            className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2  w-2/3 focus:outline-none focus:border-l-green-500 focus:border-l-8"
            onChange={(e) => {
              dispatch({ type: "SET_FIELD_LABEL", label: e.target.value });
            }}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44
             hover:bg-green-500"
          >
            Add Field
          </button>
        </div>
      </form>

      <CustomHeader title="Created Fields" margin={true} />
      <div className="my-7 w-11/12  ">
        {state?.formFields?.length > 0 ? (
          <>
            {state?.formFields?.map((field) => {
              switch (field.kind) {
                case "TEXT":
                  return (
                    <div className="divide divide-x-2" key={field.id}>
                      <EditableField
                        field={field}
                        handleChangeCB={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          // dispatch({
                          //   type: "update_label",
                          //   value: e.target.value,
                          //   id: field.id,
                          // });
                        }}
                        removeFieldCB={
                          (id: number) => {
                            handleFieldDelete(id);
                          }
                          // dispatch({ type: "remove_field", id: id })
                        }
                      />
                      <Divider />
                    </div>
                  );
                case "DROPDOWN":
                  return (
                    <CustomFieldWithOption
                      key={field.id}
                      field={field}
                      handleChangeCB={(e) => {
                        // dispatch({
                        //   type: "update_label",
                        //   value: e.target.value,
                        //   id: field.id,
                        // });
                        dispatch({
                          type: "SET_FIELD_LABEL",
                          label: e.target.value,
                        });
                      }}
                      id={field?.id as number}
                      removeFieldCB={
                        (id) => {
                          handleFieldDelete(id);
                        }
                        // dispatch({ type: "remove_field", id: id })
                      }
                      addOptionCB={
                        (option) => {}
                        // dispatch({
                        //   type: "add_option",
                        //   fieldId: field.id,
                        //   option: option,
                        // })
                      }
                      removeOptionCB={
                        (id: number) => {
                          handleFieldDelete(id);
                        }
                        // dispatch({
                        //   type: "remove_option",
                        //   fieldId: field.id,
                        //   optionId: index,
                        // })
                      }
                      updateOptionCB={(option, index) => {
                        // dispatch({
                        //   type: "update_option",
                        //   fieldId: field.id,
                        //   option: option,
                        //   index: index,
                        // });
                      }}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );

                case "RADIO":
                  return (
                    <CustomFieldWithOption
                      key={field.id}
                      field={field}
                      handleChangeCB={(e) => {
                        // dispatch({
                        //   type: "update_label",
                        //   value: e.target.value,
                        //   id: field.id,
                        // });
                      }}
                      id={field?.id as number}
                      removeFieldCB={
                        (id) => {}
                        // dispatch({ type: "remove_field", id: id })
                      }
                      addOptionCB={
                        (option) => {}
                        // dispatch({
                        //   type: "add_option",
                        //   fieldId: field.id,
                        //   option: option,
                        // })
                      }
                      removeOptionCB={
                        (index) => {}
                        // dispatch({
                        //   type: "remove_option",
                        //   fieldId: field.id,
                        //   optionId: index,
                        // })
                      }
                      updateOptionCB={(option, index) => {
                        // dispatch({
                        //   type: "update_option",
                        //   fieldId: field.id,
                        //   option: option,
                        //   index: index,
                        // });
                      }}
                      emptyFieldAlertCB={emptyFieldAlert}
                    />
                  );
              }
            })}
            <div>wait</div>
          </>
        ) : (
          <div>No fields Created</div>
        )}
      </div>

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
        <button
          className="bg-gray-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500"
          onClick={(_) => setNewForm(true)}
        >
          Update Form
        </button>
        <Modal open={newForm} closeCB={() => setNewForm(false)}>
          <UpdateForm formId={state?.form?.id ?? 0} />
        </Modal>
        {/* <Button name={"Clear Form"} handleEvent={clearForm} /> */}
      </div>
    </div>
  );
}
