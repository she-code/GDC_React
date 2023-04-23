import React, { useEffect, useState } from "react";
import { useNavigate } from "raviger";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { responseData } from "../utils/types/types";
import { initialState } from "../utils";
import CustomInputField from "./CustomInputField";
import CustomHeader from "./CustomHeader";

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
      // alert("Your responses are automatically saved");
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
    console.log("updating", userRes, responseState);
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
        console.log("if", responseState);
        setUserRes(responseState.responses[currentField]?.response || "");
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
      console.log("ädded");
      setUserRes("");
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
  return state ? (
    <div className=" w-4/5 mx-auto">
      <h1 className="text-2xl font-semibold text-center capitalize">
        {state.title}
      </h1>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="m-5 mt-8">
        {state.formFields.length > 0 ? (
          <>
            <CustomHeader
              title={state.formFields[currentField]?.label}
              capitalize={true}
            />
            <CustomInputField
              type={state.formFields[currentField]?.fieldType}
              value={userRes}
              handleInputChangeCB={updateUserResponse}
            />
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
    <div>Form with this Id doesn't exist</div>
  );
}
