import { useState } from "react";
import { RadioType, formField } from "../types/formTypes";
import CustomHeader from "./CustomHeader";

function ColorPicker(props: {
  value: string;
  field: formField;
  setColorCB: (color: string) => void;
}) {
  const [color, setColor] = useState("");
  const { value, setColorCB, field } = props;

  return (
    <div>
      <CustomHeader title={field?.label} capitalize={true} />
      {(field as RadioType).options?.length === 0 ? (
        <div>No options are added</div>
      ) : (
        <div className="flex mt-3">
          <input
            type="text"
            value={value}
            onChange={(event) => setColor(event.target.value)}
            disabled
            className="flex-grow border border-gray-400 px-4 py-2 mr-4 rounded-lg foucs:outline-none "
          />
          <div className="flex items-center">
            {(field as RadioType).options?.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColorCB(c)}
                className={`w-6 h-6 rounded-full mr-2 cursor-pointer focus:outline-none ${
                  color === c ? "ring ring-green-500" : ""
                }`}
                style={{ backgroundColor: c }}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
