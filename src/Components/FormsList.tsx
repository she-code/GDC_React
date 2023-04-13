import React, { useEffect, useState } from "react";
import Form from "./Form";
import { Link, useQueryParams } from "raviger";

export default function FormsList() {
  const [formsListState, setFormsList] = useState([]);
  const [formId, setFormId] = useState(0);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const savedForms = localStorage.getItem("savedForms");

  useEffect(() => {
    const savedFormsJson = JSON.parse(savedForms!);
    setFormsList(savedFormsJson);
  }, [savedForms]);

  //deletes a form with the given ID
  const deleteForm = (id: number) => {
    const savedFormsJson = JSON.parse(savedForms!);
    const filteredForms = savedFormsJson.filter((form: any) => form.id !== id);
    localStorage.removeItem("savedForms");
    localStorage.setItem("savedForms", JSON.stringify(filteredForms));
    setFormsList(filteredForms);
  };
  return (
    <div>
      {formId === 0 ? (
        <>
          <div className="flex justify-between my-5">
            <Link
              href="/forms/0"
              className="bg-yellow-500 py-2 px-3 text-white rounded-lg"
            >
              New Form
            </Link>
          </div>
          <form
            className="mr-5"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            <label className="text-xl ">Search</label>
            <input
              className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
              type="text"
              name="search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </form>
          <div className="mx-5">
            {formsListState
              ?.filter((form: any) =>
                form.title.toLowerCase().includes(search?.toLowerCase() || "")
              )
              .map((form: any) => (
                <div className="flex gap-2 justify-between my-2" key={form.id}>
                  <p>{form.title}</p>
                  <Link
                    href={`/forms/${form.id}`}
                    className="py-2 px-3 text-green-500"
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </Link>
                  <button
                    className=" py-2 px-3 text-red-500"
                    onClick={(_) => deleteForm(form.id)}
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
              ))}
          </div>
        </>
      ) : (
        <Form id={formId} />
      )}
    </div>
  );
}
