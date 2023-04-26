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
      kind: "dropdown",
      options: [],
    };
  } else if (fieldType === "radio" || fieldType === "color") {
    return {
      id: Number(new Date()),
      label: label,
      fieldType: fieldType,
      value: "",
      kind: "radio",
    };
  } else
    return {
      id: Number(new Date()),
      kind: "text",
      label: label,
      fieldType: fieldType,
      value: "",
    };
};
