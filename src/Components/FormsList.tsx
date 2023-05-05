import React, { useEffect, useState } from "react";
import { useQueryParams } from "raviger";
import { getLocalResponses } from "../utils/storageUtils";
import CustomInputField from "./CustomInputField";
import FormCard from "./FormCard";
import { FormItem, formData } from "../types/formTypes";
import { responseData } from "../types/responseTypes";
import Modal from "./common/Modal";
import CreateForm from "./CreateForm";

const fetchForms = async (setFormsListCB: (value: FormItem[]) => void) => {
  const response = await fetch("https://tsapi.coronasafe.live/api/mock_test/");
  const jsonData = await response.json();
  setFormsListCB(jsonData);
};
export default function FormsList() {
  const [formsListState, setFormsList] = useState<FormItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formId, setFormId] = useState(0);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const savedForms = localStorage.getItem("savedForms");

  // useEffect(() => {
  //   const savedFormsJson = JSON.parse(savedForms!);
  //   setFormsList(savedFormsJson);
  // }, [savedForms]);

  useEffect(() => {
    fetchForms(setFormsList);
  }, []);
  const deleteForm = (id: number) => {
    //deletes the form from localStorage
    const savedFormsJson = JSON.parse(savedForms!);
    const filteredForms = savedFormsJson.filter(
      (form: formData) => form.id !== id
    );
    localStorage.removeItem("savedForms");
    localStorage.setItem("savedForms", JSON.stringify(filteredForms));

    //deletes the form responses from localStorage
    const responses = getLocalResponses();
    const filteredResponses = responses.filter(
      (response: responseData) => response.formId !== id
    );
    localStorage.setItem("savedResponses", JSON.stringify(filteredResponses));
    setFormsList(filteredForms);
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
              onClick={(_) => setNewForm(true)}
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
          <div className="mx-5">
            {formsListState
              ?.filter((form: FormItem) =>
                form.title.toLowerCase().includes(search?.toLowerCase() || "")
              )
              .map((form: FormItem) => (
                <div
                  className="flex gap-2 justify-between my-2 items-center"
                  key={form.id}
                >
                  <FormCard
                    title={form.title}
                    key={form.id}
                    questions={0}
                    id={form.id || 0}
                    handleDeleteEventCB={deleteForm}
                  />
                </div>
              ))}
          </div>
          <Modal open={newForm} closeCB={() => setNewForm(false)}>
            <CreateForm />
          </Modal>
        </>
      ) : (
        //  <Form id={formId} />
        <>kol</>
      )}
    </div>
  );
}
