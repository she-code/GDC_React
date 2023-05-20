import React, { useEffect, useReducer, useState } from "react";
import { navigate, useQueryParams } from "raviger";
import CustomInputField from "../common/CustomInputField";
import FormCard from "./FormCard";
import { FormItem, initialState } from "../../types/formTypes";
import Modal from "../common/Modal";
import CreateForm from "./CreateForm";
import { Pagination } from "../../types/common";
import { FormReducer } from "../../reducers/formReducer";
import { deleteForm, listForms } from "../../utils/apiUtils";
import Loading from "../common/Loading";
import { getAuthToken } from "../../utils/storageUtils";
import { toast } from "react-toastify";
const fetchForms = async () => {
  try {
    const data: Pagination<FormItem> = await listForms({
      offset: 0,
      limit: 5,
    });
    if (!data) {
      throw Error("No data found");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
export default function FormsList() {
  const [formState, dispatch] = useReducer(FormReducer, initialState);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formId, setFormId] = useState(0);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);

  useEffect(() => {
    fetchForms()
      .then((data) => {
        dispatch({
          type: "FETCH_FORMS_SUCCESS",
          forms: data?.results ? data?.results : [],
        });
      })
      .catch((error) => {
        dispatch({
          type: "FETCH_FORMS_FAILURE",
          error: "Failed to fetch data",
        });
      });
  }, []);
  const loginAlert = () =>
    toast.info("Please Login", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const handleDelete = async (id: number) => {
    if (getAuthToken() === null) {
      loginAlert();
      return;
    }
    try {
      await deleteForm(id);
      dispatch({ type: "DELETE_FORM", formId: id });
    } catch (error) {
      console.error(error);
    }
  };

  const updateSearchString = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div>
      {formId === 0 ? (
        <>
          <div className="flex justify-between my-5">
            <button
              onClick={(_) =>
                getAuthToken() === null ? navigate("/login") : setNewForm(true)
              }
              className="bg-green-500 py-2 px-3 text-white rounded-lg flex  shadow-lg hover:bg-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="text-lg">New Form</span>
            </button>
          </div>
          <form
            className="mr-5"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            <div className="relative h-10 w-full min-w-[200px] mb-5">
              <div className="absolute  top-7 right-3 grid h-5 w-5 -translate-y-2/4 ">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <CustomInputField
                value={searchString}
                type="text"
                handleInputChangeCB={updateSearchString}
              />
            </div>
          </form>
          <div>
            {formState?.loading ? (
              <Loading />
            ) : (
              <div className="mx-5">
                {formState?.forms
                  ?.filter((form: FormItem) =>
                    form.title
                      .toLowerCase()
                      .includes(search?.toLowerCase() || "")
                  )
                  .map((form: FormItem) => (
                    <div
                      className="flex gap-2 justify-between my-2 items-center"
                      key={form.id}
                    >
                      <FormCard
                        title={form?.title}
                        key={form?.id}
                        id={form?.id || 0}
                        handleDeleteEventCB={handleDelete}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Modal open={newForm} closeCB={() => setNewForm(false)}>
            <CreateForm />
          </Modal>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
