import React from "react";
import EditableField from "../../common/EditableField";
import OptionAdder from "./OptionAdder";
import {
  ColorField,
  DropdownField,
  FormFieldType,
  RadioType,
} from "../../../types/formTypes";
import Divider from "../../common/Divider";

export default function CustomFieldWithOption(props: {
  id: number;
  field: FormFieldType;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  removeFieldCB: (id: number, label: string) => void;
  updateOptionCB: (option: string, index: number) => void;
  emptyFieldAlertCB: () => void;
  removeOptionCB: (optionId: number) => void;
  formId: number;
  handleOptionCreateCB: (updatedFormField: FormFieldType) => void;
}) {
  const {
    field,
    removeOptionCB,
    handleChangeCB,
    removeFieldCB,
    updateOptionCB,
    emptyFieldAlertCB,
    handleOptionCreateCB,
    formId,
  } = props;
  return (
    <div>
      <div className="flex items-center w-full" key={field.id}>
        <EditableField
          field={field}
          formId={formId}
          handleChangeCB={handleChangeCB}
          removeFieldCB={removeFieldCB}
        />
        <OptionAdder
          key={field.id}
          emptyFieldAlertCB={emptyFieldAlertCB}
          formId={formId}
          formField={field}
          handleOptionCreateCB={handleOptionCreateCB}
        />
      </div>
      <>
        <p className="font-semibold text-lg">Options</p>
        <div
          className=" max-h-36 overflow-y-auto  border-3 border-gray-200 ml-3 divide divide-y-2 mb-3 w-3/4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full
"
        >
          {field?.options && field?.options?.length === 0 ? (
            <>No options</>
          ) : (
            <div key={field.id}>
              {(field as DropdownField | RadioType | ColorField).options?.map(
                (option: string, index: number) => (
                  <div key={index} className="flex  w-5/12 ml-3">
                    <input
                      className="border-0 border-l-blue-500 rounded-lg pt-1 pl-1 text-lg
                            my-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8 "
                      type="text"
                      value={option}
                      onChange={(e) => updateOptionCB(e.target.value, index)}
                    />
                    <button
                      className=" py-2 px-3 text-red-500  focus:outline-none focus:bg-neutral-100 focus:text-red-600"
                      onClick={(_) => removeOptionCB(index)}
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </>
      <Divider />
    </div>
  );
}
