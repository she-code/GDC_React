import React, { useState, useReducer } from "react";
import {
  Errors,
  FormItem,
  initialState,
  validateForm,
} from "../../types/formTypes";
import { navigate } from "raviger";
import CustomInputField from "../common/CustomInputField";
import { FormReducer } from "../../reducers/formReducer";
import { createForm } from "../../utils/apiUtils";
import { useTranslation } from "react-i18next";

export default function CreateForm() {
  const [formState, dispatch] = useReducer(FormReducer, initialState);
  const [errors, setErrors] = useState<Errors<FormItem>>({});
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formState?.form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await createForm(formState?.form);

        if (data?.id) {
          dispatch({ type: "CREATE_FORM", form: data });
          navigate(`/forms/${data.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <div className="p-2  ">
          <div className="flex items-center">
            <label htmlFor="title" className="text-lg font-semibold mr-2">
              {t("title")}
            </label>
            <CustomInputField
              handleInputChangeCB={(event) => {
                dispatch({
                  type: "SET_FORM_TITLE",
                  title: event.target.value,
                });
              }}
              type="text"
              value={formState?.form.title || ""}
              name="title"
            />
          </div>
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="p-2  ">
          <div className="flex items-center">
            <label htmlFor="description" className="text-lg font-semibold mr-2">
              {t("description")}
            </label>
            <CustomInputField
              handleInputChangeCB={(event) => {
                dispatch({
                  type: "SET_FORM_DESCRIPTION",
                  description: event.target.value,
                });
              }}
              type="text"
              name="description"
              value={formState.form.description || ""}
            />
          </div>
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="p-2  ">
          <div className="flex items-center justify-start">
            <input
              className="mr-2"
              onChange={(event) => {
                dispatch({
                  type: "SET_FORM_VISIBILITY",
                  is_public: event.target.checked,
                });
              }}
              type="checkbox"
              name="is_public"
              value={formState.form.is_public ? "true" : "false"}
            />
            <label htmlFor="is_public" className="text-lg font-semibold mr-2">
              {t("is_public")}
            </label>
          </div>
          {errors.is_public && (
            <p className="text-red-500">{errors.is_public}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 rounded py-2 px-3 text-white "
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
