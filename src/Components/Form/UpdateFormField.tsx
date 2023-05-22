import React, { useEffect, useReducer, useState } from "react";
import { FormReducer } from "../../reducers/formReducer";
import {
  FormFieldType,
  initialState,
  FormFieldKind,
  Errors,
  validateFormField,
} from "../../types/formTypes";
import { getForm, getFormFields, updateFormField } from "../../utils/apiUtils";
import CustomInputField from "../common/CustomInputField";
import { Pagination } from "../../types/common";

export default function UpdateFormField(props: {
  formId: number;
  formField: FormFieldType;
}) {
  const { formField, formId } = props;
  const [formState, dispatch] = useReducer(FormReducer, initialState);
  const [errors, setErrors] = useState<Errors<FormFieldType>>({});
  const [optionValues, setOptionValues] = useState(
    formState?.formField?.options || []
  );

  //updates option values
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...optionValues];
    updatedOptions[index] = value;
    setOptionValues(updatedOptions);

    dispatch({
      type: "UPDATE_FIELD_OPTION",
      fieldId: formState?.formField?.id as number,
      index: index,
      option: value,
    });
  };
  useEffect(() => {
    dispatch({
      type: "FETCH_FORM_FIELD",
      formField: formField as FormFieldType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //fetches forms and fields
  useEffect(() => {
    const get_Form = async () => {
      const form = await getForm(formId);
      if (form?.id) {
        dispatch({ type: "FETCH_FORM", form: form ? form : { title: "" } });
        const formFields: Pagination<FormFieldType> = await getFormFields(
          { offset: 0, limit: 5 },
          form?.id
        );
        if (formFields?.results) {
          dispatch({
            type: "FETCH_FORM_FIELDS",
            formFields: formFields?.results,
          });
        }
      } else {
        dispatch({ type: "FETCH_FORM_FAILURE", error: "Something went wrong" });
      }
    };
    get_Form();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (formState?.formField?.id === undefined)
        throw Error("Form Id is undefined");
      const validationErrors = validateFormField(formState?.formField);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        const data = await updateFormField(
          formId,
          formState?.formField?.id,
          formState?.formField
        );
        if (data?.id) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
    // }
  };
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <div className="p-2  ">
          <div className="flex items-center">
            <label htmlFor="label" className="text-lg font-semibold mr-2">
              Label
            </label>
            <CustomInputField
              handleInputChangeCB={(event) => {
                dispatch({
                  type: "UPDATE_FIELD_LABEL",
                  label: event.target.value,
                });
              }}
              type="text"
              value={formState?.formField.label || ""}
              name="label"
            />
          </div>
          {errors.label && <p className="text-red-500">{errors.label}</p>}
        </div>
        <div className="p-2  ">
          <div className="flex items-center">
            <label htmlFor="kind" className="text-lg font-semibold mr-2">
              Kind
            </label>
            <CustomInputField
              handleInputChangeCB={(event) => {
                dispatch({
                  type: "UPDATE_FIELD_KIND",
                  kind: event.target.value.toUpperCase() as FormFieldKind,
                });
              }}
              type="text"
              name="kind"
              value={formState?.formField.kind || ""}
            />
          </div>
          {errors.kind && <p className="text-red-500">{errors.kind}</p>}
        </div>
        {formState?.formField?.kind !== "TEXT" && (
          <p className="font-semibold text-lg">Options</p>
        )}
        <div className=" max-h-36 overflow-y-auto  border-3 border-gray-200 ml-3 divide divide-y-2 mb-3 w-3/4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {formState?.formField?.options &&
          formState?.formField?.options?.length === 0 ? (
            <>No options</>
          ) : (
            <div key={formState?.formField?.id}>
              {formState?.formField?.options?.map(
                (option: string, index: number) => (
                  <div key={index} className="flex  w-5/12 ml-3">
                    <input
                      className="border-0 border-l-blue-500 rounded-lg pt-1 pl-1 text-lg
                            my-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8 "
                      type="text"
                      value={option}
                      onChange={(e) => {
                        handleOptionChange(index, e.target.value);
                      }}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 rounded py-2 px-3 text-white "
        >
          Submit
        </button>
      </form>
    </div>
  );
}
