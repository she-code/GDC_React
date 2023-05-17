import React, { useEffect, useReducer, useState } from "react";
import { updateFormField } from "../utils/apiUtils";
import { FormReducer } from "../reducers/formReducer";
import { FormFieldType, initialState } from "../types/formReducerTypes";
import { navigate } from "raviger";

export default function OptionAdder(props: {
  emptyFieldAlertCB: () => void;
  formId: number;
  formField: FormFieldType;
  // addOptionCB: (e: React.ChangeEvent<HTMLFormElement>) => void;
}) {
  const { emptyFieldAlertCB } = props;
  // const [option, setOption] = useState("");
  const [formState, dispatch] = useReducer(FormReducer, initialState);
  // const [errors, setErrors] = useState<Errors<FormItem>>({});
  const { formField, formId } = props;
  useEffect(() => {
    dispatch({
      type: "FETCH_FORM_FIELD",
      formField: formField as FormFieldType,
    });
  }, [formField]);
  const handleOptionCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formState?.formField?.options, {
        option: formState?.userRes,
      });

      //create an event for this
      formState?.formField?.options?.push(formState?.userRes as string);
      const updatedFormField = await updateFormField(
        formId as number,
        formState?.formField.id as number,
        formState?.formField
      );
      if (updatedFormField) {
        console.log({ updatedFormField });
        dispatch({
          type: "UPDATE_FORM_FIELD",
          fieldId: updatedFormField?.id as number,
          formField: updatedFormField,
        });
        // window.location.reload();
        dispatch({
          type: "SET_OPTION",
          option: "",
        });
        navigate(`/forms/${formState?.form?.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
            // setOption(e.target.value);
            console.log(e.target.value);
            dispatch({
              type: "SET_OPTION",
              option: e.target.value,
            });
            console.log(formState?.userRes, "userRes");
          }}
        />

        <button
          onClick={(_) => {
            // if (!option) {
            //   emptyFieldAlertCB();
            //   return;
            // }
          }}
          className="bg-green-600 text-white px-3 text-lg capitalize rounded-xl m-3  mx-auto h-10"
        >
          Add
        </button>
      </form>
    </div>
  );
}
