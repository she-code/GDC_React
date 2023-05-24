import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import update from "immutability-helper";

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
import CustomHeader from "../common/CustomHeader";
import NotFound from "../NotFound";
import Loading from "../common/Loading";
import { getAuthToken } from "../../utils/storageUtils";
import ShareForm from "./ShareForm";
import TextField from "./Field/TextField";
import { t } from "i18next";

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
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [cards, setCards] = useState(state?.formFields || []);

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
          setCards(formFields?.results);
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
  }, [props.id]);

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
    if (state?.label?.length === 0) {
      emptyFieldAlert();
      return;
    }
    try {
      if (state.form.id === undefined) throw Error("Form Id is undefined");
      const newField = await createFormFields(state?.form?.id, {
        kind: state?.kind,
        label: state?.label,
        options: [],
        value: "",
        meta: {},
      });
      if (newField) {
        navigate(`/forms/${state?.form?.id}`);
        dispatch({
          type: "ADD_FORM_FIELD",
          formField: newField,
          callBack: () => {
            dispatch({ type: "CLEAR_FORM_FIELD", kind: "TEXT", label: "" });
          },
        });
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

  //handles field update
  const handleFieldUpdate = async (formField: FormFieldType) => {
    dispatch({ type: "UPDATE_FORM_FIELD", formField: formField });
  };

  //handles option deletion
  const handleOptionDelete = async (id: number, field: FormFieldType) => {
    try {
      if (state?.form?.id === undefined) throw Error("Form Id is undefined");

      const updatedField = {
        ...field,
        options: field.options?.filter((option, index) => index !== id),
      };

      const updatedFormField = await updateFormField(
        state?.form.id as number,
        field.id as number,
        updatedField
      );

      if (updatedFormField) {
        dispatch({
          type: "DELETE_OPTION",
          fieldId: field.id as number,
          index: id,
        });
        navigate(`/forms/${state?.form?.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFocus = () => {
    selectRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      selectRef.current?.click();
    }
  };
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: FormFieldType[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as FormFieldType],
        ],
      })
    );
  }, []);
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
            name="title"
          />
        </div>
      </div>
      <form onSubmit={handleFieldCreate}>
        <div className="flex gap-2 w-11/12 items-center">
          <div className="flex rounded-lg shadow-lg h-14 items-center p-3 focus:border-l-2">
            <span className="font-semibold mr-1">{t("kind")}:</span>
            <select
              name="KindSelecter"
              id=""
              tabIndex={0}
              ref={selectRef}
              className="px-2 focus:outline-none font-light  focus:border-l-green-500 focus:border-l-4"
              onChange={(e) => {
                dispatch({
                  type: "SET_FIELD_KIND",
                  kind: e.target.value as FormFieldKind,
                });
              }}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
            >
              <option value="TEXT">{t("text")}</option>
              <option value="RADIO">{t("radio")}</option>
              <option value="DROPDOWN">{t("dropdown")}</option>
              <option value="GENERIC">{t("generic")}</option>
            </select>
          </div>

          <input
            type="text"
            value={state?.label ?? ""}
            tabIndex={0}
            aria-label="field-label"
            className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2  w-2/3 focus:outline-none focus:border-l-green-500 focus:border-l-8"
            onChange={(e) => {
              dispatch({ type: "SET_FIELD_LABEL", label: e.target.value });
            }}
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 
            focus:outline-none focus:bg-green-600
             hover:bg-green-600"
          >
            {t("addField")}
          </button>
        </div>
      </form>

      <CustomHeader title={t("createdFields")} margin={true} />
      <div className="my-7 w-11/12  ">
        {state?.loading ? (
          <Loading />
        ) : (
          <>
            {state?.formFields?.length > 0 ? (
              <>
                {cards?.map((field: FormFieldType, index: number) => {
                  switch (field.kind) {
                    case "TEXT":
                      return (
                        <TextField
                          key={field?.id}
                          index={index}
                          field={field}
                          id={state?.form?.id as number}
                          handleChangeCB={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {}}
                          removeFieldCB={(id: number) => {
                            handleFieldDelete(id);
                          }}
                          moveCard={moveCard}
                        />
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
                            handleOptionDelete(id, field);
                          }}
                          updateOptionCB={(option, index) => {}}
                          emptyFieldAlertCB={emptyFieldAlert}
                          handleOptionCreateCB={handleFieldUpdate}
                          moveCard={moveCard}
                          index={index}
                        />
                      );
                  }
                })}
              </>
            ) : (
              <div>{t("noField")}</div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4 w-11/12 items-start justify-between">
        <Link
          className="bg-gray-600 text-white py-2 pl-8 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500   
          focus-outline-none focus:bg-gray-500 active-outline-none active:bg-gray-500"
          href={`/forms/${state?.form?.id}/submission`}
          role="link"
          aria-label="submissions"
        >
          {t("submissions")}
        </Link>
        <Link
          href="/"
          role="link"
          aria-label="close form"
          className="bg-green-600 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 text-center hover:bg-green-500"
        >
          {t("closeForm")}
        </Link>
        <button
          className="bg-gray-500 text-white py-2 px-3 text-lg  rounded-xl m-3  w-44 hover:bg-gray-500
           focus-outline-none focus:bg-gray-600  "
          onClick={(_) =>
            getAuthToken() === null ? navigate("/login") : setNewForm(true)
          }
        >
          {t("editForm")}
        </button>
        <ShareForm formID={state?.form?.id} />
        <Modal open={newForm} closeCB={() => setNewForm(false)}>
          <UpdateForm form={state?.form as FormItem} />
        </Modal>
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
