import React, { useState } from "react";
import { Errors, FormItem, validateForm } from "../types/formTypes";
import { navigate } from "raviger";
import CustomInputField from "./CustomInputField";
import { createForm } from "../utils/apiUtils";

export default function CreateForm() {
  const [form, setForm] = useState<FormItem>({
    title: "",
    description: "",
    is_public: false,
  });
  const [errors, setErrors] = useState<Errors<FormItem>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await createForm(form);
        navigate(`/forms/${data.id}`);
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
              Title
            </label>
            <CustomInputField
              handleInputChangeCB={handleChange}
              type="text"
              value={form.title}
              name="title"
            />
          </div>
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="p-2  ">
          <div className="flex items-center">
            <label htmlFor="description" className="text-lg font-semibold mr-2">
              description
            </label>
            <CustomInputField
              handleInputChangeCB={handleChange}
              type="text"
              name="description"
              value={form.description || ""}
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
              onChange={handleChange}
              type="checkbox"
              name="is_public"
              value={form.is_public ? "true" : "false"}
            />
            <label htmlFor="is_public" className="text-lg font-semibold mr-2">
              Is Public
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
          Submit
        </button>
      </form>
    </div>
  );
}
