import React, { useEffect, useReducer } from "react";
import CustomInputField from "./CustomInputField";
import { updateFormField } from "../utils/apiUtils";
import { FormReducer } from "../reducers/formReducer";
import { FormFieldType, initialState } from "../types/formReducerTypes";
import { FormFieldKind } from "../types/formTypes";

export default function UpdateFormField(props: {
  formId: number;
  formField: FormFieldType;
}) {
  const { formField, formId } = props;
  const [formState, dispatch] = useReducer(FormReducer, initialState);
  // const [errors, setErrors] = useState<Errors<FormItem>>({});

  useEffect(() => {
    dispatch({
      type: "FETCH_FORM_FIELD",
      formField: formField as FormFieldType,
    });
  }, [formField]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const validationErrors = validateForm(formState?.form);
    // setErrors(validationErrors);
    // if (Object.keys(validationErrors).length === 0) {
    try {
      if (formState.formField.id === undefined)
        throw Error("Form Id is undefined");
      const data = await updateFormField(
        formId,
        formState?.formField?.id,
        formState?.formField
      );
      console.log({ data, func: formState?.form });
      if (data?.id) {
        console.log("navigate");
        window.location.reload();
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
          {/* {errors.title && <p className="text-red-500">{errors.title}</p>} */}
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
              name="description"
              value={formState?.formField.kind || ""}
            />
          </div>
          {/* {errors.description && (
            <p className="text-red-500">{errors.description}</p> */}
          {/* )} */}
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
