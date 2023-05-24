import React, { useEffect, useReducer, useState } from "react";
import { getFormField, updateFormField } from "../../../utils/apiUtils";
import { navigate } from "raviger";
import { FormFieldType, initialState } from "../../../types/formTypes";
import { FormReducer } from "../../../reducers/formReducer";
import { t } from "i18next";

export default function OptionAdder(props: {
  emptyFieldAlertCB: () => void;
  formId: number;
  formField: FormFieldType;
  handleOptionCreateCB: (updatedFormField: FormFieldType) => void;
}) {
  const { emptyFieldAlertCB, handleOptionCreateCB } = props;
  const [state, dispatchForm] = useReducer(FormReducer, initialState);
  const { formField, formId } = props;
  const [option, setOption] = useState("");
  useEffect(() => {
    const getForm = async () => {
      const form_field = await getFormField(formId, formField?.id as number);
      if (form_field?.id) {
        dispatchForm({
          type: "FETCH_FORM_FIELD",
          formField: formField as FormFieldType,
        });
      }
    };
    getForm();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formField]);
  const handleOptionCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //create an event for this
      if (option) {
        state?.formField?.options?.push(option as string);
        const updatedFormField: FormFieldType = await updateFormField(
          formId as number,
          state?.formField?.id as number,
          state?.formField
        );
        if (updatedFormField) {
          handleOptionCreateCB(updatedFormField);
          setOption("");
          navigate(`/forms/${formId}`);
        }
      } else {
        emptyFieldAlertCB();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex w-full ml-5  items-center justify-between">
      <form onSubmit={handleOptionCreate} className="w-full ml-5">
        <input
          className="border-2 border-gray-400 border-l-blue-500 rounded-lg p-2 m-2  h-10
        focus:outline-none focus:border-l-yellow-500 focus:border-l-8 w-2/3 align-middle"
          placeholder="Add Option"
          type="text"
          tabIndex={0}
          aria-label="Add Option"
          value={option || ""}
          onChange={(e) => {
            setOption(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 text-lg capitalize rounded-xl m-3  mx-auto h-10  focus:outline-none focus:bg-green-600
          hover:bg-green-600"
        >
          {t("add")}
        </button>
      </form>
    </div>
  );
}
