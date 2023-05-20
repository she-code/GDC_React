import React, { useEffect, useReducer, useState } from "react";
import { FormReducer } from "../../reducers/formReducer";
import {
  FormFieldType,
  initialState,
  FormFieldKind,
  Errors,
  validateFormField,
} from "../../types/formTypes";
import { updateFormField } from "../../utils/apiUtils";
import CustomInputField from "../common/CustomInputField";

export default function UpdateFormField(props: {
  formId: number;
  formField: FormFieldType;
}) {
  const { formField, formId } = props;
  const [formState, dispatch] = useReducer(FormReducer, initialState);
  const [errors, setErrors] = useState<Errors<FormFieldType>>({});

  useEffect(() => {
    dispatch({
      type: "FETCH_FORM_FIELD",
      formField: formField as FormFieldType,
    });
  }, [formField]);

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
                  type: "SET_FIELD_LABEL",
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
                  type: "SET_FIELD_KIND",
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
