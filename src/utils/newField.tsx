import { formField, textFieldTypes } from "../types/formTypes";

export const getNewField: (
  fieldType: textFieldTypes,
  label: string
) => formField = (fieldType, label) => {
  if (fieldType === "select") {
    return {
      id: Number(new Date()),
      label: label,
      value: "",
      kind: "DROPDOWN",
      options: [],
    };
  } else if (fieldType === "radio") {
    return {
      id: Number(new Date()),
      label: label,
      value: "",
      kind: "RADIO",
      options: [],
    };
  } else if (fieldType === "color") {
    return {
      id: Number(new Date()),
      label: label,
      value: "",
      kind: "COLOR",
      options: [],
    };
  } else
    return {
      id: Number(new Date()),
      kind: "TEXT",
      label: label,
      fieldType: fieldType,
      value: "",
    };
};
