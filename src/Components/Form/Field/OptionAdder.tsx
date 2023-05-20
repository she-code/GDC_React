import React, { useEffect } from "react";
import { updateFormField } from "../../../utils/apiUtils";
import { navigate } from "raviger";
import { FormFieldType, FormIntialState } from "../../../types/formTypes";
import { FormAction } from "../../../actions/formReducerActions";

export default function OptionAdder(props: {
  emptyFieldAlertCB: () => void;
  formId: number;
  formField: FormFieldType;
  formState: FormIntialState;
  dispatch: (attr: FormAction) => void;
  // handleOptionCreateCB: (option: string) => void;
}) {
  const { emptyFieldAlertCB, formState, dispatch } = props;
  const { formField, formId } = props;
  useEffect(() => {
    dispatch({
      type: "FETCH_FORM_FIELD",
      formField: formField as FormFieldType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formField]);
  const handleOptionCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //create an event for this
      if (formState?.userRes) {
        formState?.formField?.options?.push(formState?.userRes as string);
        const updatedFormField: FormFieldType = await updateFormField(
          formId as number,
          formState?.formField?.id as number,
          formState?.formField
        );
        if (updatedFormField) {
          console.log("hi", updatedFormField);
          dispatch({
            type: "UPDATE_FORM_FIELD",
            fieldId: updatedFormField?.id as number,
            formField: updatedFormField,
          });
          console.log(formState?.formField, "d");
          // window.location.reload();
          dispatch({
            type: "SET_OPTION",
            option: "",
          });
          navigate(`/forms/${formId}`);
        }
      } else {
        emptyFieldAlertCB();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log("op");
  //   handleOptionCreateCB(formState?.userRes);
  // };
  return (
    <div className=" flex w-4/5 ml-5 pl-5 items-center">
      <form onSubmit={handleOptionCreate}>
        <input
          className="border-2 border-gray-400 border-l-blue-500 rounded-lg p-2 m-2  h-10
        focus:outline-none focus:border-l-yellow-500 focus:border-l-8 w-2/3 align-middle"
          placeholder="Add Option"
          type="text"
          value={formState?.userRes || ""}
          onChange={(e) => {
            dispatch({
              type: "SET_OPTION",
              option: e.target.value,
            });
          }}
        />

        <button
          onClick={(_) => {
            console.log("clikc");
          }}
          className="bg-green-600 text-white px-3 text-lg capitalize rounded-xl m-3  mx-auto h-10"
        >
          Add
        </button>
      </form>
    </div>
  );
}
