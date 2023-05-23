import React, { useEffect, useReducer, useState } from "react";
import { navigate, useQueryParams } from "raviger";
import { useDrop } from "react-dnd";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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

import FormPagination from "./FormPagination";
import SortableItem from "./SortableItem";
import DragDropContainer from "./DragDropContainer";

export default function FormsList() {
  const [formState, dispatch] = useReducer(FormReducer, initialState);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formId, setFormId] = useState(0);
  const [{ search }, setQuery] = useQueryParams<{ search: string }>();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);

  const [limit] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const fetchForms = async (offset: number, limit: number) => {
    try {
      const data: Pagination<FormItem> = await listForms({ offset, limit });
      if (!data) {
        throw Error("No data found");
      }
      setTotalPages(data.count / limit);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
    fetchForms(offset, limit)
      .then((data: Pagination<FormItem> | undefined) => {
        if (data) {
          setCount(data.count);
          dispatch({
            type: "FETCH_FORMS_SUCCESS",
            forms: data.results ? data.results : [],
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: "FETCH_FORMS_FAILURE",
          error: "Failed to fetch data",
        });
      });
  }, [currentPage, limit, offset]);

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
  const [forms, setForms] = useState(formState?.forms || []);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const draggedCard = forms[dragIndex];
    setForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms.splice(dragIndex, 1);
      updatedForms.splice(hoverIndex, 0, draggedCard);
      return updatedForms;
    });
  };
  const [, drop] = useDrop({
    accept: "formCard",
    drop: () => ({ name: "form-container" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  return (
    <div>
      {formId === 0 ? (
        <>
          <div className="flex justify-between my-5">
            <button
              onClick={(_) =>
                getAuthToken() === null ? navigate("/login") : setNewForm(true)
              }
              className="bg-green-500 py-2 px-3 text-white rounded-lg flex  shadow-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
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
                name="search"
                handleInputChangeCB={updateSearchString}
              />
            </div>
          </form>
          {/* <DragDropContainer forms={formState?.forms} search={search} /> */}
          {/* <SortableContext
            items={formState?.forms.map((form) => ({
              id: form.id as number,
            }))}
            strategy={verticalListSortingStrategy}
          >
            {formState?.forms
              ?.filter((form: FormItem) =>
                form.title.toLowerCase().includes(search?.toLowerCase() || "")
              )
              .map((form: FormItem) => (
                <div
                  className="flex gap-2 justify-between my-2 items-center"
                  key={form.id}
                >
                  <SortableItem key={form} id={form.id} />
                </div>
              ))}
          </SortableContext> */}

          {/* <div>
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
                        // moveCard={moveCard}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div> */}
          <FormPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            count={count}
            offset={offset}
            limit={limit}
          />
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
