import React, { useEffect, useState } from "react";
import { responseData } from "../types/responseTypes";
import { initialState } from "../utils/storageUtils";
import { DropdownField, TextField } from "../types/formTypes";

const getLocalResponses: () => responseData[] = () => {
  const savedResponses = localStorage.getItem("savedResponses");
  return savedResponses ? JSON.parse(savedResponses) : [];
};

const saveLocalResponses = (localForms: responseData[]) => {
  localStorage.setItem("savedResponses", JSON.stringify(localForms));
};

const saveResponseData = (currentState: responseData) => {
  const localResponses = getLocalResponses();
  const index = localResponses.findIndex(
    (response) => response.id === currentState.id
  );
  if (index !== -1) {
    // update the existing response
    localResponses[index] = currentState;
    saveLocalResponses(localResponses);
  } else {
    // add a new response
    const updatedLocalResponses = [...localResponses, currentState];
    saveLocalResponses(updatedLocalResponses);
  }
};
export default function PreviewQuestion(props: { id: any }) {
  const { id } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState(() => initialState(id!));

  const [currentField, setCurrentField] = useState(0);
  const [exsitingValue, setExisting] = useState(false);
  const [mounted, setMounted] = useState(false);

  //*************selectinput  */
  const [isOpen, setIsOpen] = useState(false);

  //initializes the response value
  const initialResponse: (id: number) => responseData | undefined = (id) => {
    if (state?.formFields?.length) {
      const localResponses = getLocalResponses();
      const selectedResponse = localResponses?.find(
        (response) => response.formId === id
      );
      if (selectedResponse) {
        console.log("initial", selectedResponse);
        return selectedResponse;
      } else {
        const newResponse = {
          id: Number(new Date()),
          formId: state.id,
          formTitle: state.title,
          responses: [],
        };
        return newResponse;
      }
    }
  };
  const [responseState, setResponse] = useState(initialResponse(id));
  const [userRes, setUserRes] = useState(
    responseState?.responses[currentField]?.response || ""
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    (responseState?.responses[currentField]?.response as string[]) || []
  );
  const options = (state?.formFields[currentField] as DropdownField).options;

  const handleCheckboxChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }

    console.log("from change", selectedOptions);
  };

  //increments the currentField value
  const handleNext = () => {
    if (!state) {
      return;
    }
    if (currentField <= state.formFields.length - 1) {
      setCurrentField(currentField + 1);
    }
  };

  //decrements the currentField value
  const handlePrev = () => {
    if (currentField > 0) {
      setCurrentField(currentField - 1);
    }
  };

  useEffect(() => {
    if (!state) {
      return;
    }
    if (mounted) {
      alert("Your responses are automatically saved");
    } else {
      setMounted(true);
    }
  }, [mounted, state]);

  //saves selected options in dropdown
  useEffect(() => {
    if (!state || !responseState) {
      return;
    }
    const existingData = [...responseState.responses];
    let valueToUpdate = existingData.find(
      (field) => field.question === state.formFields[currentField]?.label
    );
    if (valueToUpdate) {
      // valueToUpdate.response.push(selOp);
      // = [...valueToUpdate.response, selOp];
      // if (Array.isArray(valueToUpdate.response)) {
      //   valueToUpdate.response.push(...selectedOptions);
      // } else {
      //   valueToUpdate.response = [selOp];
      // }
      valueToUpdate.response = [...selectedOptions];
      setResponse({
        ...responseState,
        responses: existingData,
      });
      //setSelectedOptions([]);
    }

    console.log("from chek ude", valueToUpdate, { selectedOptions });
  }, [selectedOptions]);

  //updates the user response when input changes
  useEffect(() => {
    if (!state || !responseState) {
      return;
    }
    const existingData = [...responseState.responses];
    let valueToUpdate = existingData.find(
      (field) => field.question === state.formFields[currentField]?.label
    );
    if (valueToUpdate !== undefined) {
      valueToUpdate.response = userRes;
    }
    setResponse({
      ...responseState,
      responses: existingData,
    });
    console.log("updating", userRes, responseState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRes]);

  //updates or creates response
  useEffect(() => {
    if (!responseState || !state?.formFields?.length) {
      return;
    } else {
      let existingRes = responseState.responses.find(
        (res) => res.question === state.formFields[currentField]?.label
      );
      if (existingRes) {
        console.log("if", responseState);
        setExisting(true);
        setUserRes(responseState.responses[currentField]?.response || "");
        setSelectedOptions(
          (responseState?.responses[currentField]?.response as string[]) || []
        );

        return;
      }
      setResponse({
        ...responseState,
        responses: [
          ...responseState.responses,
          {
            question: state.formFields[currentField]?.label,
            response: userRes,
          },
        ],
      });
      setUserRes("");
      setExisting(false);
      setSelectedOptions([]);
      console.log("ädded", { selectedOptions });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentField]);

  //saves the response automatically in localstorage
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (state?.formFields?.length) {
      timeout = setTimeout(() => {
        saveResponseData(responseState as responseData);
      }, 1000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseState]);

  return state ? (
    <div className="h-64">
      {state.formFields.length > 0 ? (
        <>
          {state.formFields[currentField].kind === "text" ? (
            <div className="m-5">
              <p className="text-xl font-semibold">
                {state.formFields[currentField].label}
              </p>
              <input
                className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-yellow-500 focus:border-l-8"
                type={(state.formFields[currentField] as TextField).fieldType}
                value={userRes}
                onChange={(e) => {
                  setUserRes(e.target.value);
                }}
              />
            </div>
          ) : (
            // <select
            //   value={userRes}
            //   onChange={(e) => {
            //     setUserRes(e.target.value);
            //   }}
            // >
            //   <option>Select an option</option>
            //   {(state.formFields[currentField] as DropdownField).options.map(
            //     (option, index) => (
            //       <option key={index} value={option}>
            //         {option}
            //       </option>
            //     )
            //   )}
            // </select>
            <div className="flex">
              <p className="p-5">{state.formFields[currentField].label}</p>
              {/* <SelectWithCheckboxes
                options={
                  (state.formFields[currentField] as DropdownField).options
                }
                onCheckedCB={saveDropDownValue}
                fieldLabel={state.formFields[currentField].label}
              /> */}
              <div className="select-with-checkboxes ">
                <button
                  className="dropdown-toggle py-2 px-3 mt-5 border-2 border-gray-300 "
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedOptions.length === 0
                    ? "Select options"
                    : selectedOptions.join(", ")}
                </button>
                {isOpen && (
                  <ul className=" shadow-lg bg-gray-300 w-full">
                    {options.map((option) => (
                      <li key={option}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => {
                              handleCheckboxChange(option);
                            }}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>No questions</div>
      )}

      <div className="flex justify-between">
        {currentField === 0 ? (
          <div></div>
        ) : (
          <button
            className="bg-yellow-500 text-white rounded-lg py-2 px-3 w-20"
            onClick={handlePrev}
          >
            Prev
          </button>
        )}
        {currentField === state.formFields.length - 1 ? (
          ""
        ) : (
          <>
            {state.formFields.length > 0 ? (
              <button
                className="bg-blue-500 text-white rounded-lg py-2 px-3 w-20"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {currentField === state.formFields.length - 1 ? (
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-3 w-20"
            onClick={(_) =>
              responseState ? saveResponseData(responseState) : () => {}
            }
          >
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <div>Form with this Id doesn't exist</div>
  );
}
