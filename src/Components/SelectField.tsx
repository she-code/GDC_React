import React, { useState } from "react";
import CustomHeader from "./CustomHeader";
import { DropdownField, formData } from "../types/formTypes";
import { responseData } from "../types/responseTypes";

export default function SelectField(props: {
  state: formData;
  fieldIndex: number;
  responseState: responseData;
  handleCheckboxChangeCB: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, fieldIndex, responseState, handleCheckboxChangeCB } = props;

  return (
    <div className="flex items-center">
      <CustomHeader
        title={state.formFields[fieldIndex]?.label}
        capitalize={true}
      />
      <div className="ml-4  w-1/3">
        {(state.formFields[fieldIndex] as DropdownField).options.length > 0 ? (
          <>
            <button
              className="py-2 px-3 mt-5 border-2 border-gray-300 w-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {Array.isArray(responseState?.selectedOptions) &&
              responseState?.selectedOptions.length > 0
                ? responseState?.selectedOptions.join(" , ")
                : "No options selected"}
            </button>
            {isOpen && (
              <ul className="shadow-lg bg-gray-300 w-full">
                {(state.formFields[fieldIndex] as DropdownField).options.map(
                  (option) => (
                    <li key={option}>
                      <label>
                        <input
                          type="checkbox"
                          checked={responseState?.selectedOptions?.includes(
                            option
                          )}
                          onChange={() => {
                            handleCheckboxChangeCB(option);
                          }}
                        />
                        {option}
                      </label>
                    </li>
                  )
                )}
              </ul>
            )}
          </>
        ) : (
          <p className="block">No options are added</p>
        )}
      </div>
    </div>
  );
}
