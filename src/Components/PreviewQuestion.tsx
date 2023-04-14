import React, { useEffect, useState } from "react";
interface formData {
  id: number;
  title: string;
  formFields: formField[];
}
interface formField {
  id: number;
  label: string;
  fieldType: string;
  value: string;
}
interface responseType {
  question: string;
  response: string;
}
interface responseData {
  id: number;
  formId: number;
  formTitle: string;
  responses: responseType[];
}
const getLocalForms: () => formData[] = () => {
  const savedFormsJson = localStorage.getItem("savedForms");
  return savedFormsJson ? JSON.parse(savedFormsJson) : [];
};
const initialState: (id: number) => formData = (id: number) => {
  const localForms = getLocalForms();
  const selectedForm = localForms!.find((form) => form.id === id);
  return selectedForm!;
};

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
  const [state, setState] = useState(() => initialState(id!));
  const [currentField, setCurrentField] = useState(0);

  const initialResponse: (id: number) => responseData = (id) => {
    const localResponses = getLocalResponses();
    const selectedResponse = localResponses!.find(
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
  };
  const [responseState, setResponse] = useState(initialResponse(id));
  const [userRes, setUserRes] = useState("");

  const addResponse = () => {
    setResponse({
      ...responseState,
      responses: [
        ...responseState.responses,
        {
          question: state.formFields[currentField].label!,
          response: userRes,
        },
      ],
    });
    setUserRes("");
    console.log(responseState);
  };
  const handleNext = () => {
    if (currentField <= state.formFields.length - 1) {
      setCurrentField(currentField + 1);
    }
  };
  const handlePrev = () => {
    if (currentField > 0) {
      setCurrentField(currentField - 1);
      console.log(currentField);
    }
  };
  // useEffect(() => {
  //   console.log(userRes);

  //   setResponse({
  //     ...responseState,
  //     responses: [
  //       ...responseState.responses,
  //       {
  //         question: state.formFields[currentField].label!,
  //         response: userRes,
  //       },
  //     ],
  //   });
  //   setUserRes("");
  // }, [currentField]);
  const prevField = React.useRef(-1);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    console.log("called");
    const existingData = [...responseState.responses];
    let valueToUpdate = existingData.find((field) => field.question === label);
    valueToUpdate!.response! = e.target.value;
    console.log(valueToUpdate);
    setResponse({
      ...responseState,
      responses: existingData,
    });
  };
  useEffect(() => {
    const existingData = [...responseState.responses];
    let valueToUpdate = existingData.find(
      (field) => field.question === state.formFields[currentField].label
    );
    if (valueToUpdate !== undefined && valueToUpdate.response !== undefined) {
      valueToUpdate.response = userRes;
    }
    setResponse({
      ...responseState,
      responses: existingData,
    });
  }, [userRes]);

  useEffect(() => {
    userRes
      ? setResponse({
          ...responseState,
          responses: [
            ...responseState.responses,
            {
              question: state.formFields[currentField].label!,
              response: userRes,
            },
          ],
        })
      : setResponse(responseState);
    prevField.current = currentField;
    setUserRes("");
    console.log(responseState);
  }, [currentField]);
  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     saveResponseData(responseState);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [responseState]);

  // useEffect(() => {
  //   if (userRes !== "" && currentField !== prevField.current) {
  //     setResponse((prevState) => ({
  //       ...prevState,
  //       responses: [
  //         ...prevState.responses,
  //         {
  //           question: state.formFields[prevField.current].label!,
  //           response: userRes,
  //         },
  //       ],
  //     }));
  //     setUserRes("");
  //     prevField.current = currentField;
  //   }
  //   console.log(responseState);
  // }, [currentField, userRes]);
  return (
    <div className="h-64">
      {/* {responseState.responses.length > 0 ? (
        <div>
          <p className="text-xl font-semibold">
            {responseState.responses[currentField].question}{" "}
          </p>
        </div>
      ) : ( */}
      <div className="m-3">
        <p className="text-xl font-semibold">
          {state.formFields[currentField].label}
        </p>
        <input
          className="border-2 border-gray-200 border-l-blue-500 rounded-lg p-3 m-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8"
          type={state.formFields[currentField].fieldType}
          value={userRes}
          onChange={(e) => {
            setUserRes(e.target.value);
          }}
        />
      </div>
      {/* )} */}
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
          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-3 w-20"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
      <button
        className="bg-blue-500 text-white rounded-lg py-2 px-3 w-20"
        onClick={(_) => saveResponseData(responseState)}
      >
        submit
      </button>
    </div>
  );
}
