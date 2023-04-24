import React from "react";
import EditableField from "./EditableField";
import OptionAdder from "./RadioOptionAdder";
import {
  DropdownField,
  RadioType,
  formData,
  formField,
} from "../types/formTypes";
import Divider from "./Divider";

export default function CustomFieldWithOption(props: {
  state: formData;
  setState: (state: formData) => void;
  id: number;
  field: formField;
  handleChangeCB: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  removeFieldCB: (id: number, label: string) => void;
  updateOptionCB: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    index: number
  ) => void;
}) {
  const {
    field,
    setState,
    handleChangeCB,
    state,
    removeFieldCB,
    updateOptionCB,
  } = props;
  return (
    <div key={field.id}>
      <div className="flex items-center w-full">
        <EditableField
          field={field}
          handleChangeCB={handleChangeCB}
          removeFieldCB={removeFieldCB}
        />
        <OptionAdder setState={setState} state={state} id={field.id} />
      </div>
      <>
        <p className="font-semibold text-lg">Options</p>
        <div className=" max-h-36 overflow-y-auto  border-3 border-gray-200 ml-3 divide divide-y-2 mb-3 w-3/4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300  scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {(field as DropdownField | RadioType).options.map(
            (option: string, index: number) => (
              <input
                className="border-0 border-l-blue-500 rounded-lg pt-1 pl-1 text-lg
                            my-2 w-full focus:outline-none focus:border-l-green-500 focus:border-l-8 "
                type="text"
                value={option}
                key={index}
                onChange={(e) => updateOptionCB(e, field.id, index)}
              />
            )
          )}
        </div>
      </>
      <Divider />
    </div>
  );
}
