import React, { useEffect, useReducer } from "react";
import {
  Answer,
  SubmissionType,
  submissionIntialState,
} from "../../types/responseTypes";
import {
  FormFieldType,
  RadioType,
  TextField,
  initialState,
} from "../../types/formTypes";
import RadioField from "../Form/Field/RadioField";
import { useNavigate } from "raviger";

import "react-toastify/dist/ReactToastify.css";

import CustomInputField from "../common/CustomInputField";
import CustomHeader from "../common/CustomHeader";
import NotFound from "../NotFound";
import { submissionReducer } from "../../reducers/submissionReducer";
import { createSubmission, getForm, getFormFields } from "../../utils/apiUtils";
import { FormReducer } from "../../reducers/formReducer";
import { Pagination } from "../../types/common";
import SelectField from "../Form/Field/SelectField";
import { getAuthToken } from "../../utils/storageUtils";
import Loading from "../common/Loading";

export default function PreviewQuestion(props: { id: number }) {
  const { id } = props;
  const [formState, dispatchForm] = useReducer(FormReducer, initialState);
  const navigate = useNavigate();
  const [responseState, dispatch] = useReducer(
    submissionReducer,
    submissionIntialState
  );
  const fieldIndex = responseState?.currentField ?? 0;

  //checks if the user is authenticated
  useEffect(() => {
    if (getAuthToken() === null) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetches form and formFields
  useEffect(() => {
    const get_Form = async () => {
      const form = await getForm(id);
      if (form?.id) {
        dispatchForm({
          type: "FETCH_FORM",
          form: form,
        });
        const formFields: Pagination<FormFieldType> = await getFormFields(
          { offset: 0, limit: 10 },
          form?.id
        );
        if (formFields?.results?.length > 0) {
          dispatchForm({
            type: "FETCH_FORM_FIELDS",
            formFields: formFields?.results,
          });
        }
      } else {
        dispatchForm({
          type: "FETCH_FORM_FAILURE",
          error: "Something went wrong",
        });
      }
    };
    get_Form();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //handles the checkbox input change
  const handleCheckboxChange = (option: string) => {
    if (responseState?.selectedOptions?.includes(option)) {
      dispatch({
        type: "SET_SELECTED_OPTION",
        selectedOptions: responseState?.selectedOptions?.filter(
          (item) => item !== option
        ),
      });
    } else {
      dispatch({
        type: "SET_SELECTED_OPTION",
        selectedOptions: [
          ...(responseState?.selectedOptions as string[]),
          option,
        ],
      });
    }
  };

  //initalizes the currentField and userResponse
  useEffect(() => {
    dispatch({
      type: "SET_FIELDS",
      currentField: 0,
      userRes:
        (responseState?.submission?.answers[fieldIndex]?.value as string) || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //increments the currentField value
  const handleNext = () => {
    if (!formState) {
      return;
    }
    if (fieldIndex <= formState?.formFields?.length - 1) {
      dispatch({
        type: "SET_FIELDS",
        currentField: fieldIndex + 1,
        userRes: "",
      });
    }
  };

  //decrements the currentField value
  const handlePrev = () => {
    if (responseState?.currentField && responseState?.currentField > 0) {
      dispatch({
        type: "SET_FIELDS",
        currentField: fieldIndex - 1,
        userRes: "",
      });
    }
  };

  //saves selected options in dropdown
  useEffect(() => {
    if (!formState || !responseState) {
      return;
    }
    dispatch({
      type: "UPDATE_BY_SELECTED",
      selectedOptions: responseState?.selectedOptions || [],
      state: formState,
      currentField: fieldIndex,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseState?.selectedOptions]);

  //updates the user response when input changes
  useEffect(() => {
    if (!formState || !responseState || !responseState.userRes) {
      return;
    }
    dispatch({
      type: "UPDATE_BY_USER_RES",
      userRes: responseState?.userRes,
      currentField: fieldIndex,
      state: formState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseState?.userRes]);

  //updates or creates response
  useEffect(() => {
    if (!responseState || !formState?.formFields?.length) {
      return;
    } else {
      let existingRes = responseState?.submission?.answers?.find(
        (res: Answer) => res.form_field === formState.formFields[fieldIndex]?.id
      );
      if (existingRes) {
        let currentValue = responseState?.submission?.answers.find(
          (ans) => ans.form_field === formState?.formFields[fieldIndex].id
        );
        dispatch({
          type: "SET_USER_RESPONSE",
          userRes: (currentValue?.value as string) || "",
        });
        if (formState?.formFields[fieldIndex]?.kind === "DROPDOWN") {
          dispatch({
            type: "SET_SELECTED_OPTION",
            selectedOptions: (currentValue?.value as string[]) || [],
          });
        }
        return;
      }

      dispatch({ type: "RESET_RESPONSES", userRes: "", selectedOptions: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldIndex]);

  //saves the response
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (formState?.formFields?.length) {
      timeout = setTimeout(() => {
        dispatch({
          type: "SET_ANSWER",
          fieldId: formState?.formFields[fieldIndex].id as number,
          value: (responseState?.userRes as string) || "",
        });
      }, 1000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseState]);

  const updateUserResponse = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_USER_RESPONSE", userRes: e.target.value });
  };

  //creates submission
  const handleSubmissionCreate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      dispatch({ type: "SET_FORM", form: formState?.form });
      const filteredAnswers = responseState?.submission?.answers.filter(
        (answer: Answer) => !(answer.form_field === 0 || answer.value === "")
      );
      const newSubmission = await createSubmission(id as number, {
        form: formState?.form,
        answers: filteredAnswers,
      });
      if (newSubmission) {
        dispatch({ type: "CREATE_SUBMISSION", submission: newSubmission });
        navigate(`/forms/${id}/submission/${newSubmission?.id}`);
      }
    } catch (error) {}
  };

  return formState?.loading ? (
    <Loading />
  ) : formState ? (
    <div className=" w-4/5 mx-auto">
      <h1 className="text-2xl font-semibold text-center capitalize">
        {formState?.form?.title}
      </h1>
      <form onSubmit={handleSubmissionCreate}>
        <div className="m-5 mt-8">
          {formState?.formFields?.length > 0 ? (
            <>
              {formState?.formFields[fieldIndex]?.kind === "TEXT" ? (
                <>
                  <CustomHeader
                    title={formState?.formFields[fieldIndex]?.label}
                    capitalize={true}
                  />
                  <CustomInputField
                    type={
                      (formState?.formFields[fieldIndex] as TextField)
                        ?.fieldType
                    }
                    value={(responseState?.userRes as string) ?? ""}
                    handleInputChangeCB={updateUserResponse}
                  />
                </>
              ) : (
                <div>
                  <>
                    {formState?.formFields[fieldIndex]?.kind === "RADIO" ? (
                      <>
                        <div>
                          <CustomHeader
                            title={formState?.formFields[fieldIndex]?.label}
                            capitalize={true}
                          />
                          <div className="  overflow-y-auto h-36 m-5">
                            {(formState?.formFields[fieldIndex] as RadioType)
                              .options.length > 0 ? (
                              <>
                                {(
                                  formState?.formFields[fieldIndex] as RadioType
                                ).options?.map((option, index) => (
                                  <RadioField
                                    type="radio"
                                    value={option}
                                    id={
                                      formState?.formFields[fieldIndex]
                                        ?.id as number
                                    }
                                    key={index}
                                    checked={responseState?.userRes === option}
                                    handleChangeCB={(e) => {
                                      dispatch({
                                        type: "SET_USER_RESPONSE",
                                        userRes: e.target.value,
                                      });
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
                      </>
                    ) : (
                      <SelectField
                        fieldIndex={fieldIndex}
                        handleCheckboxChangeCB={handleCheckboxChange}
                        responseState={(responseState as SubmissionType) || []}
                        state={formState}
                      />
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
          {fieldIndex === 0 ? (
            <div></div>
          ) : (
            <button
              className="bg-yellow-500 text-white rounded-lg py-2 px-2 h-10"
              onClick={(e) => {
                e.preventDefault();
                handlePrev();
              }}
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
          {fieldIndex === formState?.formFields?.length - 1 ? (
            ""
          ) : (
            <>
              {formState?.formFields?.length > 0 ? (
                <button
                  className="bg-green-500 text-white rounded-lg py-2 px-2 h-10"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
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
        {fieldIndex === formState?.formFields?.length - 1 ? (
          <div className="flex justify-center mb-5">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg py-2 px-3  w-1/3 text-lg"
              // onClick={handleSubmissionCreate}
            >
              Submit
            </button>
          </div>
        ) : (
          ""
        )}
      </form>
    </div>
  ) : (
    <NotFound />
  );
}
