import React, { useState, useEffect, useRef, useReducer } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, navigate } from "raviger";
import {
  FormFieldKind,
  FormFieldType,
  FormItem,
  initialState,
} from "../../types/formTypes";

import CustomInputField from "../common/CustomInputField";

import { FormReducer } from "../../reducers/formReducer";
import {
  createFormFields,
  deleteFormField,
  getForm,
  getFormFields,
  updateFormField,
} from "../../utils/apiUtils";
import { Pagination } from "../../types/common";
import Modal from "../common/Modal";
import UpdateForm from "./UpdateForm";
import CustomFieldWithOption from "./Field/CustomFieldWithOption";
import Divider from "../common/Divider";
import EditableField from "../common/EditableField";
import CustomHeader from "../common/CustomHeader";
import NotFound from "../NotFound";
import Loading from "../common/Loading";
import { getAuthToken } from "../../utils/storageUtils";

const fetchForm = async (id: number) => {
  try {
    const data: FormItem = await getForm(id);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default function Form(props: { id: number }) {
  const [state, dispatch] = useReducer(FormReducer, initialState);
  const [newForm, setNewForm] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  //checks if the user is authenticated
  useEffect(() => {
    if (getAuthToken() === null) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetches forms and fields
  useEffect(() => {
    const getForm = async () => {
      const form = await fetchForm(props.id);
      if (form?.id) {
        dispatch({ type: "FETCH_FORM", form: form ? form : { title: "" } });
        const formFields: Pagination<FormFieldType> = await getFormFields(
          { offset: 0, limit: 5 },
          form?.id
        );
        if (formFields?.results) {
          dispatch({
            type: "FETCH_FORM_FIELDS",
            formFields: formFields?.results,
          });
        }
      } else {
        dispatch({ type: "FETCH_FORM_FAILURE", error: "Something went wrong" });
      }
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

  //handles formField creation
  const handleFieldCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state?.formField?.label.length === 0) {
      emptyFieldAlert();
      return;
    }
    try {
      if (state.form.id === undefined) throw Error("Form Id is undefined");
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
        navigate(`/forms/${state?.form?.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //handles formField deletion
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

  //handles option deletion
  const handleOptionDelete = async (id: number, field: FormFieldType) => {
    try {
      if (state?.form?.id === undefined) throw Error("Form Id is undefined");

      const updatedFormField = await updateFormField(
        state?.form.id as number,
        field?.id as number,
        field
      );
      if (updatedFormField) {
        navigate(`/forms/${state?.form?.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return state?.loading ? (
    <Loading />
  ) : state?.form?.id ? (
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
              <option value="GENERIC">generic</option>
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
        {state?.loading ? (
          <Loading />
        ) : (
          <>
            {state?.formFields?.length > 0 ? (
              <>
                {state?.formFields?.map((field: FormFieldType) => {
                  switch (field.kind) {
                    case "TEXT":
                      return (
                        <div className="divide divide-x-2" key={field.id}>
                          <EditableField
                            field={field}
                            formId={state?.form?.id as number}
                            handleChangeCB={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {}}
                            removeFieldCB={(id: number) => {
                              handleFieldDelete(id);
                            }}
                          />
                          <Divider />
                        </div>
                      );
                    default:
                      return (
                        <CustomFieldWithOption
                          key={field?.id}
                          field={field}
                          formId={state?.form?.id as number}
                          handleChangeCB={(e) => {}}
                          id={field?.id as number}
                          removeFieldCB={(id: number) => {
                            handleFieldDelete(id);
                          }}
                          removeOptionCB={(id: number) => {
                            dispatch({
                              type: "DELETE_OPTION",
                              fieldId: field?.id as number,
                              index: id,
                            });

                            handleOptionDelete(field?.id as number, field);
                          }}
                          updateOptionCB={(option, index) => {}}
                          emptyFieldAlertCB={emptyFieldAlert}
                        />
                      );
                  }
                })}
              </>
            ) : (
              <div>No fields Created</div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4 w-11/12 items-start justify-between">
        <Link
          className="bg-gray-600 text-white py-2 pl-8 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500"
          href={`/forms/${state?.form?.id}/submission`}
        >
          Submissions
        </Link>
        <Link
          href="/"
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 text-center hover:bg-green-500"
        >
          Close Form
        </Link>
        <button
          className="bg-gray-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500"
          onClick={(_) =>
            getAuthToken() === null ? navigate("/login") : setNewForm(true)
          }
        >
          Edit Form
        </button>
        <Modal open={newForm} closeCB={() => setNewForm(false)}>
          <UpdateForm form={state?.form as FormItem} />
        </Modal>
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
