import React, { useEffect, useState } from "react";
import { responseData } from "../types/responseTypes";
import { initialState } from "../utils/storageUtils";
import { DropdownField, RadioType, TextField } from "../types/formTypes";
import RadioField from "./RadioField";
import { useNavigate } from "raviger";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CustomInputField from "./CustomInputField";
import CustomHeader from "./CustomHeader";
import ColorPicker from "./ColorPicker";
import NotFound from "./NotFound";

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
export default function PreviewQuestion(props: { id: number }) {
  const { id } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState(() => initialState(id!));
  const [currentField, setCurrentField] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

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
    state?.formFields[currentField]?.kind === "dropdown"
      ? (responseState?.responses[currentField]?.response as string[])
      : []
  );

  //handles the checkbox input change
  const handleCheckboxChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const notify = () =>
    toast.info("Your responses are automatically saved", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  useEffect(() => {
    if (!state) {
      return;
    }
    if (mounted) {
      notify();
    } else {
      setMounted(true);
    }
  }, [mounted, state]);

  //increments the currentField value
  const handleNext = () => {
    if (!state) {
      return;
    }
    if (currentField <= state.formFields.length - 1) {
      setUserRes("");
      setCurrentField(currentField + 1);
    }
  };

  //decrements the currentField value
  const handlePrev = () => {
    if (currentField > 0) {
      setUserRes("");
      setCurrentField(currentField - 1);
    }
  };

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
      valueToUpdate.response = [...selectedOptions];
      setResponse({
        ...responseState,
        responses: existingData,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  //updates the user response when input changes
  useEffect(() => {
    if (!state || !responseState || !userRes) {
      return;
    }
    const existingData = [...responseState.responses];
    let valueToUpdate = existingData.find(
      (field) => field.questionId === state.formFields[currentField]?.id
    );
    if (valueToUpdate !== undefined) {
      valueToUpdate.response = userRes;
    }
    setResponse({
      ...responseState,
      responses: existingData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRes]);

  //updates or creates response
  useEffect(() => {
    if (!responseState || !state?.formFields?.length) {
      return;
    } else {
      let existingRes = responseState.responses.find(
        (res) => res.questionId === state.formFields[currentField]?.id
      );
      if (existingRes) {
        setUserRes(responseState.responses[currentField]?.response || "");
        if (state.formFields[currentField]?.kind === "dropdown") {
          setSelectedOptions(
            (responseState?.responses[currentField]?.response as string[]) || []
          );
        }

        return;
      }
      setResponse({
        ...responseState,
        responses: [
          ...responseState.responses,
          {
            question: state.formFields[currentField]?.label,
            response: userRes,
            questionId: state.formFields[currentField]?.id,
          },
        ],
      });
      setUserRes("");
      setSelectedOptions([]);
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

  const updateUserResponse = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserRes(e.target.value);
  };
  const updateColor = (color: string) => {
    setUserRes(color);
  };
  return state ? (
    <div className=" w-4/5 mx-auto">
      <h1 className="text-2xl font-semibold text-center capitalize">
        {state.title}
      </h1>

      <div className="m-5 mt-8">
        {state.formFields.length > 0 ? (
          <>
            {state.formFields[currentField]?.kind === "text" ? (
              <>
                <CustomHeader
                  title={state.formFields[currentField]?.label}
                  capitalize={true}
                />
                <CustomInputField
                  type={
                    (state.formFields[currentField] as TextField)?.fieldType
                  }
                  value={userRes as string}
                  handleInputChangeCB={updateUserResponse}
                />
              </>
            ) : (
              <div>
                <>
                  {state.formFields[currentField].kind === "radio" ? (
                    <>
                      {(state.formFields[currentField] as RadioType)
                        .fieldType === "color" ? (
                        <ColorPicker
                          field={state.formFields[currentField]}
                          value={userRes as string}
                          setColorCB={updateColor}
                        />
                      ) : (
                        <div>
                          <CustomHeader
                            title={state.formFields[currentField]?.label}
                            capitalize={true}
                          />
                          <div className="  overflow-y-auto h-36 m-5">
                            {(state.formFields[currentField] as RadioType)
                              .options.length > 0 ? (
                              <>
                                {(
                                  state.formFields[currentField] as RadioType
                                ).options?.map((option, index) => (
                                  <RadioField
                                    type={
                                      (
                                        state.formFields[
                                          currentField
                                        ] as RadioType
                                      )?.fieldType
                                    }
                                    value={option}
                                    id={state.formFields[currentField]?.id}
                                    key={index}
                                    checked={userRes === option}
                                    handleChangeCB={(e) => {
                                      setUserRes(e.target.value);
                                    }}
                                    label={option}
                                  />
                                ))}
                              </>
                            ) : (
                              <div>No options are added</div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center">
                      <CustomHeader
                        title={state.formFields[currentField]?.label}
                        capitalize={true}
                      />
                      <div className="ml-4  w-1/3">
                        {(state.formFields[currentField] as DropdownField)
                          .options.length > 0 ? (
                          <>
                            <button
                              className=" py-2 px-3 mt-5 border-2 border-gray-300 w-full "
                              onClick={() => setIsOpen(!isOpen)}
                            >
                              {Array.isArray(selectedOptions) &&
                              selectedOptions.length > 0
                                ? selectedOptions.join(" , ")
                                : "No options selected"}
                            </button>
                            {isOpen && (
                              <ul className=" shadow-lg bg-gray-300 w-full">
                                {(
                                  state.formFields[
                                    currentField
                                  ] as DropdownField
                                ).options.map((option) => (
                                  <li key={option}>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(
                                          option
                                        )}
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
                          </>
                        ) : (
                          <p className="block">No options are added</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              </div>
            )}
          </>
        ) : (
          <div>No questions</div>
        )}
      </div>

      <div className="flex justify-between h-48">
        {currentField === 0 ? (
          <div></div>
        ) : (
          <button
            className="bg-yellow-500 text-white rounded-lg py-2 px-2 h-10"
            onClick={handlePrev}
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
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}
        {currentField === state.formFields.length - 1 ? (
          ""
        ) : (
          <>
            {state.formFields.length > 0 ? (
              <button
                className="bg-green-500 text-white rounded-lg py-2 px-2 h-10"
                onClick={handleNext}
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {currentField === state.formFields.length - 1 ? (
        <div className="flex justify-center mb-5">
          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-3  w-1/3 text-lg"
            onClick={(_) => {
              if (responseState) {
                saveResponseData(responseState);
                navigate("/");
              }
            }}
          >
            Submit
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <NotFound />
  );
}
